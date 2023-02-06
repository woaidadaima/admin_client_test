import React from 'react'
import { Row, Col, Button } from 'antd'
import './index.less'
import { useNavigate } from 'react-router-dom'
export default function NotFound() {
    const navigate = useNavigate()
    const goHome = () => {
        navigate('/home')
    }
    return (
        <Row className='not-found'>
            <Col span={12} className='left'></Col>
            <Col span={12} className='right'>
                <h1>404</h1>
                <h2>抱歉，你访问的页面不存在</h2>
                <div>
                    <Button type='primary' onClick={goHome}>
                        回到首页
                    </Button>
                </div>
            </Col>
        </Row>
    )
}
