<template>
    <div class="yield pageWrap">
        <pageHeader>派单详情页</pageHeader>
        <itemBlock
            title="基本信息"
        >
            <div class="info">
                <Row type="flex" style="margin-bottom: 12px;">
                    <Col span="8">
                        订单号：{{ orderNum }}
                    </Col>
                    <Col span="8">
                        订单金额：{{ detailObj.totalPrice }}
                    </Col>
                    <Col span="8">
                       期望交付时间：{{ $utils.tranDateTime(detailObj.deliverTime) }}
                    </Col>
                </Row>
                <Row type="flex" style="margin-bottom: 12px;">
                    <Col span="8">
                        销售：{{ detailObj.saleUserDto && detailObj.saleUserDto.nickName || '--' }}
                    </Col>
                    <Col span="8">
                        审核通过时间：{{ detailObj.orderAuditAssignRecordDto && $utils.tranDateTime(detailObj.orderAuditAssignRecordDto.gmtCreate) || '--'}}
                    </Col>
                    <Col span="8">
                        审核人员：{{ detailObj.orderAuditAssignRecordDto && detailObj.orderAuditAssignRecordDto.userDto.nickName || '--' }}
                    </Col>
                </Row>
                <Row type="flex" style="margin-bottom: 12px;">
                    <Col span="24">
                        订单备注： {{ detailObj.buyerMemo || '--' }}
                    </Col>
                </Row>
                <Row type="flex" style="margin-bottom: 12px;">
                    <Col span="24">
                        客服备注： {{ detailObj.memo || '--' }}
                    </Col>
                </Row>
                 <Row type="flex" style="margin-bottom: 12px;">
                    <Col span="24">
                        B岗审核意见：{{ (detailObj.orderAuditTechSuccessRecordDto && detailObj.orderAuditTechSuccessRecordDto.length) && detailObj.orderAuditTechSuccessRecordDto[0].remarks || '--' }}
                    </Col>
                </Row>
            </div>
        </itemBlock>
        <itemBlock title="作业指导书">
             <Input
                    v-model="printGuide"
                    type="textarea"
                    :row="2"
                    placeholder="请输入"
            />
            <Button type="primary"
                style="margin-top: 12px;"
                @click="updatePrintGuide"
            >提交</Button>
        </itemBlock>
        <itemBlock title="">
            <rowSpanTable :detail-obj="detailObj" @on-print-change="getData"></rowSpanTable>
        </itemBlock>
        <itemBlock title="服务承诺">
            <orderPromise :promise-dto="promiseDto"></orderPromise>
        </itemBlock>
        <itemBlock title="收货地址">
            <Row type="flex" style="margin-bottom: 12px;">
                <Col span="4">
                    姓名：{{ detailObj.receiver }}
                </Col>
                <Col span="4">
                    联系电话：{{ detailObj.phone }}
                </Col>
                <Col span="16">
                    收货地址：{{ detailObj.street }}
                </Col>
            </Row>
        </itemBlock>
    </div>
</template>
<script>
import rowSpanTable from '@/components/rowSpanTable.vue';
import {
    orderStatus, printOrderChannel, payTypes,
    invoiceStatusMaps, monthlyStatusMaps, groupStatus
} from '@/constant';

