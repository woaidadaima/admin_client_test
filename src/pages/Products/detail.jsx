import { Card, List, Space } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import React from 'react'
import LinkButton from '../../componets/LinkButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { reqCategoryById } from '../../api';
import { useState } from 'react';
import { useEffect } from 'react';
import { BASE_UPLOAD_URL } from '../../utils/constant';

export default function Detail() {
    // 定义navigate
    const navigate = useNavigate()
    // 保存父类名称
    // let pName = ''
    const [pName, setPName] = useState('')
    // 保存子类名称
    // let cName = ''
    const [cName, setCName] = useState('')
    // 获取当前路由信息
    const productInfo = useLocation()
    const { name, desc, detail, imgs, price, categoryId, pCategoryId } = productInfo.state
    const data = [
        <>
            <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: 15 }}>商品名称:</span>
            <span>{name}</span>
        </>,
        <>
            <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: 15 }}>商品描述:</span>
            <span>{desc}</span>
        </>,
        <>
            <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: 15 }}>商品价格:</span>
            <span>{price}元</span>
        </>,
        <>
            <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: 15 }}>商品分类:</span>
            <span>{cName ? pName + `-->` + cName : pName}</span>
        </>,
        <>
            <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: 15 }}>商品图片:</span>
            {imgs.map((img) => {
                return <img
                    style={{ width: 150, height: 150, border: '1px solid black', marginRight: 10 }}
                    src={`${BASE_UPLOAD_URL}${img}`}
                    alt="图片"
                    key={img}
                />
            })}
        </>,
        <>
            <span style={{ fontSize: '20px', fontWeight: 'bold', marginRight: 15 }}>商品详情:</span>
            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
        </>


    ];
    const title = <Space>
        <LinkButton onClick={() => navigate(-1)}>
            <ArrowLeftOutlined style={{ fontSize: '20px' }} />
        </LinkButton>
        <span>商品详情</span>
    </Space>
    // 根据ID获取分类
    const getCategoryName = async (categoryId, pCategoryId) => {
        // 如果父分类为0，则为一级分类下的商品
        if (pCategoryId === '0') {
            let result = await reqCategoryById(categoryId)
            const { name } = result.data
            setPName(name)
        } else {
            // 一次性发送多个请求, 只有都成功了, 才正常处理
            let results = await Promise.all([reqCategoryById(categoryId), reqCategoryById(pCategoryId)])
            const cName = results[0].data.name
            const pName = results[1].data.name
            setCName(cName)
            setPName(pName)
        }

    }
    useEffect(() => {
        getCategoryName(categoryId, pCategoryId)
    }, [categoryId, pCategoryId])
    return (
        <Card title={title}>
            <List
                dataSource={data}
                renderItem={(item) => <List.Item>{item}</List.Item>} //自定义列表
            />
        </Card>
    )
}
