import React from 'react'
import { Layout } from 'antd';
import logo from '../../assets/images/logo.png'
import './index.less'
import { Menu } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import menuList from '../../config/menuconfig';
import memory from '../../utils/memoryUtils';

const { Sider } = Layout;
export default function LeftNav() {
    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
        };
    }
    // 遍历动态生成目录
    const mapList = (List) => {
        return List.map((item) => {
            if (hasAuth(item)) {
                const { title, key, icon, children } = item
                return getItem(title, key, icon, children ? mapList(children) : null)
            }
            return 1
        })
    }
    // 判断某个目录是否有权限
    const hasAuth = (item) => {
        const { menus } = memory.user.role
        const { username } = memory.user
        const { key } = item
        if (username === 'admin' || item.isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) {
            return !!item.children.find(cItem => menus.indexOf(cItem.key) !== -1)
        }
        return false
    }
    const items = mapList(menuList)
    // 跳转到对应路由
    const navigate = useNavigate()
    const select = ({ key }) => {
        navigate(key)
    }
    // 获取当前路径
    let { pathname } = useLocation()
    if (pathname.indexOf('/products/home') === 0) {
        pathname = '/products/home'
    }
    // 获取默认打开的子菜单key
    const openKey = '/' + pathname.split('/')[1]
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
