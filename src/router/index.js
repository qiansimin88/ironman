import Vue from 'vue';
import Router from 'vue-router';

const Siders = () => import(/* webpackChunkName: "Sider" */'@/layout/sider.vue');
const Technical = () => import(/* webpackChunkName: "Technical" */'@/pages/technical/index.vue');
const TechnicalDetail = () => import(/* webpackChunkName: "Technical" */'@/pages/technical/detail.vue');
const Login = () => import(/* webpackChunkName: "login" */'@/pages/login.vue');
const YieldOrder = () => import(/* webpackChunkName: "YieldOrder" */'@/pages/yieldOrder/index.vue');
const YieldOrderDetail = () => import(/* webpackChunkName: "YieldOrderDetail" */'@/pages/yieldOrder/detail.vue');
const assignCenter = () => import(/* webpackChunkName: "assignCenter" */'@/pages/assign/index.vue');
const assignDetail = () => import(/* webpackChunkName: "assignDetail" */'@/pages/assign/detail.vue');
const Root = () => import('@/layout/root.vue');
// const Pdf = () => import(/* webpackChunkName: "other" */'@/pages/pdfView.vue');

Vue.use(Router);

export default new Router({
    mode: 'history',
    base: '/',
    routes: [
        {
            path: '/',
            name: 'siders',
            component: Siders,
            children: [
                {
                    path: '/',
                    name: 'Technical',
                    component: Technical
                },
                {
                    path: '/detail',
                    name: 'technicalDetail',
                    component: TechnicalDetail
                },
                // 生产订单
                {
                    path: '/yieldorder',
                    component: Root,
                    children: [
                        {
                            path: '/',
                            name: 'yieldOrder',
                            component: YieldOrder
                        },
                        {
                            path: 'detail',
                            name: 'yieldOrderDetail',
                            component: YieldOrderDetail
                        }
                    ]
                },
                // 派单中心
                {
                    path: '/assigncenter',
                    component: Root,
                    children: [
                        {
                            path: '/',
                            name: 'assignCenter',
                            component: assignCenter
                        },
                        {
                            path: 'detail',
                            name: 'assignDetail',
                            component: assignDetail
                        }
                    ]
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        }
    ],
    scrollBehavior() {
        return { x: 0, y: 0 };
    }
});
