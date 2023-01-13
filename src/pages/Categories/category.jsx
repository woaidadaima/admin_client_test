import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, Table, Space, message, Modal, Form, Input, Select } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'
import LinkButton from '../../componets/LinkButton'
import { reqAddCategory, reqCategoryById, reqCategoryList, reqUpdateCategory } from '../../api';
export default function Categories() {
    // 设置表格标题
    const title = '一级分类列表'
    // 获取一级分类列表
    const [categoryList, setcategoryList] = useState([])
    // 获取二级分类列表
    const [subCategoryList, setSubCategoryList] = useState([])
    // 保存父类名称
    const parentName = useRef('')
    // 控制是否查看子分类
    const showSubcategorys = useRef(1)
    // 控制是否加载
    const [isLoading, setIsLoading] = useState([])
    // 保存父类ID
    const parentID = useRef('0')
    // 保存品类ID
    const categoryID = useRef()
    // 设置表格列信息
    const columns = [
        {
            title: '分类的名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            width: 300,
            title: '操作',
            key: 'action',
            render: (category) => (
                <Space size="middle">
                    <LinkButton onClick={() => { showModifyModal(category) }}>修改分类</LinkButton>
                    {showSubcategorys.current ? <LinkButton onClick={() => { showSub(category) }}>查看子分类</LinkButton> : null}
                </Space>
            ),
        },
    ];
    // 设置是否弹出对话框
    const [showStatus, setShowStatus] = useState(0);

    // 根据分类ID获取分类
    const getCategoryById = async (categoryId) => {
        let result = await reqCategoryById(categoryId)
        if (result.status === 0) {
            const { name } = result.data
            parentName.current = name
            console.log(parentName.current);
        }
    }
    // 获取一级分类或二级分类
    const getCategorys = async (parentId) => {
        const result = await reqCategoryList(parentId)
        if (result.status === 0) {
            if (parentId === '0') {
                showSubcategorys.current = 1
                setcategoryList(categoryList => categoryList = result.data)
                setIsLoading(false)
            } else {
                showSubcategorys.current = 0
                setSubCategoryList(subCategoryList => subCategoryList = result.data)
                setIsLoading(false)
            }
        } else {
            message.error('网络故障，请稍后再试')
        }
    }
    // 展示一级分类列表
    const showCategorys = () => {
        getCategorys('0')
        parentName.current = ''
        parentID.current = '0'
    }
    // 展示二级分类列表
    const showSub = ({ _id, name }) => {
        setIsLoading(true)
        parentName.current = name
        parentID.current = _id
        getCategorys(_id)
    }
    // 获取form实例对象
    const [form] = Form.useForm()
    // 展示修改分类对话框
    const showModifyModal = (category) => {
        // 更新分类名
        setShowStatus(1);
        const { _id, parentId, name } = category
        categoryID.current = _id
        parentID.current = parentId
        form.setFieldsValue({ cName: name })
    };
    // 监听控件值
    const categoryName = Form.useWatch('cName', form)
    // 更新分类名
    const updateCategory = async () => {
        // 开启loading
        setIsLoading(true)
        let result = await form.validateFields()
        if (result) {
            console.log('成功，发送更新分类请求');
            let result = await reqUpdateCategory({
                categoryId: categoryID.current,
                categoryName
            })
            if (result.status === 0) {
                // 重新请求分类列表
                getCategorys(parentID.current)
                // 关闭对话框
                setShowStatus(0)
                setIsLoading(true)
            } else {
                message.error('请求超时')
            }
        }
    }
    // 隐藏对话框
    const cancel = () => {
        // 重置表单
        form.setFieldsValue({ inputName: '' })
        setShowStatus(0);
    };
    // 弹出添加分类对话框
    const showAddModal = () => {
        // 判断是一级分类还是二级分类
        if (parentID.current === '0') {
            form.setFieldsValue({ defaultCatogory: '一级分类' })
        } else {
            form.setFieldsValue({ defaultCatogory: parentName.current })
        }
        setShowStatus(2)
    }
    // 添加分类
    const addCategory = () => {
        console.log(11);
        form.validateFields().then(async (res) => {
            // 发请求添加分类
            console.log(res, 111);
            let result = await reqAddCategory({ parentId: parentID.current, categoryName: res.inputName })
            if (result.status === 0) {
                // 更改标题分类名
                getCategoryById(parentID.current)
                // 重新请求分类列表
                getCategorys(parentID.current)
                // 重置表单内容
                form.resetFields()
                // 关闭对话框
                setShowStatus(0);
            }
        })
    }
    // 组件挂载请求分类列表
    useEffect(() => {
        getCategorys(parentID.current)
    }, [])
    // 下拉框变化时
    const selectChange = (key, b) => {
        console.log(key, b);
        parentID.current = key
        console.log(parentID.current);
    }
    return (
        <Card
            title={showSubcategorys.current ? title :
                <>
                    <LinkButton onClick={showCategorys}>一级分类列表</LinkButton>
                    <ArrowRightOutlined style={{ marginRight: 5 }} />
                    <span>{parentName.current}</span>
                </>
            }
            extra={<Button type='primary' onClick={showAddModal} icon={<PlusOutlined />}>添加</Button>} style={{ width: '100%' }}>
            <Table
                rowKey={'_id'}
                dataSource={parentID.current === '0' ? categoryList : subCategoryList}
                columns={columns}
                loading={isLoading}
                pagination={{
                    defaultPageSize: 5,
                    defaultCurrent: 1,
                    showQuickJumper: true
                }} />
            <Modal
                title="更新分类"
                open={showStatus === 1}
                onOk={updateCategory}
                onCancel={cancel}
                okText="ok"
                cancelText="cancel"
            >
                <Form form={form}>
                    <Form.Item
                        name="cName"
                        rules={[
                            {
                                required: true,
                                message: '请输入分类名称',
                            },
                        ]}
                    >
                        <Input placeholder={'请输入分类名称'} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="添加分类"
                open={showStatus === 2}
                onOk={addCategory}
                onCancel={cancel}
                okText="ok"
                cancelText="cancel"
            >
                <Form form={form}>
                    <Form.Item name='defaultCatogory'>
                        <Select onChange={(key, b) => { selectChange(key, b) }}>
                            <Select.Option value='0' key='0'>一级分类</Select.Option>
                            {
                                categoryList.map(c => <Select.Option value={c._id} key={c._id}> {c.name} </Select.Option>)
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='inputName'
                        rules={
                            [
                                { required: true, message: '请输入分类名称' }
                            ]
                        }
                    >
                        <Input placeholder={'请输入分类名称'} />
                    </Form.Item>
                </Form>
            </Modal>
        </Card >
    )
}
