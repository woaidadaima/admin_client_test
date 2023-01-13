import axios from "axios";
import { message } from 'antd';
const ajax = async (url, data = {}, method = 'GET') => {
    return new Promise((resolve, reject) => {
        let promise
        if (method === 'GET') {
            // query参数，记得params关键字不能错
            promise = axios.get(url, { params: data })
        } else {
            promise = axios.post(url, data)
        }
        promise.then(response => resolve(response.data)).catch(error => message.error(error.message))
    })
    // if (method === 'get') {
    //     try {
    //         const result = await axios.get(url, data)
    //         return result.data
    //     } catch (error) {
    //         message.error(error.message)
    //     }
    // } else {
    //     try {
    //         const result = await axios.post(url, data)
    //         return result.data
    //     } catch (error) {
    //         message.error(error.message)
    //     }
    // }
}
export default ajax