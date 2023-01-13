import { Button, Card, Cascader, Form, Input, message, Space, } from 'antd'
import {
    ArrowLeftOutlined
} from '@ant-design/icons';
import React, { useState } from 'react'
import LinkButton from '../../componets/LinkButton';
import { reqAddOrUpdate, reqCategoryList } from '../../api';
import { useEffect } from 'react';
import UpLoad from './upload';
import RichTextEditor from './rich-text-editor';
import { useRef } from 'react';
import { useLocation, useNavigate, } from 'react-router-dom';

export default function AddUpdate() {
    // 获取路由传过来的参数
    const productInfo = useLocation().state || {}
    // 获取form 实例
    const [form] = Form.useForm()
    // 获取navigate实例
    const navigate = useNavigate()
    // 设置card标题
    const title = <Space>
        <LinkButton>
            <ArrowLeftOutlined style={{ fontSize: 20 }} onClick={() => { navigate(-1) }}></ArrowLeftOutlined>
        </LinkButton>
        <span>添加商品</span>
    </Space>
    // 自定义校验数字
    const numValidate = (_, value) => {
        if (value * 1 > 0) {
            return Promise.resolve()
        } else {
            return Promise.reject(new Error('价格必须大于0'))
        }
    }
    // 定义选项列表
    const [options, setOptions] = useState();
    // 获取商品分类
    const getCategoryList = async (parentId) => {
        let result = await reqCategoryList(parentId)
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                initOptionList(categorys)
            } else {
                // 二级分类列表
                return categorys
            }
        }
    }
    // 初始化级联列表信息
    const initOptionList = async (categorys) => {
        // 遍历一级分类列表返回选项
        const options = categorys.map(item => ({
            label: item.name,
            value: item._id,
            isLeaf: false
        }))
        // 如果为更新商品，则加载显示两项
        if (productInfo._id) {
            const { pCategoryId } = productInfo
            // 判断是否有二级分类
            if (pCategoryId !== '0') {
                // 有则发请求获取子分类
                const subCategory = await getCategoryList(pCategoryId)
                // 找到选项中和pCateryId相同一项作为父级选项
                const fOption = options.find(item => item.value === pCategoryId)
                // 遍历子分类列表赋值给父级选项的孩子
                fOption.children = subCategory.map(item => (
                    {
                        label: item.name,
                        value: item._id,
                        isLeaf: true
                    }
                ))
            }
        }
        // 设置级联选项
        setOptions(options)
    }
    // 获取页面初始值
    const initForm = async () => {
        // 解构从路由传递过来的信息
        const { categoryId, desc, detail, imgs, name, pCategoryId, price, _id } = productInfo
        // 如果有_id则为更新商品
        if (_id) {
            // 将分类信息的ID保存在表单的category中
            const categoryIds = []
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
            // 获取表单初始值
            form.setFieldsValue({
                name,
                desc,
                detail,
                imgs,
                price,
                category: categoryIds
            })
        }
    }
    // 组件挂载先请求一级分类列表
    useEffect(() => {
        getCategoryList('0')
        initForm()
    }, [])// eslint-disable-line react-hooks/exhaustive-deps
    // 级联加载项
    const loadData = async (selectedOptions) => {
        // 获取当前点击的option选项
        const targetOption = selectedOptions[0];
        // 开启加载
        targetOption.loading = true;
        // 获取子分类列表
        let subCategory = await getCategoryList(targetOption.value)
        // 遍历并返回子分类
        targetOption.children = subCategory.map(item => (
            {
                label: item.name,
                value: item._id,
                isLeaf: true
            }
        ))
        // 如果没有二级列表,则为叶子节点
        if (targetOption.children.length === 0) {
            targetOption.isLeaf = true
        }
        // 更新options
        setOptions([...options])
        targetOption.loading = false;
    };
    // 定义上传图片和富文本组件的Ref方便从子组件中获取信息
    let imgListRef = useRef()
    let richTextRef = useRef()
    // 表单提交
    const addOrUpdate = async (product) => {
        // 获取表单category值
        const { category } = product
        // 通过Ref收集子组件的图片列表
        const { fileList } = imgListRef.current
        product.imgs = fileList.map(file => file.name)
        // 通过Ref收集富文本中转化为原生Html的数据
        const { contentState } = richTextRef.current.props
        product.detail = contentState
        // 如果表单中分类数组为2，说明有父组件，否则父组件Id为0
        if (category.length === 2) {
            product.pCategoryId = category[0]
            product.categoryId = category[1]
        } else {
            product.pCategoryId = '0'
            product.categoryId = category[0]
        }
        // 如果有id则为更新商品
        if (productInfo._id) {
            product._id = productInfo._id
        }
        // 发请求添加或更新商品列表
        let result = await reqAddOrUpdate(product, productInfo._id)
        if (result.status === 0) {
            message.success(productInfo._id ? '更新商品成功' : '添加商品成功')
            // 返回商品列表页
            navigate(-1)
            // 重新请求
        } else {
            message.error(`${productInfo._id ? '更新' : '添加'}商品失败`)
        }
    }
    return (
        <Card title={title}>
            <Form
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 8 }}
                form={form}
                onFinish={addOrUpdate}
            >
                <Form.Item
                    label="商品名称"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: '必须输入商品名称'
                        },
                    ]}
                >
                    <Input placeholder='请输入商品名称' />
                </Form.Item>
                <Form.Item
                    label="商品描述"
                    name="desc"
                    rules={[
                        {
                            required: true,
                            message: '必须输入商品描述'
                        },
                    ]}
                >
                    <Input.TextArea
                        placeholder='请输入商品描述'
                        autosize={{ minRows: 2, maxRows: 6 }}
                    />
                </Form.Item>
                <Form.Item
                    label="商品价格"
                    name="price"
                    rules={
                        [
                            {
                                required: true,
                                message: '必须输入商品价格'
                            },
                            {
                                validator: (_, value) => numValidate(_, value)
                            }
                        ]
                    }
                >
                    <Input
                        type='number'
                        placeholder='请输入商品价格'
                        addonAfter={'元'}
                    />
                </Form.Item>
                <Form.Item
                    label="商品分类"
                    name="category"
                    rules={
                        [
                            {
                                required: true,
                                message: '必须输入商品分类'
                            },
                        ]
                    }
                >
                    <Cascader
                        placeholder='请指定商品分类'
                        options={options}
                        loadData={loadData}

                    />
                </Form.Item>
                <Form.Item
                    label='商品图片'
                    name='imgs'
                >
                    <UpLoad ref={imgListRef} />
                </Form.Item>
                <Form.Item
                    wrapperCol={{ span: 20 }}
                    label='商品详情'
                    name='detail'
                >
                    <RichTextEditor ref={richTextRef} />
                </Form.Item>
                <Form.Item
                >
                    <Button type='primary' htmlType='submit'>提交</Button>
                </Form.Item>
            </Form>
        </Card >
    )
}
