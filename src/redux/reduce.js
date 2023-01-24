import { getUser } from "../utils/storageUtils"
import { combineReducers } from 'redux'
import { ERROR_MSG, RECEIVE_USER, RESET_USER, SET_TITLE } from "./actions_type"
// 定于头部标题的reducer
const initTitle = ''
const headTitle = (state = initTitle, action) => {
    switch (action.type) {
        case SET_TITLE:
            return action.data
        default:
            return state
    }
}
// 从本地存储中读取user信息
const initUser = getUser()
const user = (state = initUser, action) => {
    switch (action.type) {
        case RECEIVE_USER:
            return action.user
        case RESET_USER:
            return {}
        case ERROR_MSG:
            return { errorMsg: action.errorMsg }
        default:
            return state
    }
}
/* 
    使用combine将两个user合并并对外暴漏{}
    {
        headTitle,
        user:{}
    }
 */
export default combineReducers({
    headTitle,
    user
})