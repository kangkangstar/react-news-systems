import axios from 'axios'
import { store } from '../redux/store'
// 引入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置默认访问的url前缀，简化写法
axios.defaults.baseURL = "http://localhost:5000"

// 请求拦截器
axios.interceptors.request.use(function(config) {
    // 在请求发送前做一些事情
    // 进度条开始
    NProgress.start();
    // 显示loading
    store.dispatch({
        type: "change_loading",
        payload: true
    })
    return config;
}, function(error) {
    // 请求出错做什么
    return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use(function(response) {
    // 响应成功
    // 进度条结束
    NProgress.done();
    //隐藏loading
    store.dispatch({
        type: "change_loading",
        payload: false
    })

    return response;
}, function(error) {
    // 响应失败
    //隐藏loading
    store.dispatch({
        type: "change_loading",
        payload: false
    })

    return Promise.reject(error);
});
