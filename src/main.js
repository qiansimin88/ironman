import Vue from 'vue';
import { Message, Spin } from 'iview';
import { VTable } from 'vue-easytable'
import utils from '@/utils/utils';
import App from './App.vue';
import router from '@/router/index';
import store from './store';
import localStore from '@/utils/store';
import globalConfig from '@/utils/globalConfig';
import http from '@/utils/http';
import oss from '@/utils/oss';
import 'iview/dist/styles/iview.css';
import 'vue-easytable/libs/themes-base/index.css'
import '@/utils/commonComponents';
import '@/assets/mytheme.less';
import '@/utils/iview';
import '@/utils/allTableCom';


Vue.prototype.$Message = Message;

Vue.config.productionTip = false;
Vue.component('easytable', VTable);
Vue.use(localStore);
Vue.use(globalConfig);
Vue.use(http);
Vue.use(oss);
Vue.use(utils);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
