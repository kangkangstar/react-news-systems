import axios from 'axios'
import { store } from '../redux/store'
// 配置请求基础路径，ajax请求会自动加上此前缀
axios.defaults.baseURL = "http://localhost:5000"

// axios.defaults.headers

// axios.interceptors.request.use
// axios.interceptors.response.use

// 请求拦截器：显示loading效果
axios.interceptors.request.use(function(config) {
    // 请求发送之前做一些事情
    // 显示loading
    store.dispatch({
        type: "change_loading",
        payload: true
    })
    return config;
}, function(error) {
    // Do something with request error
    return Promise.reject(error);
});

// 响应拦截器：成功或失败都隐藏loading
axios.interceptors.response.use(function(response) {
    store.dispatch({
        type: "change_loading",
        payload: false
    })
    return response;
}, function(error) {
    store.dispatch({
        type: "change_loading",
        payload: false
    })
    return Promise.reject(error);
});
