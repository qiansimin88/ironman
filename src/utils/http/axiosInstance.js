
import axios from 'axios';
import Store from 'store';
import { message } from 'iview';
// 创建axions 的实例
const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 4000,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
});

// 处理请求头
const hanlderContentType = (config, token) => {
    const { headers } = config;
    let ct = 'application/json;charset=UTF-8';
    if (config.isKv) {
        ct = 'application/x-www-form-urlencoded';
    } else if (config.isForm) {
        ct = 'multipart/form-data';
    }
    return {
        ...config,
        headers: {
            ...headers,
            'Content-Type': ct,
            token
        }
    };
};

// 处理响应错误
const handlerError = (config, msg, status) => {
    switch (status) {
    // 登录问题
    case '400':
        Store.set('token', '');
        Store.set('userInfo', '');
        window.location.replace(`/login?referer=${window.location.pathname}`);
        break;
    default:
        message.error(msg || '网络异常');
    }
};

// 请求拦截
instance.interceptors.request.use((config) => {
    const token = Store.get('token') || '';
    config = hanlderContentType(config, token);
    return config;
}, (err) => Promise.reject(err));

// 响应拦截
instance.interceptors.response.use(res => {
    const {
        data, status, statusText, headers, config
    } = res;
    // java返回的字段
    const {
        data: serveData, msg, status: serveStaus
    } = data;
    // 如果请求有问题
    if (serveStaus !== 'ok') {
        handlerError(config, msg, serveStaus);
        return Promise.reject({
            url: config.url,
            msg,
            status: serveStaus
        });
    }
    return serveData;
}, (error) => {
    console.log(error);
});


export default instance;
