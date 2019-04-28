// 简单权限控制，根据role字段
const sides = [
    {
        icon: 'iconhome',
        title: '技术岗审核',
        value: 'Technical',
        path: '/'
    },
    {
        icon: 'iconcustomer',
        title: '派单中心',
        value: 'sendCenter',
        path: '/assigncenter'
    },
    {
        icon: 'iconinterseascustomer',
        title: '生产订单',
        value: 'yieldOrder',
        path: '/yieldorder'
    }
];

export default sides;
