import { Button, Card, Space, Table, } from 'antd'
import React, { useCallback } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { reqRoleList } from '../../api';
import timeFormat from '../../utils/dateFormat';
import AuthForm from './auth_form';
import CreateRole from './create_role';
import { resetUser } from '../../redux/actions';

function Roles(props) {
    const { user, resetUser } = props
    const [roleList, setRoleList] = useState([])
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    // 保存选中的记录
    const [selectRecord, setSelectRecord] = useState([])
    const columns = [
        {

            title: '角色名称',
            dataIndex: 'name',
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            render: (time) => timeFormat(time) //格式化时间
        },
        {
            title: '授权时间',
            dataIndex: 'auth_time',
            render: (time) => time ? timeFormat(time) : null//格式化时间
        },
        {
            title: '授权人',
            dataIndex: 'auth_name',
        },
    ];
    const data = roleList

    // 获取角色列表接口
    const getRoleList = useCallback(async () => {
        let result = await reqRoleList()
        if (result.status === 0) {
            setRoleList(result.data)
        }
    }, [setRoleList])
    // 定义创建角色和设置权限两个子组件的Ref
    const creatRoleRef = useRef()
    const authRoleRef = useRef()
    const showCreateModal = () => {
        creatRoleRef.current.showModal()
    }
    const showAuthModal = () => {
        console.log(authRoleRef);
        authRoleRef.current.showModal()
    }
    useEffect(() => {
        // 组件挂载获取列表
        getRoleList()
    }, [getRoleList])
    return (
        <Card title={
            <Space>
                <Button type='primary' onClick={showCreateModal}>创建角色</Button>
                <Button type='primary' onClick={showAuthModal} disabled={!(selectedRowKeys.length > 0)}>设置角色权限</Button>
            </Space>}
        >
            <Table
                rowKey={record => record._id}
                bordered
                rowSelection={{
                    type: 'radio',
                    selectedRowKeys,
                    onChange: (selectedRowKeys, selectedRows) => {
                        // console.log(selectedRowKeys, selectedRows);
                        setSelectRecord(selectedRows[0])
                        setSelectedRowKeys(selectedRowKeys)
                    }
                }}
                columns={columns}
                dataSource={data}
                pagination={{
                    defaultPageSize: 3
                }}
                onRow={(record) => {
                    return {
                        onClick: () => {
                            // console.log(record);
                            authRoleRef.current.record = record
                            setSelectRecord(record)
                            // 点击某一行修改该行的key值（作用是选中）
                            setSelectedRowKeys([record._id])
                        }
                    }
                }}
            />
            <CreateRole ref={creatRoleRef} roleList={roleList} getRoleList={getRoleList} />
            <AuthForm
                ref={authRoleRef}
                selectRole={selectRecord}
                getRoleList={getRoleList}
                user={user}
                resetUser={resetUser}
            />
        </Card>
    )
}
export default connect(
    state => ({ user: state.user }),
    { resetUser }
)(Roles)
