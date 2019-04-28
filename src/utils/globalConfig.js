// 全局变量 注册到VUE的实例上
export default {
    install(Vue) {
        Vue.prototype.$globalConfig = {
            API_URL: process.env.VUE_APP_API_URL,
            OSS_URL: process.env.VUE_APP_OSS_URL,
            BOPSPATH: process.env.VUE_APP_BOPS_PATH
        };
    }
};
