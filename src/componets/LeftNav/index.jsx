import React from 'react'
import { Layout } from 'antd';
import logo from '../../assets/images/logo.png'
import './index.less'
import { Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import menuList from '../../config/menuconfig';
import { connect } from 'react-redux';
import { setTitle } from '../../redux/actions';
import { useState, useEffect } from 'react';
const { Sider } = Layout;
function LeftNav(props) {
    // 获取当前路径
    let { pathname } = useLocation()
    // 定于目录列表
    const [items, setItems] = useState([])
    const getItem = (label, key, icon, children) => children ? ({ label, key, icon, children: mapList(children) }) : ({ label, key, icon })
    // 遍历动态生成目录
    // const mapList = (List) => List.map((item) => {
    //     if (hasAuth(item)) {
    //         const { title, key, icon, children } = item
    //         return getItem(title, key, icon, children ? mapList(children) : null)
    //     }
    //     return 0
    // })
    const mapList = (List) => List.reduce((previousValue, currentValue) => {
        if (hasAuth(currentValue)) {
            const { title, key, icon, children } = currentValue
            // 判断当前路径是否和key相同，相同则设置标题
            if (pathname === key) {
                props.setTitle(currentValue.title)
            }
            previousValue.push(getItem(title, key, icon, children))
        }
        return previousValue
    }, [])
    // const mapList = useCallback((List) => List.reduce((previousValue, currentValue) => {
    //     if (hasAuth(currentValue)) {
    //         const { title, key, icon, children } = currentValue
    //         if (pathname === key || pathname.indexOf(key) === 0) {
    //             console.log(currentValue.title);
    //             props.setTitle(currentValue.title)
    //         }
    //         previousValue.push(getItem(title, key, icon, children))
    //     }
    //     return previousValue
    // }, []), [getItem, pathname, props])
    // 判断某个目录是否有权限
    const hasAuth = (item) => {
        const { menus } = props.user.role
        const { username } = props.user
        const { key } = item
        if (username === 'admin' || item.isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {
            return !!item.children.find(cItem => menus.indexOf(cItem.key) !== -1)
        }
        return false
    }
    // const items = mapList(menuList)
    // console.log(items);
    // 跳转到对应路由
    const navigate = useNavigate()
    const select = ({ key }) => {
        navigate(key)
    }

    // if (pathname.indexOf('/products/home') === 0) {
    //     pathname = '/products/home'
    // }
    // 获取默认打开的子菜单key
    const openKey = '/' + pathname.split('/')[1]

    useEffect(() => {
        setItems(mapList(menuList))
    }, [pathname])// eslint-disable-line react-hooks/exhaustive-deps
    return (
        <Sider >
            <Link to='/' className='leftNav-header'>
                <img src={logo} alt="" />
                <h1 style={{ color: 'white' }}>硅谷后台</h1>
            </Link>
            <Menu
                defaultSelectedKeys={['/home']}
                selectedKeys={pathname}
                defaultOpenKeys={[openKey]}
                mode="inline"
                theme="dark"
                items={items}
                onSelect={select}
            />
        </Sider>
    )
}
export default connect(
    state => ({ user: state.user }),
    {
        setTitle
    }
)(LeftNav)