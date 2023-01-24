import { INCREMENT, DECREMENT } from "./constant";
const reducer = (state = 1, action) => {
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
export default reducer