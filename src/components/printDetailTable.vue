<template>
    <div>
        <div class="modal-wrap">
        <!-- 预览 -->
            <Modal v-model="previewModal" width="80%" :styles="{height: '60vh'}" footer-hide>
                <div style="position: relative;">
                    <div class="progress" v-show="showProgress">
                        <Progress v-show="showProgress" :percent="percentage" hide-info />
                    </div>
                    <div v-show="!showProgress">
                    <model-stl v-if="stlShow && urlViews" :src="urlViews"
                            @on-load="onLoadModel" @on-progress="loadModal"></model-stl>
                    <model-obj v-if="objShow && urlViews" :src="urlViews"
                            @on-load="onLoadModel" @on-progress="loadModal"></model-obj>
                    </div>
                </div>
            </Modal>
        </div>
        <section class="print-items">
            <Table :columns="columns" :data="datas" :key="refreshKey"></Table>
        </section>
    </div>
</template>
<script>
import { printInfoMaps, groupStatus, refundStatus, printStatus, printPauseReasonStatus } from '@/constant';
import { ModelObj, ModelStl } from 'vue-3d-model';

const vMaps = {
    new: '开始生产',
    printing: '暂停生产',
    pause: '暂停详情',
    complete: '已完成'
};
export default {
    name: 'printDeatilTable',
    props: {
        detailObj: Object
    },
    components: {
        ModelObj, ModelStl
    },
    data() {
        return {
            nowModal: null, // 当前预览的模型
            previewModal: false,
            percentage: 0,
            stlShow: false,
            objShow: false,
            urlViews: '',
            showProgress: false,
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
        initColumns() {
            this.columns = [
                {
                    title: '图片',
                    align: 'center',
                    render: (h, params) => h('div', [
                        h(
                            'img',
                            {
                                attrs: {
                                    src: params.row.showImg
                                },
                                style: {
                                    width: '80px',
                                    height: '60px',
                                    cursor: 'pointer'
                                }
                            }
                        ),
                        h(
                            'div',
                            {
                                style: {
                                    color: '#2d8cf0',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.previewModalHanlder(params.row);
                                    }
                                }
                            },
                            '预览'
                        )
                    ])
                },
                {
                    title: '商品',
                    render: (h, params) => {
                        const { modalInfo, isBroken } = params.row;
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
                        if (isBroken) {
                            arr.push(h('span', {
                                style: {
                                    marginTop: '2px',
                                    color: '#FF0000'
                                }
                            }, '破损数据'));
                        }
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
                    render: (h, params) => {
                        const { printInfo } = params.row;
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
                    key: 'quantity'
                },
                {
                    title: '单价(元)',
                    key: 'showUnitPrice'
                },
                {
                    title: '服务商'
                },
                {
                    title: '派单价',
                    render: (h, params) => {
                        const {
                            showGroupStatus, showRefundStatus, orderPrintDto
                        } = params.row;
                        const arr = [
                            h('span', {
                                style: {
                                    marginTop: '2px'
                                }
                            }, showGroupStatus)
                        ];
                        if (orderPrintDto) {
                            const { status } = orderPrintDto;
                            let des = this.$utils.getConsListValue(printStatus, status, '');
                            let timeDesc = '';
                            if (status === 'printing') {
                                let time = this.tranPrintTime(orderPrintDto);
                                if (time) {
                                    time = `${time}${time < 24 ? '小时' : '天'}`;
                                    time = time || '--';
                                    timeDesc = time;
                                }
                            }

                            des = `( ${des} ${timeDesc || ''})`;
                            arr.push(h('span', {
                                style: {
                                    marginTop: '2px'
                                }
                            }, des));
                        }
                        if (showRefundStatus) {
                            arr.push(h('span', {
                                style: {
                                    marginTop: '2px'
                                }
                            }, showRefundStatus));
                        }
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
                    title: '操作',
                    render: (h, params) => {
                        const arr = [];
                        const { orderPrintDto, orderNum } = params.row;
                        if (orderPrintDto) {
                            const { status } = orderPrintDto;
                            if (status !== 'complete') {
                                arr.push(h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    style: {
                                        marginTop: '8px',
                                        width: '80px'
                                    },
                                    on: {
                                        click: () => {
                                            this.printClick(orderPrintDto, orderNum);
                                        }
                                    }
                                }, vMaps[status]));
                            }
                        }
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
                }
            ];
        },
            // 加载模型
        loadModal(item) {
            this.showProgress = true;
            const s = (item.loaded / item.total) * 100;
            this.percentage = s;
            if (s === 100) {
                this.showProgress = false;
            }
        },
        previewModalHanlder(row) {
            this.previewModalControl(row.orderProduceItemDtosItem);
        },
        previewModalControl(item) {
            const { productName, dataDfsId } = item;
            this.urlViews = this.$utils.genDownloadUrl(dataDfsId);
            // stl
            if (/\.stl/gi.test(productName)) {
                this.stlShow = true;
                this.previewModal = true;
            } else if (/\.obj/gi.test(productName)) {
                this.objShow = true;
                this.previewModal = true;
            } else {
                this.previewModal = false;
                this.$Message.warning('该类型文件暂不支持预览');
            }
        },
        onLoadModel() {
            this.showProgress = false;
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
                orderProduceItemDtos: list, orderNum
            } = val;
            const { toDoubleDecimal, getConsListValue } = this.$utils;

            this.datas = list.map((v) => {
                const {
                    mainPicId, volume, area, length, width, height, productName, dataDfsId, sku, quantity, totalPrice
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
                    showUnitPrice: `￥${toDoubleDecimal(totalPrice / quantity)}`,
                    quantity: quantity || 1,
                    printInfo,
                    showImg: this.generatorImg(
                        mainPicId,
                        80,
                        60
                    ),
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
