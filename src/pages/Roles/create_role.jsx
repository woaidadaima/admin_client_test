import React from 'react'
import { Form, Input, message, Modal } from "antd";
import { useState, forwardRef, useImperativeHandle } from "react";
import { reqAddRole } from '../../api';
const CreateRole = forwardRef((props, ref) => {
    // 接受父组件传的数组
    const { roleList, getRoleList } = props
    const [form] = Form.useForm()
    const [isModalOpen, setIsModalOpen] = useState(false);
    // 打开对话框
    const showModal = () => {
        setIsModalOpen(true);
    };
    // 添加角色的回调
    const handleOk = () => {
        // 表单验证通过关闭对话框病发送请求
        form.validateFields(['roleName']).then(
            async value => {
                setIsModalOpen(false);
                let result = await reqAddRole(value)
                if (result.status === 0) {
                    message.success('添加角色成功')
                    // 重置输入框内容
                    form.resetFields(['roleName'])
                    // 重新获取角色列表
                    getRoleList()
                } else {
                    message.error('添加角色失败')
                }
            }
        )
    };
    // 取消操作的回调
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    // 将子组件方法通过ref传递给父组件
    useImperativeHandle(ref, () => ({
        showModal,
    }))
    return (
        <Modal
            title="添加角色"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form
                form={form}
            >
                <Form.Item
                    validateFirst={true}
                    label="角色名称"
                    name="roleName"
                    rules={
                        [
                            {
                                required: true,
                                message: '角色名称必须输入'
                            },
                            {
                                validator: (_, value) => {
                                    // 输入不能为空格且不能输入重复值
                                    const rolename = roleList.find(item => item.name === value)
                                    if (value.trim() === '') {
                                        return Promise.reject('角色名称不能为空格')
                                    } else if (rolename) {
                                        return Promise.reject('当前角色名已存在，请重新输入')
                                    } else {
                                        return Promise.resolve()
                                    }
                                }
                            }
                        ]
                    }
                >
                    <Input placeholder='请输入角色名称' />
                </Form.Item>
            </Form>
        </Modal>
    )
})
export default CreateRole
