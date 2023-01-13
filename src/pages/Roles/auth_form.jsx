import { Form, Input, message, Modal, Tree } from 'antd'
import React, { forwardRef, useState } from 'react'
import { useEffect } from 'react';
import { useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { reqSetRoleAuth } from '../../api';
import menuList from '../../config/menuconfig';
import memory from '../../utils/memoryUtils';
import { getUser, removeUser } from '../../utils/storageUtils';

const AuthForm = forwardRef((props, ref) => {
    const navigate = useNavigate()
    // 接受父组件传递的props
    let { selectRole, getRoleList } = props

    useEffect(() => {
        // selectRole变化时自动更新tree中的选项
        setCheckKey(selectRole.menus)
    }, [selectRole])
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 定于树中的checkkey
    const [checkedKey, setCheckKey] = useState()
    // 选中复选框时的回调
    const onCheck = (checkedKeys) => {
        // console.log('onCheck', checkedKeys);
        setCheckKey([...checkedKeys])
    };
    // 将ShowModal暴露给父组件
    useImperativeHandle(ref, () => ({
        showModal
    }))
    // 打开对话框
    const showModal = () => {
        // 将当前角色设置为选中的行
        // setRole(selectRole)
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        // 收集数据发请求
        const data = {
            menus: checkedKey,
            _id: selectRole._id,
            auth_name: getUser().username,
            auth_time: Date.now()
        }
        let result = await reqSetRoleAuth(data)
        if (result.status === 0) {
            // 更新角色菜单
            selectRole.menus = result.data.menus
            setIsModalOpen(false);
            // 如果修改的是当前登录的角色权限，则退出登录并清除登录信息
            if (memory.user.role.name === selectRole.name) {
                message.info('当前角色已修改，请重新登陆')
                // 清空内存中的user
                memory.user = {}
                // 清空浏览器缓存
                removeUser()
                navigate('/login', {
                    replace: true
                })
            } else {
                message.success('设置角色权限成功')
                // 重新请求角色列表
                getRoleList()
            }
        } else {
            message.error('设置角色权限失败')
        }
    };
    // 取消操作的回调
    const handleCancel = () => {
        // 重置menus
        setCheckKey(selectRole.menus)
        setIsModalOpen(false);
    };
    const treeData = [
        {
            title: '平台权限',
            key: 'all',
            children: menuList.map((item) => {
                if (item.children) {
                    return ({
                        title: item.title,
                        key: item.key,
                        children: item.children.map((subItem) => (
                            {
                                title: subItem.title,
                                key: subItem.key,
                            }
                        ))
                    })
                } else return ({
                    title: item.title,
                    key: item.key
                })
            })
        }
    ];
    return (
        <Modal
            title="设置角色权限"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            destroyOnClose
        >
            <Form >
                <Form.Item
                    label={'角色名称'}
                    wrapperCol={
                        {
                            span: 14,
                        }
                    }
                >
                    <Input
                        value={selectRole.name}
                        disabled
                    />
                </Form.Item>
            </Form>
            <Tree
                checkedKeys={checkedKey}
                defaultExpandAll
                checkable
                onCheck={onCheck}
                treeData={treeData}
            />
        </Modal>
    )
})
export default AuthForm
