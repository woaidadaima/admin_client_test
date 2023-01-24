import { Card, Space, Statistic, DatePicker, Timeline } from 'antd'
import { ArrowDownOutlined, ArrowUpOutlined, QuestionCircleOutlined, RedoOutlined } from '@ant-design/icons';
import React from 'react'
import './index.less'
import LinePlot from './line';
import dayjs from 'dayjs';
import BarPlot from './bar';
import { useState } from 'react'
export default function Home() {
    const { RangePicker } = DatePicker
    const dateFormat = 'YYYY/MM/DD';
    const [flag, setFlag] = useState(true)
    const select = () => {
        setFlag(flag => !flag)
    }
    const title = <>
        <Space>
            <span className={flag ? 'active link' : 'link'} onClick={select}>访问量</span>
            <span className={!flag ? 'active link' : 'link'} onClick={select}>销售量</span>
        </Space>
    </>
    // const datePicker = 
    return (
        <div className='home' style={{ padding: 25 }}>
            <div className='top'>
                <Card
                    headStyle={{ color: 'rgba(0,0,0,.45)' }}
                    size='small'
                    title='商品总量'
                    extra={<QuestionCircleOutlined style={{ color: 'grey' }} />}
                    style={{
                        width: 250,
                        height: 189
                    }}
                >
                    <Statistic
                        value={1128163}
                        valueStyle={
                            {
                                fontWeight: 'bolder',
                            }
                        }
                        suffix="个"
                    />
                    <Statistic
                        value={15}
                        prefix={'周同比'}
                        valueStyle={{
                            fontSize: 15
                        }}
                        suffix={<ArrowDownOutlined style={{ color: 'red' }} />}
                    />
                    <Statistic
                        value={15}
                        prefix={'日同比'}
                        valueStyle={{
                            fontSize: 15
                        }}
                        suffix={<ArrowUpOutlined style={{ color: 'green' }} />}
                    />
                </Card>
                <LinePlot className='plot' />
            </div>
            <div className='content'>
                <Card title={title} extra={<RangePicker
                    defaultValue={[dayjs('2023/01/01', dateFormat), dayjs('2023/06/01', dateFormat)]}
                    format={dateFormat}
                />}>
                    <Card className='content-left' title={`${flag ? '访问' : '销售'}趋势`} extra={<RedoOutlined />}>
                        <BarPlot />
                    </Card>
                    <Card className='content-right' title='任务' extra={<RedoOutlined />}>
                        <Timeline>
                            <Timeline.Item color="green">新版本迭代会</Timeline.Item>
                            <Timeline.Item color="green">完成网站设计初版</Timeline.Item>
                            <Timeline.Item color="red">
                                <p>接口联调</p>
                                <p>功能验收</p>
                            </Timeline.Item>
                            <Timeline.Item color="green">
                                <p>登录功能设计</p>
                                <p>权限验证</p>
                                <p>页面排版</p>
                            </Timeline.Item>
                        </Timeline>
                    </Card>
                </Card>
            </div>
        </div>

    )
}
