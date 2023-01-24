import { INCREMENT, DECREMENT } from "./constant";
import { combineReducers } from "redux";
const count = (state = 1, action) => {
    const { type, data } = action
    switch (type) {
        case INCREMENT:
            return state + data
        case DECREMENT:
            return state - data
        default:
            return state
    }
}
const initUser = {}
const user = (state = initUser, action) => {
    const { type } = action
    switch (type) {
        default:
            return state
    }
}
export default combineReducers({
    count,
    user
})