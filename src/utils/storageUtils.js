import store from "store"
export const setUser = data => store.set('user_key', data)
export const getUser = () => store.get('user_key')
export const removeUser = () => store.remove('user_key')