import React from 'react'
import './index.less'
// 引入Logo图片
import logo from '../../assets/images/logo.png'
// 引入登录表单组件
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

// 引入路由组件
import { Navigate, } from "react-router-dom";

import { connect } from 'react-redux';
import { login } from '../../redux/actions';

function Login(props) {
    // 统一设置错误提示信息
    /* const validateMessages = {
        required: "${name}必须输入",
        // ...
        whitespace: '${name}不能为空格',
        string: {
            min: '${name}至少4位',
            max: '${name}最多12位',
        },
        pattern: {
            mismatch: '${name}必须是英文、数字或下划线组成'
        }
    }; */
    // 自定义验证密码
    const validatorPwd = (_, value) => {
        //函数体
        if (!value) {
            return Promise.reject('密码必须输入')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return Promise.reject('密码必须是英文、数字或下划线组成')
        } else if (value.length < 4) {
            return Promise.reject('密码长度不能小于4位')
        } else if (value.length > 12) {
            return Promise.reject('密码长度不能超过12位')
        } else { return Promise.resolve() }
    }

    // 提交表单函数成功执行回调
    const onFinish = (values) => {
        // 发送ajax请求
        // const result = await reqLogin(values)
        // if (result.status === 0) {
        //     message.success('登录成功');
        //     // 将用户信息保存到内存中
        //     memory.user = result.data
        //     // localStorage.setItem('user_key', JSON.stringify(result.data))
        //     setUser(result.data)
        //     // 登录成功跳转到admin页面
        // navigate('/home', {
        //     replace: true,
        // })
        // } else {
        //     message.error(result.msg)
        // }
        props.login(values)
        // if (getUser().username) {

        // }
    }

    // 提交表单失败执行回调
    /* const onFinishFailed = ({ values, errorFields, outOfDate }) => {
         //函数体
         console.log(values, errorFields, outOfDate);
     } */
    // 表单字段值改变触发回调
    /*   const onValuesChange = (changedValues, allValues) => {
      //函数体
      console.log(changedValues);
  }  */
    // 如果用户信息存在，路由跳转回admin页面
    if (props.user && props.user._id) {
        return <Navigate to='/' replace={true} />
    }
    return (
        <div className="login">
            <header className="login-header">
                <img src={logo} alt="" />
                <h1>React项目: 后台管理系统</h1>
            </header>
            <section className="login-body">
                <div className={props.user.errorMsg ? 'login-error show' : 'login-error'}>{props.user.errorMsg}</div>
                <h2>用户登录</h2>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    // onFinishFailed={onFinishFailed}
                    onFinish={onFinish}
                // onValuesChange={onValuesChange}
                // validateMessages={validateMessages}
                >
                    <Form.Item
                        name="username"
                        validateFirst={true}
                        initialValue='admin'
                        rules={[
                            { required: true, whitespace: true, message: '用户名必须输入' },
                            { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                            { min: 4, message: '用户名至少4位' },
                            { max: 12, message: '用户名最多12位' },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                validator: validatorPwd
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </section>
        </div >
    )
}
export default connect(
    state => ({
        user: state.user,
        errorMsg: state.errorMsg
    }),
    {
        login,
    }
)(Login)
