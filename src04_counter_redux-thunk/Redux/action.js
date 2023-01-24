import { INCREMENT, DECREMENT } from "./constant"
export const increment = (number) => ({ type: INCREMENT, data: number })
export const decrement = (number) => ({ type: DECREMENT, data: number })
export const incrementAsync = (number) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(increment(number))
        }, 1000)
    }
}