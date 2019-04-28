// 生产订单状态枚举
export const orderStatus = [
    { k: '全部', v: 'all' },
    { k: '待付款', v: 'new' },
    { k: '待发货', v: 'paid' },
    { k: '已发货', v: 'shipped' },
    // { k: '已收货', v: 'received' },
    { k: '已完成', v: 'complete' },
    { k: '已关闭', v: 'close' }
];

// 订单付款状态枚举
export const orderPayStatus = [
    { k: '全部', v: '' },
    { k: '已付款', v: 'paid' },
    { k: '未付款', v: 'new' }
];

// 生产订单渠道
export const printOrderChannel = [
    { k: '全部', v: '' },
    { k: '直营', v: '1' },
    { k: '渠道', v: '2' },
    { k: '先临', v: '3' },
    { k: '云生产子公司', v: '4' },
    { k: '云生产本部', v: '5' }
];
// 生产订单提现状态枚举
export const printOrderWithdrawStatus = [
    { k: '全部', v: '' },
    { k: '待提现', v: 'pendding' },
    { k: '待审核', v: 'audit' },
    { k: '提现成功', v: 'success' },
    { k: '提现失败', v: 'fail' }
];
// 生产订单拼锅状态枚举
export const groupStatus = [
    { k: '全部', v: '' },
    { k: '不拼锅', v: 'no' },
    { k: '拼锅中', v: 'create' },
    { k: '拼锅成功', v: 'success' },
    { k: '拼锅失败', v: 'fail' }
];
// 生产订单生产状态枚举
export const printStatus = [
    { k: '全部', v: '' },
    { k: '待检测', v: 'new' },
    { k: '已暂停', v: 'pause' },
    { k: '生产中', v: 'printing' },
    { k: '生产完成', v: 'complete' }
];
// 生产订单退款状态枚举
export const refundStatus = [
    { k: '全部', v: '' },
    { k: '退款中', v: 'refunding' },
    { k: '部分退款', v: 'partcomplete' },
    { k: '已退款', v: 'complete' }
];
// 生产订单支付方式枚举
export const payTypes = [
    { k: '全部', v: '' },
    { k: '支付宝', v: 'alipay' },
    { k: '微信支付', v: 'wxpay' },
    { k: '线下支付', v: 'offline' },
    { k: '月度结算', v: 'monthly' },
    // { k: '生产服务包', v: 'servicePackage' },
    { k: '点券支付', v: 'voucher_pay' }
];
// 生产订单支付是否代付
export const payUserTypes = [
    { k: '全部', v: '' },
    { k: '非代付', v: 'self' },
    { k: '代付', v: 'agent' }
];
// 发票状态
export const invoiceStatusMaps = [
    { k: '全部', v: '' },
    { k: '未申请', v: 'new' },
    { k: '待开票', v: 'pending_invoice' },
    { k: '待邮寄', v: 'pending_express' },
    { k: '已邮寄', v: 'express' }
];
// 审核状态
export const auditAssignStatusMaps = [
    { k: '全部', v: '' },
    { k: '审核中', v: 'pending' },
    { k: '审核通过', v: 'success' },
    { k: '被驳回', v: 'fail' }
];
// 月结子状态
export const monthlyStatusMaps = [
    { k: '待付款', v: 'new' },
    { k: '部分付款', v: 'part' },
    { k: '付款完成', v: 'confirm' }
];
// 生产信息
export const printInfoMaps = [
    { v: 'color', k: '颜色' },
    { v: 'precision', k: '精度' },
    { v: 'materialName', k: '材料' }
];
// 快递公司
export const expressCompanys = [
    { k: '请选择物流公司', v: '' },
    { k: '德邦物流', v: 'debangwuliu' },
    { k: '顺丰', v: 'shunfeng' },
    { k: '中通速递', v: 'zhongtong' },
    { k: '圆通速递', v: 'yuantong' },
    { k: '申通', v: 'shentong' },
    { k: '韵达快运', v: 'yunda' },
    { k: '用户自取', v: 'oneself' }
];
// 暂停生产原因
export const printPauseReasonStatus = [
    { k: '文件需分解(超过构建尺寸)', v: 'needCut' },
    { k: '文件破损', v: 'broken' },
    { k: '材料库存不足', v: 'understock' },
    { k: '生产机维修', v: 'printerRepair' },
    { k: '价格不符', v: 'priceError' }
];


// 订单类型
export const orderTypes = {
    printOrderDetail: 'print',
    printOrderAfterDetail: 'print',
    designerOrderDetail: 'designer',
    goodsOrderDetail: 'goods'
};

// 逾期状态
export const overdueStatus = [
    { k: '全部', v: '' },
    { k: '逾期', v: 'y' },
    { k: '未逾期', v: 'n' }
];

// 生产单状态
export const productionStatus = [
    { k: '待生产', v: 'new' },
    { k: '生产中', v: 'printing' },
    { k: '暂停', v: 'pause' },
    { k: '通过', v: 'pass' },
    { k: '生产完成', v: 'print_complete' },
    { k: '已发货', v: 'shipped' },
    { k: '完成', v: 'complete' },
    { k: '关闭', v: 'close' }
];
