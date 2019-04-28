import Store from 'store';

export default {
    install(Vue) {
        Vue.prototype.$localStore = Store;
    }
};
