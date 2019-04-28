<template>
    <div class="yield pageWrap">
        <pageHeader>生产单详情页</pageHeader>
        <itemBlock
            title="基本信息"
        >
            <div class="info">
                <Row type="flex" style="margin-bottom: 12px;">
                    <Col span="8">
                        生产单号：{{ detailObj.assignNum }}
                    </Col>
                    <Col span="8">
                        派单金额：{{ detailObj.assignPrice }}
                    </Col>
                    <Col span="8">
                        关联订单号：{{ detailObj.orderNum }}
                    </Col>
                </Row>
                <Row type="flex">
                    <Col span="8" style="margin-bottom: 12px;">
                       期望交付时间：{{ $utils.tranDateTime(detailObj.deliverTime) }}
                    </Col>
                    <Col span="8">
                        服务商：{{ detailObj.userDto && detailObj.userDto.nickName || '--' }}
                    </Col>
                    <Col span="8">
                        派单人：{{ detailObj.assignUserDto && detailObj.assignUserDto.nickName + ' ' + detailObj.assignUserDto.phone || '--' }}
                    </Col>
                </Row>
                <Row type="flex">
                    <Col span="8">
                        派单时间：{{ $utils.tranDateTime(detailObj.gmtCreate) }}
                    </Col>
                </Row>
            </div>
        </itemBlock>
        <itemBlock title="">
            <OrderStep :cur-status="detailObj.status"></OrderStep>
            <div class="info">
                <Row type="flex" style="margin-bottom: 12px;">
                    <Col span="8">
                        订单备注： {{ detailObj.buyerMemo || '--' }}
                    </Col>
                </Row>
                <Row type="flex" style="margin-bottom: 12px;">
                    <Col span="8">
                        B岗指导意见： {{ (detailObj.orderAuditRecordDtos && detailObj.orderAuditRecordDtos.length) && detailObj.orderAuditRecordDtos[0].remarks || '--' }}
                    </Col>
                </Row>
                <Row type="flex" style="margin-bottom: 12px;">
                    <Col span="8">
                        作业指导书： {{ detailObj.printGuide || '--' }}
                    </Col>
                </Row>
            </div>
            <Table :columns="tableColumns" :data="detailObj.orderProduceAssignItemDtosList"></Table>
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
        <itemBlock  title="物流信息" v-if="detailObj.expressCompany">
            <Row type="flex" style="margin-bottom: 12px;">
                <Col span="4">
                    物流信息：{{ ((detailObj.expressCompany) || '--') + ' ' + ((detailObj.expressNum) || '--') }}
                </Col>
                <Col span="4">
                    发货时间：{{ detailObj.gmtShip && $utils.tranDateTime(detailObj.gmtShip) || '--' }}
                </Col>
            </Row>
        </itemBlock>
    </div>
</template>
<script>
import OrderStep from '@/components/orderStep.vue';
import PrintOrderTable from '@/components/printDetailTable.vue';
import {
    orderStatus, printOrderChannel, payTypes, printInfoMaps,
    invoiceStatusMaps, monthlyStatusMaps, groupStatus
} from '@/constant';

