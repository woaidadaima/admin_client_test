
import { message } from "antd";
import { reqLogin } from "../api";
import { setUser } from "../utils/storageUtils";
import { SET_TITLE, RECEIVE_USER, RESET_USER, ERROR_MSG } from "./actions_type";
// 定义actions
export const setTitle = (headTitle) => ({
    type: SET_TITLE,
    data: headTitle
})
// 接受用户的Action
export const receiveUser = (user) => ({ type: RECEIVE_USER, user })
// 重置用户信息的Action
export const resetUser = () => ({ type: RESET_USER })
// 错误信息的Action
export const errorMsg = (errorMsg) => ({ type: ERROR_MSG, errorMsg })
// 登录的Action
export const login = (values) => {
    return async dispatch => {
        // 执行异步任务发请求
        let result = await reqLogin(values)
        if (result.status === 0) {
            message.success('登陆成功')
            const user = result.data
            setUser(user)
            // 派发同步Action
            dispatch(receiveUser(user))
        } else {
            // 派发错误action
            dispatch(errorMsg(result.msg))
        }
    }
}