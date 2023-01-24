import { Button, Card } from 'antd'
import React from 'react'
import ReactECharts from 'echarts-for-react';
import { useState } from 'react';
export default function Bar() {
    const [sales, setSales] = useState([5, 20, 36, 10, 10, 20])
    const [inventory, setInventory] = useState([4, 30, 26, 5, 30, 10])
    // 更新数据
    const update = () => {
        setSales(preSales => preSales.map((sale) => sale + 1))
        setInventory(preInventory => preInventory.map((inventory) => inventory - 1))
    }
    //  获取配置对象
    const getOption = () => ({
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data: ['销量', '库存']
        },
        xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {
            axisLine: { show: true }
        },
        series: [
            {
                name: '销量',
                type: 'line',
                data: sales,
                color: 'red'
            },
            {
                name: '库存',
                type: 'line',
                data: inventory
            }
        ]
    })
    return (
        <>
            <Card>
                <Button type='primary' onClick={update}>更新</Button>
            </Card>
            <Card title='折线图一'>
                <ReactECharts option={getOption()} />
            </Card>
        </>
    )
}