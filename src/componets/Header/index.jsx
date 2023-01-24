import React, { useEffect, useState } from 'react'
import './index.less'
import { Modal } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons';
import { removeUser } from '../../utils/storageUtils';
import timeFormat from '../../utils/dateFormat';
import { reqWeather } from '../../api';
import LinkButton from '../LinkButton';
import { connect } from 'react-redux';
import { resetUser } from '../../redux/actions';
function Header(props) {
    // 获取title值
    // const getTittle = () => {
    //     let title
    //     menuList.forEach((item) => {
    //         if (item.key === pathname) {
    //             title = item.title
    //         } else if (item.children) {
    //             // console.log(pathname);
    //             const Item = item.children.find(cItem => pathname.indexOf(cItem.key) === 0)
    //             // console.log(Item, pathname);
    //             if (Item) {
    //                 title = Item.title
    //             }
    //         }
    //     })
    //     return title
    // }

    // 退出登录函数
    const logOut = () => {
        Modal.confirm({
            icon: <QuestionCircleOutlined />,
            content: '确认退出吗',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                // 确认退出，清空本地存储和内存中的用户信息
                removeUser()
                // memory.user = {}
                props.resetUser()
                // navigate('/login', {
                //     replace: true
                // })
                // return <Navigate to='/login' replace={true} />
            }
        });
    }

    const [time, setTime] = useState(timeFormat())
    const [weather, setWeather] = useState()
    // 获取天气
    const getWeather = async (POI) => {
        const result = await reqWeather(POI)
        setWeather(result)
    }
    useEffect(() => {
        let timer = setInterval(() => {
            // 获取时间
            setTime(timeFormat())
        }, 1000)
        // getWeather(440703).then((response) => {
        //     setWeather(response)
        // })
        getWeather(440703)
        return () => {
            clearInterval(timer)
        }
    }, [])
    return (
        <div className='header'>
            <div className="header-top">
                <span>欢迎,{props.user.username}</span>
                <LinkButton onClick={logOut}>退出</LinkButton>
            </div>
            <div className="header-bottom">
                <div className="header-bottom-left">{props.headTitle}</div>
                <div className="header-bottom-right">
                    <span>{time}</span>
                    <img src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fn.sinaimg.cn%2Fsinakd20210930s%2F448%2Fw1024h1024%2F20210930%2Ffc41-705a7910c7b96c7dc5f364cb6234fd1f.jpg&refer=http%3A%2F%2Fn.sinaimg.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1668397422&t=d89e75a349f6843efb2a2a58538f5ebd" alt="天气图片" />
                    <span>{weather}</span>
                </div>
            </div>
        </div>
    )
}
export default connect(
    state => ({
        headTitle: state.headTitle,
        user: state.user
    }),
    {
        resetUser
    }
)(Header)