export default {
    name: 'assignDetail',
    data() {
        return {
            printGuide: '', // 作业指导书
            hasPrintGuide: false, // 是否填过指导书了
            curUserId: this.$localStore.get('user_id'),
            addressInfo: {},
            promiseDto: {},
            detailObj: {},
            orderNum: ''
        }
    },
    components: {
        rowSpanTable
    },
    mounted() {
        const { query } = this.$route;
        this.orderNum = query.orderNum;
        this.$nextTick(() => {
            this.getData();
        });
    },
    methods: {
        updatePrintGuide() {
            if (!this.printGuide) {
                this.$Message.warning('请输入作业指导书！');
                return;
            }
            this.$http
                .post('/order/updatePrintGuide', {
                    modifier: this.curUserId,
                    orderNum: this.orderNum,
                    printGuide: this.printGuide
                })
                .then(() => {
                    this.$Message.success('设置作业指导书成功！');
                    this.getData();
                });
        },
        getData() {
            // 服务承诺
            this.$http
                .post('/orderPrintServicePromise/queryByOrderNumList', [this.orderNum])
                .then((data) => {
                    this.promiseDto = data[0] || {};
                })
            const {
                toDoubleDecimal, getConsListValue, tranDateTime, add
            } = this.$utils;
            this.$http
                .post('/orderProduce/queryOrderDetail', { orderNum: this.orderNum })
                .then((data) => {
                    // orderProduceAssignDtos: 以服务商的维度
                    const { orderProduceAssignDtos } = data;

                     const {
                        tradeStatus, gmtCreate, userType, printGuide,
                        orderPayDto, invoiceStatus, groupStatus: gs,
                        orderProduceItemDtos, auditPriceStatus, vipPrice, originalPrice, couponPrice,
                        orderChangeLogDtos, totalPrice, orderAssignDto
                    } = data;

                    const isAuditPriceOrder = auditPriceStatus !== 'success' && tradeStatus === 'new';
                    const { payType, subStatus } = { payType: '', subStatus: '', ...orderPayDto };
                    const showPayTypeSub =
                      payType === 'monthly' ? getConsListValue(monthlyStatusMaps, subStatus, '') : '';
                    const orderChangeLen = orderChangeLogDtos && orderChangeLogDtos.length;
                    const assignPrice = orderAssignDto && orderAssignDto.assignPrice;
                    let orderPriceChangeLogs = [];
                    let showAdjustPrice = '--';

                    if ( this.printGuide ) {
                        this.hasPrintGuide = true;
                    }

                    if (orderChangeLen > 0) {
                        showAdjustPrice = add(totalPrice, -orderChangeLogDtos[0].oldPrice);
                        showAdjustPrice = toDoubleDecimal(showAdjustPrice);
                        orderPriceChangeLogs = orderChangeLogDtos.map(v => ({
                            totalPrice: `￥${toDoubleDecimal(v.totalPrice)}`,
                            dateTime: tranDateTime(v.gmtCreate),
                            showName: `${v.realName || v.nickName || ''}  ${v.phone}`
                        }));
                        orderPriceChangeLogs = orderPriceChangeLogs.reverse();
                    }
                    this.printGuide = printGuide;
                    this.detailObj = {
                        ...data,
                        totalQuantity: (orderProduceItemDtos || []).reduce((pre, cur) => {
                            if (!cur) return pre;
                            return Number(cur.quantity) + Number(pre);
                        }, 0),
                        showTradeStatus: getConsListValue(orderStatus, tradeStatus, '--'),
                        showCreateTime: tranDateTime(gmtCreate),
                        showUserType: getConsListValue(printOrderChannel, userType, '直营'),
                        showPayType: getConsListValue(payTypes, payType, '直营'),
                        showGroupStatus: getConsListValue(groupStatus, gs, '--'),
                        showPayTypeSub,
                        showInvoiceStatus: getConsListValue(invoiceStatusMaps, invoiceStatus, '--'),
                        showTotalPrice: isAuditPriceOrder ? '待核价' : `￥${toDoubleDecimal(vipPrice || originalPrice)}`,
                        showCouponPrice: (couponPrice && `￥${toDoubleDecimal(-1 * couponPrice)}`) || '--',
                        showAdjustPrice,
                        showAssignPrice: (assignPrice && `￥${toDoubleDecimal(assignPrice)}`) || '--',
                        isAuditPriceOrder,
                        orderPriceChangeLogs,
                        // 提供rowspan的全部数据
                        list: this.handlerRowSpan( orderProduceAssignDtos, orderProduceItemDtos, data )
                    };
                })
        },
        // 专门处理 以服务商维度的数据
        handlerRowSpan( orderProduceAssignDtos, orderProduceItemDtos, data ) {
            let allData = [];
            // 已经有服务商 派过单了
            if (orderProduceAssignDtos && orderProduceAssignDtos.length) {
                orderProduceAssignDtos.map((p, i) => {
                    const itemSonOrder = p.orderProduceAssignItemDtos || []// 每个服务商的子生产单
                    const len = itemSonOrder.length;
                    if (itemSonOrder && itemSonOrder.length) {
                        itemSonOrder.map((q, k) => {
                            if ( k === 0 ) {
                                q.rowSpan = true;
                                q.rowSpanLength = len;
                            } else {
                                q.rowSpan = false;
                                q.rowSpanLength = 0;
                            }
                            q.orderProduceItemDtos = p.orderProduceAssignItemDtos;
                            q.printGuide = this.printGuide;
                            q.orderNum = p.orderNum;
                            q.assignPrice = p.assignPrice; // 派单价格
                            q.assignName = (p.userDto && p.userDto.nickName) || '--' // 派单服务商名字
                            q.assignNum = p.assignNum // 派单号
                            q.status = p.status // 状态
                            q.showUnitPrice = `￥${this.$utils.toDoubleDecimal(q.totalPrice / q.quantity)}`
                            return q;
                        })
                    }
                    allData = allData.concat(itemSonOrder);
                    return allData;
                });
            } else {
                // 从未派过单 没有服务商
                allData = orderProduceItemDtos.map((p, i) => {
                   p.showUnitPrice = `￥${this.$utils.toDoubleDecimal(p.totalPrice / p.quantity)}`;
                   p.rowSpan = true;
                   p.rowSpanLength = orderProduceItemDtos.length;
                   p.fatherInfo = data;
                   return p;
                });
            }
            return allData;
        }
    }
};
</script>
<style lang="less" scoped>
.yield {
    font-size: 14px;
}
</style>
