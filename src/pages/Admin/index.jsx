import React from 'react'
import { Outlet, useRoutes } from 'react-router-dom';
import { Layout } from 'antd';
import LeftNav from '../../componets/LeftNav';
// 引入路由表
import routes from '../../routes'
import Header from '../../componets/Header';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
const { Footer, Content } = Layout;
function Admin(props) {
    // const user = memory.user
    const element = useRoutes(routes)
    // 用户信息不存在，重定向到登录页面

    if (!(props.user && props.user._id)) {
        return <Navigate to='/login' replace={true} />
    }
    return (
        <Layout style={{ minHeight: '100%' }}>
            <LeftNav />
            <Layout >
                <Header />
                <Content style={{ backgroundColor: 'white', margin: '20px' }}>{element}</Content>
                <Outlet />
                <Footer style={{ textAlign: 'center', color: '#ccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
            </Layout>
        </Layout>
    )
}
export default connect(
    state => ({ user: state.user })
)(Admin)
