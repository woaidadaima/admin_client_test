import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd';
const BASE = '/api'
// 登录请求接口
export const reqLogin = (data) => ajax(BASE + '/login', data, 'post')
// 请求分类列表接口
export const reqCategoryList = (parentId) => ajax(BASE + '/manage/category/list', { parentId })
// 请求天气接口
export const reqWeather = (POI) => {
    return new Promise((resolve, reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${POI}&key=a7c61c4c3f20b1a519268dd573c493d0`
        jsonp(url, {}, (err, data) => {
            if (!err && data.lives[0].weather) {
                resolve(data.lives[0].weather)
            } else {
                message.error('请求天气失败,请输入正确的POI')
            }
        })
    })
}
// 更新分类接口
export const reqUpdateCategory = (data) => ajax(BASE + '/manage/category/update', data, 'post')
// 添加分类接口
export const reqAddCategory = (data) => ajax(BASE + '/manage/category/add', data, 'post')
// 获取商品列表接口
export const reqProductList = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })
// 根据关键字或描述搜索商品接口
export const reqProductSearch = (pageNum, pageSize, selectKey, inputValue) => {
    if (selectKey === '1') {
        // 根据名称获取商品列表
        return ajax(BASE + '/manage/product/search', { pageNum, pageSize, productName: inputValue })
    } else {
        // 根据描述获取商品列表
        return ajax(BASE + '/manage/product/search', { pageNum, pageSize, productDesc: inputValue })
    }
}
// 根据分类ID获取分类
export const reqCategoryById = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })
// 对商品进行上架/下架处理
export const reqChangeSale = (data) => ajax(BASE + '/manage/product/updateStatus', data, 'post')
// 删除图片的接口
export const reqDeleteImg = (data) => ajax(BASE + '/manage/img/delete', data, 'post')
// 添加或更新商品
export const reqAddOrUpdate = (data, isUpdate) => ajax(BASE + `/manage/product/${isUpdate ? 'update' : 'add'}`, data, 'post')
// 获取角色列表接口
export const reqRoleList = () => ajax(BASE + '/manage/role/list')
// 添加角色接口
export const reqAddRole = (data) => ajax(BASE + '/manage/role/add', data, 'post')
// 设置角色权限接口
export const reqSetRoleAuth = (data) => ajax(BASE + '/manage/role/update', data, 'post')
// 获取用户列表接口
export const reqUserList = () => ajax(BASE + '/manage/user/list')
// 删除用户接口
export const reqDeleUser = (data) => ajax(BASE + '/manage/user/delete', data, 'post')
// 添加用户接口
export const reqAddOrUpadateUser = (data) => ajax(BASE + `/manage/user/${data._id ? 'update' : 'add'}`, data, 'post') 