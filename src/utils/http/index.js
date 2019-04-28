import instance from './axiosInstance';

export default {
    install(Vue) {
        Vue.prototype.$http = instance;
    }
};
