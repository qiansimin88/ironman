<template>
    <div>
        <section class="print-items">
            <easytable
                is-horizontal-resize
                is-vertical-resize
                :row-height='170'
                :vertical-resize-offset='5'
                :min-height='900'
                @on-custom-comp="customCompFunc"
                style="width:100%"
                :table-data="datas"
                :columns="columns"
                :cell-merge="cellMerge"
            ></easytable>
        </section>
    </div>
</template>
<script>
import { printInfoMaps, groupStatus, refundStatus, printStatus, printPauseReasonStatus, productionStatus } from '@/constant';

const vMaps = {
    new: '开始生产',
    printing: '暂停生产',
    pause: '暂停详情',
    complete: '已完成'
};
export default {
    name: 'rowspantable',
    props: {
        detailObj: Object
    },
    components: {
    },
    data() {
        return {
            // nowModal: null, // 当前预览的模型
            // previewModal: false,
            // percentage: 0,
            // stlShow: false,
            // objShow: false,
            // urlViews: '',
            // showProgress: false,
            refreshKey: 1,
            columns: [],
            datas: []
        }
    },
    mounted() {
        this.initColumns();
    },
    watch: {
        detailObj(nVal, oVal) {
            if (nVal && nVal !== oVal) {
                this.refreshKey = this.refreshKey + 1;
                this.$nextTick(() => {
                    this.init(nVal);
                });
            }
        }
    },
    methods: {
        customCompFunc(params) {
            console.log(params);
        },
        // 合并
        cellMerge(rowIndex, rowData, field) {
            if (field === 'rowSpanLength' && rowData[field] !== 0) {
                return {
                    rowSpan: rowData[field],
                    colSpan: 1,
                    content: '',
                    componentName: 'table-assign'
                }
            }
            if (field === 'assignPrice') {
                if (rowData.rowSpanLength !== 0) {
                    return {
                        rowSpan: rowData.rowSpanLength,
                        colSpan: 1,
                        content: rowData.assignPrice ? `￥${rowData.assignPrice}` : '--'
                    }
                }
            }
            if (field === 'status') {
                if (rowData.rowSpanLength !== 0) {
                    return {
                        rowSpan: rowData.rowSpanLength,
                        colSpan: 1,
                        content: `${rowData.statusCn}`
                    }
                }
            }

            if (field === 'action') {
                if (rowData.rowSpanLength !== 0) {
                    return {
                        rowSpan: rowData.rowSpanLength,
                        colSpan: 1,
                        componentName: 'table-action'
                    }
                }
            }
        },
        initColumns() {
            this.columns = [
                {
                    titleAlign: 'center',
                    columnAlign: 'center',
                    title: '图片',
                    isResize: true,
                    width: 15,
                    field: 'img',
                    componentName: 'img-show'
                },
                {
                    titleAlign: 'center',
                    columnAlign: 'center',
                    title: '商品信息',
                    isResize: true,
                    width: 170,
                    field: 'commodity',
                    componentName: 'table-commodity'
                },
                {
                    titleAlign: 'center',
                    columnAlign: 'center',
                    title: '材料规格',
                    isResize: true,
                    width: 230,
                    field: 'specification',
                    componentName: 'table-specification'
                },
                {
                    titleAlign: 'center',
                    columnAlign: 'center',
                    title: '数量',
                    isResize: true,
                    width: 10,
                    field: 'quantity'
                },
                {
                    titleAlign: 'center',
                    columnAlign: 'center',
                    title: '单价',
                    isResize: true,
                    width: 15,
                    field: 'showUnitPrice'
                },
                {
                    titleAlign: 'center',
                    columnAlign: 'center',
                    title: '服务商',
                    width: 105,
                    isResize: true,
                    field: 'rowSpanLength'
                },
                {
                    titleAlign: 'center',
                    columnAlign: 'center',
                    title: '派单价',
                    width: 55,
                    isResize: true,
                    field: 'assignPrice'
                },
                {
                    titleAlign: 'center',
                    columnAlign: 'center',
                    title: '状态',
                    width: 55,
                    isResize: true,
                    field: 'status'
                },
                {
                    titleAlign: 'center',
                    columnAlign: 'center',
                    title: '操作',
                    width: 105,
                    isResize: true,
                    field: 'action'
                }
            ];
        },
        tranPrintTime(obj) {
            const { printTime } = obj;
            let msg = printTime || 0;
            msg = msg < 24 ? printTime : parseFloat(printTime / 24);
            return msg;
        },
        init(nVal) {
            this.initDatas(nVal);
        },
        generatorImg(dfsId, width, height) {
            return `${this.$globalConfig.OSS_URL}${dfsId}@${width}w_${height}h_90q_1wh.jpg`;
        },
        initDatas(val) {
            const {
                list, orderNum
            } = val;
            const { toDoubleDecimal, getConsListValue } = this.$utils;

            this.datas = list.map((v) => {
                const {
                    mainPicId, volume, area, length, width, height, productName, dataDfsId, sku, quantity, totalPrice, showUnitPrice,
                    assignName, assignNum, assignPrice, assignId, rowSpan, rowSpanLength, status, fatherInfo, printGuide, orderProduceItemDtos
                } = v;
                // const {
                //     orderItemSnapshotDto, orderPrintDto, sku, quantity, totalPrice
                // } = v;

                // const {
                //     mainPicId, productName, dataDfsId, attachmentDto,
                //     volume, area, length, width, height, dataStatus, fixDataDfsId
                // } = orderItemSnapshotDto;

                let printInfo = JSON.parse(sku);
                printInfo = JSON.parse(printInfo.propName).reduce((pre, cur) => {
                    if (!cur) return pre;
                    const item = pre;
                    const find = getConsListValue(printInfoMaps, cur.propName, '');
                    if (find) {
                        item.push({ title: find, val: cur.propValueName });
                    }
                    return pre;
                }, []);

                return {
                    printGuide,
                    orderNum,
                    fatherInfo,
                    rowSpan,
                    rowSpanLength,
                    showUnitPrice,
                    assignId,
                    assignName,
                    status,
                    statusCn: (fatherInfo && fatherInfo.auditTechStatus === 'pending') ? '待审核' : getConsListValue(productionStatus, status, '待派单'),
                    assignNum,
                    assignPrice: assignPrice,
                    quantity: quantity || 1,
                    printInfo,
                    showImg: this.generatorImg(
                        mainPicId,
                        80,
                        60
                    ),
                    orderProduceItemDtos,
                    orderProduceItemDtosItem: v,
                    modalInfo: {
                        showVolume: `体 积：${toDoubleDecimal(volume)}cm³`,
                        showArea: `表面积：${toDoubleDecimal(area)}c㎡`,
                        showSize: `尺 寸：${toDoubleDecimal(length)}*${toDoubleDecimal(width)}*${toDoubleDecimal(height)}`,
                        srcModal: {
                            name: productName,
                            dfsId: dataDfsId
                        }
                    }
                }
                // return {
                //     ...orderItemSnapshotDto,
                //     quantity,
                //     isBroken: dataStatus === 'broken',
                //     showImg: this.generatorImg(
                //         mainPicId,
                //         80,
                //         60
                //     ),
                //     fileLength: attachmentDto.fileLength,
                //     modalInfo: {
                //         showVolume: `体 积：${toDoubleDecimal(volume)}cm³`,
                //         showArea: `表面积：${toDoubleDecimal(area)}c㎡`,
                //         showSize: `尺 寸：${toDoubleDecimal(length)}*${toDoubleDecimal(width)}*${toDoubleDecimal(height)}`,
                //         srcModal: {
                //             name: productName,
                //             dfsId: dataDfsId
                //         },
                //         fixModal: {
                //             name: productName,
                //             dfsId: fixDataDfsId
                //         }
                //     },
                //     printInfo,
                //     showUnitPrice: `￥${toDoubleDecimal(totalPrice / quantity)}`,
                //     showGroupStatus: getConsListValue(groupStatus, gs, ''),
                //     orderPrintDto,
                //     showRefundStatus: getConsListValue(refundStatus, rs, ''),
                //     orderNum,
                //     refundStatus
                // };
            });
            console.log('datas', this.datas);
        }
    }

}
</script>
<style lang="less" scoped>
.progress {
  .flex; height: 300px;
}
</style>
