import { Button, Card, Input, message, Select, Space, Table } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import React from 'react'
import LinkButton from '../../componets/LinkButton';
import { useEffect } from 'react';
import { reqChangeSale, reqProductList, reqProductSearch } from '../../api';
import { useState } from 'react';
import { PAGE_SIZE } from '../../utils/constant';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

export default function Products() {
    // 商品列表数据
    const [productList, setProductList] = useState([])
    // 当前页码数据
    const [pageNum, setPageNum] = useState(1)
    // 保存下拉框的KEY值
    const [selectValue, setSelectValue] = useState('1')
    // 保存输入框的值
    const [inputValue, setInputValue] = useState('')
    // 搜索的回调
    const search = async (pageNum, pageSize, selectValue, inputValue) => {
        // 开启加载
        setIsLoading(true)
        let result = await reqProductSearch(pageNum, pageSize, selectValue, inputValue)
        if (result.status === 0) {
            setPageNum(pageNum)
            const { total, list } = result.data
            setTotal(total)
            // 为商品添加key属性
            list.map((item) => item.key = item._id)
            setProductList(list)
            // 关闭加载
            setIsLoading(false)
        }
    }
    // 获取当前路径
    const { pathname } = useLocation()
    // card标题
    const title = (<Space>
        <Select defaultValue='1' onSelect={(value) => {
            //函数体
            setSelectValue(value)
        }}>
            <Select.Option value='1'>按名称搜索</Select.Option>
            <Select.Option value='2'>按描述搜索</Select.Option>
        </Select>
        <Input placeholder='请输入关键字' onBlur={(e) => {
            setInputValue(e.target.value)
        }}></Input>
        <Button type='primary' onClick={() => {
            search(1, PAGE_SIZE, selectValue, inputValue)
        }}>搜索</Button>
    </Space>)
    // 获取商品列表数据
    const getProductsList = async (pageNum, PAGE_SIZE) => {
        // 开启加载
        setIsLoading(true)
        let result = await reqProductList(pageNum, PAGE_SIZE)
        if (result.status === 0) {
            // 更改页码
            setPageNum(pageNum)
            const { list, total } = result.data
            // 存储总页码书
            setTotal(total)
            // 为商品添加key属性
            list.map((item) => item.key = item._id)
            setProductList(list)
            // 关闭加载
            setIsLoading(false)
        }
    }
    // 定义navigate
    const navigate = useNavigate()
    // 修改商品状态
    const changeSaleStatus = async (productId, status) => {
        const result = await reqChangeSale({ productId, status })
        if (result.status === 0) {
            message.success('更新商品成功')
            // 重新获取当前页面刷新
            getProductsList(pageNum, PAGE_SIZE)
        } else {
            message.error('更新商品失败')
        }
    }
    const columns = [
        {
            title: '商品名称',
            dataIndex: 'name',
        },
        {
            title: '商品描述',
            dataIndex: 'desc',
        },
        {
            title: '价格',
            dataIndex: 'price',
            render: (price) => <span>￥{price}</span>
        },
        {
            width: 100,
            title: '状态',
            // dataIndex: 'status',
            render: (product) => {
                const { _id, status } = product
                const newStatus = status === 2 ? 1 : 2
                return <>
                    <Button type='primary' onClick={() => { changeSaleStatus(_id, newStatus) }}>{status === 2 ? '上架' : '下架'}</Button>
                    {status === 2 ? <span>已下架</span> : <span>在售</span>}
                </>
            }
        },
        {
            width: 100,
            title: '操作',
            // dataIndex: 'address',
            render: (products) =>

                <>
                    <LinkButton onClick={() => { navigate('/products/home/detail', { state: products }) }}>详情</LinkButton>
                    <LinkButton onClick={() => { navigate('/products/home/addupdate', { state: products }) }}>修改</LinkButton>
                </>

        },
    ];
    // 总页码数
    const [total, setTotal] = useState(0)
    // 控制是否加载
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        // 当路由为/products/home才发请求获取商品列表
        if (pathname === '/products/home') {
            getProductsList(pageNum, PAGE_SIZE)
        }
    }, [pathname])// eslint-disable-line react-hooks/exhaustive-deps

    return (
        pathname === '/products/home' ? <Card title={title} extra={<Button type='primary' onClick={() => navigate('/products/home/addupdate')}><PlusOutlined /> 添加新商品</Button>}>
            <Table
                bordered
                loading={isLoading}
                dataSource={productList}
                columns={columns}
                pagination={{
                    total,
                    defaultPageSize: PAGE_SIZE,
                    defaultCurrent: 1,
                    current: pageNum,
                    showQuickJumper: true,
                    onChange: (page, pageSize) => {
                        if (inputValue === '') {
                            // 如果没有搜索关键字
                            getProductsList(page, pageSize)
                        } else {
                            search(page, pageSize, selectValue, inputValue)
                        }
                    }
                }}
            />
        </Card> : <Outlet />
    )
}
