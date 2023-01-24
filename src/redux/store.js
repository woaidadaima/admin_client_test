import { legacy_createStore as createStore, applyMiddleware } from 'redux'
// 引入thunk使得action可以执行异步操作
import thunk from 'redux-thunk'
// 引入
import { composeWithDevTools } from 'redux-devtools-extension'
import reducer from './reduce'
// 创建一个store并对外暴漏
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))