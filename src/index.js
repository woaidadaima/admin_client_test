// 入口文件
import React from 'react'
import ReactDOM from 'react-dom/client';
import App from './App'
import { HashRouter } from 'react-router-dom'

// 引入Provider透传store
import { Provider } from 'react-redux';
import store from './redux/store';
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
    <HashRouter>
        <Provider store={store}>
            <App />
        </Provider>
    </HashRouter>
)
