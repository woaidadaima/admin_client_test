import { Button, Card, message, Modal, Table } from 'antd'
import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { reqAddOrUpadateUser, reqDeleUser, reqUserList } from '../../api'
import LinkButton from '../../componets/LinkButton'
import { PAGE_SIZE } from '../../utils/constant'
import timeFormat from '../../utils/dateFormat'
import { ExclamationCircleFilled } from '@ant-design/icons';
import AddUpdateForm from './add_update-form'


export default function Users() {
    // 定义子组件容器
    const addOrUpdate = useRef()
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [user, setUser] = useState([])
    // 获取用户列表
    const getUserList = async () => {
        let result = await reqUserList()
        if (result.status === 0) {
            setUsers(result.data.users)
            setRoles(result.data.roles)
        }
    }
    // 根绝角色Id生成对应的角色
    const rolesNmae = roles.reduce((pre, current) => {
        pre[current._id] = current.name
        return pre
    }, {})
    useEffect(() => {
        getUserList()
    }, [])
    const userList = users.map((item) => {
        item.key = item._id
        return item
    })
    // 删除用户
    const deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗？`,
            icon: <ExclamationCircleFilled />,
            onOk: async () => {
                // 发请求删除用户
                let result = await reqDeleUser({ userId: user._id })
                if (result.status === 0) {
                    message.success('删除用户成功')
                    // 重新获取用户列表
                    getUserList()
                }
            },
        });
    }
    // 更新用户
    const updateUser = (user) => {
        setUser(user)
        setIsModalOpen(true);
    }
    const initColumns = [
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
        },
        {
            title: '电话',
            dataIndex: 'phone',
        },
        {
            title: '注册时间',
            dataIndex: 'create_time',
            render: (time) => timeFormat(time)
        },
        {
            title: '所属角色',
            dataIndex: 'role_id',
            // render: (role_id) => roles.find(role => role._id === role_id).name
            render: (role_id) => rolesNmae[role_id]
        },
        {
            title: '操作',
            render: (user) => <>
                <LinkButton onClick={() => updateUser(user)}>修改</LinkButton>
                <LinkButton onClick={() => deleteUser(user)}>删除</LinkButton>
            </>
        },

    ]
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {
        const userInfo = addOrUpdate.current.getFieldsValue()
        // 收集数据，发请求
        if (user._id) {
            userInfo._id = user._id
        }
        let result = await reqAddOrUpadateUser(userInfo)
        if (result.status === 0) {
            message.success(`${user._id ? '修改' : '添加'}用户成功`)
            setIsModalOpen(false);
            // 重新请求用户列表
            getUserList()
            // 重置表单
            addOrUpdate.current.resetFields()
            // 重置用户，防止再次打开出现
            setUser({})
        }
    };
    const handleCancel = () => {
        //    重置表单内容
        // console.log(addOrUpdate);
        addOrUpdate.current.resetFields()
        setUser({})
        setIsModalOpen(false);
    };
    // 标题
    const title = <Button type='primary' onClick={showModal}>创建用户</Button>
    return (
        <Card title={title}>
            <Table
                rowKey={users._id}
                bordered
                dataSource={userList}
                columns={initColumns}
                pagination={
                    {
                        pageSize: PAGE_SIZE
                    }
                }
            />
            <Modal
                title={`${user._id ? '修改' : '添加'}用户`}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose
            >
                <AddUpdateForm roleList={roles} ref={addOrUpdate} user={user} />
            </Modal>
        </Card>
    )
}