export default {
    name: 'yieldOrderDetail',
    data() {
        return {
            promiseDto: {},
            tableColumns: [
                 {
                    title: '商品图片',
                    align: 'center',
                    render: (h, { row }) => (
                        <div style="padding: 10px 0;">
                            <img src={ this.generatorImg(row.mainPicId, 50, 38) }/>
                        </div>
                    )
                },
                {
                    title: '商品信息',
                    render: (h, { row }) => {
                        const {
                            volume, area, length, width, height, productName, dataDfsId
                        } = row;
                        const { toDoubleDecimal } = this.$utils;
                        const modalInfo = {
                            showVolume: `体 积：${toDoubleDecimal(volume)}cm³`,
                            showArea: `表面积：${toDoubleDecimal(area)}c㎡`,
                            showSize: `尺 寸：${toDoubleDecimal(length)}*${toDoubleDecimal(width)}*${toDoubleDecimal(height)}`,
                            srcModal: {
                                name: productName,
                                dfsId: dataDfsId
                            }
                        }
                        const {
                            showVolume, showArea, showSize, srcModal
                        } = modalInfo;
                        const arr = [
                            h('span', {
                                style: {
                                    marginTop: '2px'
                                }
                            }, showVolume),
                            h('span', {
                                style: {
                                    marginTop: '2px'
                                }
                            }, showArea),
                            h('span', {
                                style: {
                                    marginTop: '2px'
                                }
                            }, showSize)
                        ];
                        arr.unshift(h('a', {
                            style: {
                                marginBottom: '8px'
                            },
                            attrs: {
                                href: this.$utils.genDownloadUrl(srcModal.dfsId),
                                target: '_blank'
                            }
                        }, `源文件：${srcModal.name}`));
                        return h(
                            'div',
                            {
                                style: {
                                    'display': 'flex',
                                    'flex-direction': 'column',
                                    'padding': '10px 0'
                                }
                            },
                            arr,
                        );
                    }
                },
                {
                    title: '材料规格',
                    align: 'center',
                    render: (h, { row }) => {
                        let printInfo = JSON.parse(row.sku);
                        printInfo = JSON.parse(printInfo.propName).reduce((pre, cur) => {
                            if (!cur) return pre;
                            const item = pre;
                            const find = this.$utils.getConsListValue(printInfoMaps, cur.propName, '');
                            if (find) {
                                item.push({ title: find, val: cur.propValueName });
                            }
                            return pre;
                        }, []);
                        const arr = printInfo.map(v => h('span', {
                            style: {
                                marginTop: '2px'
                            }
                        }, `${v.title}：${v.val}`));
                        return h(
                            'div',
                            {
                                style: {
                                    'display': 'flex',
                                    'flex-direction': 'column',
                                    'padding': '10px 0'
                                }
                            },
                            arr,
                        );
                    }
                },
                {
                    title: '数量',
                    align: 'center',
                    key: 'quantity'
                },
                {
                    title: '生产信息',
                    align: 'center',
                    render: (h, { row }) => {
                    const {
                        gmtPrintStart, printTime
                    } = row;
                    let finshTime = null;
                    if (gmtPrintStart && printTime) {
                        const itemDate = new Date(gmtPrintStart);
                        finshTime = itemDate.setHours( itemDate.getHours() + Number( printTime ) );
                    }
                    return (
                        <div>
                           <p>上机时间:</p>
                           <p>{ row.gmtPrintStart ? this.$utils.tranDateTime(gmtPrintStart) : '--' }</p>
                           <p>预计交付时间:</p>
                           <p>{ row.printTime ? this.$utils.tranDateTime(finshTime) : '--' }</p>
                        </div>
                    )
                } }
            ],
            id: null,
            addressInfo: {},
            detailObj: {
                status: 'new'
            },
            orderNum: ''
        }
    },
    components: {
        OrderStep, PrintOrderTable
    },
    mounted() {
        const { query } = this.$route;
        this.id = query.id;
        this.$nextTick(() => {
            this.getData();
        });
    },
    methods: {
        generatorImg(dfsId, width, height) {
            return `${this.$globalConfig.OSS_URL}${dfsId}@${width}w_${height}h_90q_1wh.jpg`;
        },
        getData() {
            const {
                toDoubleDecimal, getConsListValue, tranDateTime, add
            } = this.$utils;

            this.$http
                .post('/orderProduce/queryAssignDetail', { id: this.id })
                .then((data) => {
                     const {
                        tradeStatus, gmtCreate, userType, orderNum,
                        orderPayDto, invoiceStatus, groupStatus: gs,
                        orderProduceItemDtos, auditPriceStatus, vipPrice, originalPrice, couponPrice,
                        orderChangeLogDtos, totalPrice, orderAssignDto, orderProduceAssignItemDtos
                    } = data;
                    const isAuditPriceOrder = auditPriceStatus !== 'success' && tradeStatus === 'new';
                    const { payType, subStatus } = { payType: '', subStatus: '', ...orderPayDto };
                    const showPayTypeSub =
                      payType === 'monthly' ? getConsListValue(monthlyStatusMaps, subStatus, '') : '';
                    const orderChangeLen = orderChangeLogDtos && orderChangeLogDtos.length;
                    const assignPrice = orderAssignDto && orderAssignDto.assignPrice;
                    let orderPriceChangeLogs = [];
                    let showAdjustPrice = '--';
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
                    this.$http
                    .post('/orderPrintServicePromise/queryByOrderNumList', [orderNum])
                    .then((pdata) => {
                        this.promiseDto = pdata[0] || {};
                    })
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
                        orderProduceAssignItemDtosList: orderProduceAssignItemDtos || []
                    };
                })
        }
    }
};
</script>
<style lang="less" scoped>
.yield {
    font-size: 14px;
}
</style>
