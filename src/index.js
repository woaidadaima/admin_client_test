// 入口文件
import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { getUser } from './utils/storageUtils';
import memory from './utils/memoryUtils';
const root = ReactDOM.createRoot(document.getElementById('root'))
memory.user = getUser()
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)
