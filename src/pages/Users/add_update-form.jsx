import { Form, Input, Select } from 'antd'
import React from 'react'
import { forwardRef } from 'react';
const AddUpdateForm = forwardRef((props, ref) => {
    const { roleList, user } = props
    // const { username, phone, email, role_id } = user
    const formItemLayout = {
        labelCol: {
            span: 4,
        },
        wrapperCol: {
            span: 15,
        },
    };
    const [form] = Form.useForm()
    // 重置表单数据
    // const resetForm = () => {
    //     form.resetFields()
    // }
    // // 提交表单
    // const addOrUpdateUser = () => form.getFieldsValue()

    // useImperativeHandle(ref, () => ({
    //     resetForm,
    //     addOrUpdateUser
    // }))
    return (
        <Form
            ref={ref}
            form={form}
            {...formItemLayout}
        >
            <Form.Item label="用户名" name='username' initialValue={user.username}>
                <Input placeholder='请输入用户名' />
            </Form.Item>
            {
                user._id ? null :
                    <Form.Item label="密码" name='password' >
                        <Input type='password' placeholder='请输入密码' />
                    </Form.Item>
            }

            <Form.Item label="手机号" name='phone' initialValue={user.phone}>
                <Input placeholder='请输入手机号' />
            </Form.Item>
            <Form.Item label="邮箱" name='email' initialValue={user.email}>
                <Input placeholder='请输入邮箱' />
            </Form.Item>
            <Form.Item label="角色" name='role_id' initialValue={user.role_id}>
                <Select placeholder="请选择角色">
                    {roleList.map((role) => <Select.Option value={role._id} key={role._id}>{role.name}</Select.Option>)}
                </Select>
            </Form.Item>

        </Form>
    )
})
export default AddUpdateForm