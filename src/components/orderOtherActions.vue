<template>
  <div class="o-btm-other centerflex" style="line-height: 60px;">
    <template>
        <div v-if="isEnable && !isAudit">
            <Button type="primary" @click="showAssign">派单</Button>
        </div>
        <div v-if="isEnable && !isAudit">
            <Button type="primary" @click="showSplit">订单拆分</Button>
        </div>
        <div v-if="isAudit">
            <Button type="primary" @click="showAudit">审核</Button>
        </div>
        <div v-if="isReject && !isAudit">
            <Button @click="showRejectAudit" type="error">
                审核驳回
            </Button>
        </div>
    </template>
    <!-- 技术岗审核 -->
    <Modal
          v-model="auditModal.show"
          okText="审核通过"
          cancelText="审核不通过"
          title="技术岗审核意见"
          :loading="auditModal.loading"
          @on-cancel="auditHandlerCancle"
          @on-ok="auditHandlerOk">
      <div class="audit-tech-wrap">
        <Input
            v-model="auditModal.content"
            type="textarea"
            :rows="2"
            placeholder="请输入"
        />
      </div>
    </Modal>
    <!-- 审核驳回 -->
    <Modal
          v-model="rejectAuditModal.show"
          title="驳回审核"
          :loading="rejectAuditModal.loading"
          @on-ok="commitRejectAudit">
      <div class="audit-tech-wrap">
        <Input
            v-model="rejectAuditModal.content"
            type="textarea"
            :rows="2"
            placeholder="请输入"
        />
      </div>
    </Modal>
    <!--订单派单-->
    <Modal
      v-model="assignModal.show"
      :loading="assignModal.loading"
      title="派单"
      @on-ok="assign"
    >
      <div class="assign-wrap">
        <Form
          :model="assignModal.params"
          :label-width="120"
          label-position="left"
          @submit.native.prevent
        >
          <FormItem label="服务商" placeholder="请选择服务商" required>
            <Select v-model="assignModal.params.joinId">
              <Option
                :key="item.id"
                :value="item.id"
                v-for="item in suppList"
                >{{ item.val }}</Option
              >
            </Select>
          </FormItem>
          <FormItem label="派单金额" placeholder="请输入派单金额" required>
            <InputNumber
              v-model="assignModal.params.updateAssingPrice"
              :min="0"
            ></InputNumber>
          </FormItem>
          <!-- <FormItem label="平台利润">
            <span v-text="`${profit}元`" style="color:#FF0000"></span>
          </FormItem> -->
        </Form>
        <!-- <h5>注：自定义派单产生的差价则作为平台利润</h5> -->
      </div>
    </Modal>
    <!--订单拆分-->
    <Modal
      width="800"
      v-model="spliteOrderModal.show"
      :loading="spliteOrderModal.loading"
      title="订单拆分"
      @on-ok="splite"
    >
      <div class="splite-wrap">
        <Table :columns="splitOrder.columns" :data="splitOrder.data"></Table>
        <h5>*只分配模型数量变化部分即可，无需全部重新分配，分配剩余的模型原服务商将继续生产。</h5>
        <ul class="sub-wrap">
          <li class="sub" v-for="(order, pIndex)  in spliteOrderModal.params.orderSplitDtos"
              :key="`${order.deviceAsId}_${order.supplierPrinterServiceId}`">
            <section>
              <div class="li-row">
                <label>服务商</label>
                <Select v-model="order.deviceAsId" style="width: 520px">
                  <Option
                          :key="item.id"
                          :value="item.id"
                          v-for="item in tempSuppList"
                  >{{ item.val }}</Option>
                </Select>
              </div>
              <div class="li-row" v-for="(child, cIndex) in order.orderAssignItemDtos" :key="`${child.id}_${cIndex}`">
                <label>源文件</label>
                <Select v-model="child.orderItemId" style="width: 150px">
                  <Option
                          :key="o.id"
                          :value="o.id"
                          v-for="o in splitOrder.data"
                  >{{ o.showProductName }}</Option>
                </Select>
                <label>数量</label>
                <InputNumber v-model="child.quantity" :min="1"></InputNumber>
                <label>合计(元)</label>
                <InputNumber v-model="child.totalPrice" :min="0"></InputNumber>
                <Button shape="circle" @click="addOrderFile(pIndex, cIndex)">
                  <Icon custom="iconfont iconB-xinzeng" />
                </Button>
                <Button shape="circle" @click="removeOrderFile(pIndex, cIndex)" v-if="order.orderAssignItemDtos.length > 1">
                  <Icon custom="iconfont icondelete" />
                </Button>
              </div>
            </section>
            <Button
                    v-if="spliteOrderModal.params.orderSplitDtos.length > 1"
                    shape="circle"
                    @click="removeOrder(pIndex)"
                    style="position: absolute;top: 10px;right: 10px;">
              <Icon custom="iconfont iconshanchu" />
            </Button>
          </li>
      </ul>
        <Button type="primary" long @click="addOrder" style="margin-top: 20px">新增</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { orderTypes } from '@/constant';

const initSpliteOrderParams = {
    // 拆分订单的所有数据结构
    orderNumber: null,
    // 服务商维度的订单
    orderSplitDtos: [
    // 单个
        {
            deviceAsId: 0, // 服务商ID
            supplierPrinterServiceId: null, // 生产机ID
            userId: null, // 服务商ID
            loginUserId: null, // 当前用户ID
            // 文件维度
            orderAssignItemDtos: [
                {
                    orderItemId: 0, // 文件ID
                    quantity: 1,
                    totalPrice: 0 // 总价
                }
            ]
        }
    ]
};


export default {
    name: 'orderOtherActions',
    props: {
        rowData: {
            type: Object
        }
    },
    data() {
        return {
            orderType: '',
            assignModal: {
                show: false,
                loading: true,
                params: {
                    joinId: '',
                    updateAssingPrice: 0.0
                }
            },
            spliteOrderModal: {
                show: false,
                loading: true,
                params: {
                    ...initSpliteOrderParams
                }
            },
            // 审核
            auditModal: {
                show: false,
                loading: true,
                content: ''
            },
            // 驳回
            rejectAuditModal: {
                show: false,
                loading: true,
                content: ''
            },
            oriPrice: 0.0,
            suppList: [], // 服务商列表
            tempSuppList: [], // 临时服务商列表
            splitOrder: {
                columns: [],
                data: []
            },
            pmsMaps: {
                enableSendOrder: false
            }
        };
    },
    computed: {
        isEnable() {
            return this.rowData.assignId === undefined || ( this.rowData.assignId !== undefined && ['new', 'printing', 'pause', 'pass', 'print_complete'].indexOf(this.rowData.status) !== -1);
        },
        isReject() {
             return this.rowData.assignId === undefined;
        },
        // 是否已经派单
        isPaid() {
            return !!this.rowData.assignId;
        },
        // 是否审核
        isAudit() {
            return this.rowData.assignId === undefined && this.rowData.fatherInfo.auditTechStatus === 'pending';
        },
        profit() {
            const { add, toDoubleDecimal } = this.$utils;
            return toDoubleDecimal(add(
                this.oriPrice,
                -1 * Number(this.assignModal.params.updateAssingPrice)
            ));
        }
    },
    watch: {
        rowData(nVal, oVal) {
            if (nVal && nVal !== oVal) {
                this.getSupplierPrintServiceByCondition(nVal.fatherInfo);
                this.initSpliteModalInfo(nVal.fatherInfo);
            }
        }
    },
    mounted() {
        this.orderType = orderTypes[this.$route.name];
        this.initSplitColumns();
    },
    methods: {
        auditHandlerOk() {
            if ( !this.auditModal.content ) {
                this.messageWarningFn('请填写原因', 'auditModal');
                return false;
            }
             this.$http
                .post('/orderAudit/auditTechSuccess', {
                    orderNum: this.rowData.orderNum,
                    remarks: this.auditModal.content
                })
                .then(() => {
                    this.auditModal = { ...this.auditModal, show: false };
                    this.$Message.success('审核成功');
                    setTimeout(() => {
                        this.$router.push({ name: 'Technical' })
                    }, 500);
                }).catch(() => {
                    this.auditModal.loading = false;
                    this.$nextTick(() => {
                        this.auditModal.loading = true;
                    });
                });
        },
        auditHandlerCancle() {
             if ( !this.auditModal.content ) {
                this.messageWarningFn('请填写原因', 'auditModal');
                return false;
            }
             this.$http
                .post('/orderAudit/auditTechFail', {
                    orderNum: this.rowData.orderNum,
                    remarks: this.auditModal.content
                })
                .then(() => {
                    this.auditModal = { ...this.auditModal, show: false };
                    this.$Message.success('审核成功');
                    setTimeout(() => {
                        this.$router.push({ name: 'Technical' })
                    }, 500);
                }).catch(() => {
                    this.auditModal.loading = false;
                    this.$nextTick(() => {
                        this.auditModal.loading = true;
                    });
                });
        },
        // 审核
        showAudit() {
            this.auditModal = { ...this.auditModal, show: true, content: '' };
        },
        commitRejectAudit() {
            if (!this.rejectAuditModal.content) {
                this.messageWarningFn('请填写驳回意见！', 'rejectAuditModal');
                return false;
            }
            // console.log(this.rowData.fatherInfo);
            this.$http
                .post('/orderAudit/auditAssignFail', {
                    creator: this.curUserId,
                    orderNum: this.rowData.orderNum,
                    type: 'orderAssign',
                    remarks: this.rejectAuditModal.content
                })
                .then(() => {
                    this.rejectAuditModal = { ...this.rejectAuditModal, show: false };
                    this.$Message.success('驳回成功！');
                    setTimeout(() => {
                        this.$router.push({ name: 'assignCenter' })
                    }, 500);
                    this.$emit('on-audit-reject');
                }).catch(() => {
                    this.rejectAuditModal.loading = false;
                    this.$nextTick(() => {
                        this.rejectAuditModal.loading = true;
                    });
                });
        },
        showRejectAudit() {
            this.rejectAuditModal = { ...this.rejectAuditModal, show: true, content: '' };
        },
        addOrderFile(pIndex) {
            const o = this.newObj(initSpliteOrderParams);
            this.spliteOrderModal.params.orderSplitDtos[pIndex].orderAssignItemDtos
                .push(o.orderSplitDtos[0].orderAssignItemDtos[0]);
        },
        removeOrderFile(pIndex, cIndex) {
            this.spliteOrderModal.params.orderSplitDtos[pIndex].orderAssignItemDtos
                .splice(cIndex, 1);
        },
        removeOrder(pIndex) {
            this.spliteOrderModal.params.orderSplitDtos.splice(pIndex, 1);
        },
        addOrder() {
            const o = this.newObj(initSpliteOrderParams);
            this.spliteOrderModal.params.orderSplitDtos.push(o.orderSplitDtos[0]);
        },
        initSplitColumns() {
            this.splitOrder.columns = [
                {
                    title: '源文件',
                    key: 'showProductName'
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
                    title: '总价(元)',
                    key: 'showTotalPrice'
                }
            ];
        },
        initSpliteModalInfo(nVal) {
            const { orderProduceItemDtos } = nVal;
            const arr = orderProduceItemDtos.map((v) => {
                const { totalPrice, quantity, productName, id } = v;
                return {
                    id,
                    quantity,
                    showProductName: productName,
                    showTotalPrice: `￥${this.$utils.toDoubleDecimal(totalPrice)}`,
                    showUnitPrice: `￥${this.$utils.toDoubleDecimal(totalPrice / quantity)}`
                };
            });
            this.splitOrder.data = arr;
        },
        showAssign() {
            const { fatherInfo } = this.rowData;
            const {
                printGuide,
                orderNum,
                orderAssignDto
            } = fatherInfo || this.rowData;
            const { supplierPrinterServiceId, userId } = {
                supplierPrinterServiceId: '',
                userId: '',
                ...orderAssignDto
            };
            if (!printGuide) {
                this.$Message.warning('请先填写作业指导书！');
                return;
            }
            // 获取预设派单价
            this.$http
                .post('/orderPrice/orderAssignPrice', {
                    orderNum
                }).then((data) => {
                    const oriPrice = data.assignPrice;
                    this.oriPrice = oriPrice;
                    // 获取服务商
                    this.getSupplierPrintServiceByCondition( this.rowData.fatherInfo || this.rowData );
                    this.assignModal = {
                        ...this.assignModal,
                        show: true,
                        params: {
                            ...this.assignModal.params,
                            joinId: supplierPrinterServiceId ? `${supplierPrinterServiceId}|${userId}` : '',
                            updateAssingPrice: oriPrice
                        }
                    };
                });
        },
        getAssignPrice() {
            const { orderNum } = this.rowData.fatherInfo || this.rowData;
            this.$http
                .post('/orderPrice/orderAssignPrice', {
                    orderNum
                }).then((data) => data.assignPrice);
        },
        getSupplierPrintServiceByCondition(val) {
            const { orderProduceItemDtos } = val;
            let sku = orderProduceItemDtos && orderProduceItemDtos[0] && orderProduceItemDtos[0].sku;
            sku = JSON.parse(sku);
            sku = (JSON.parse(sku.propName) || []).reduce((pre, cur) => {
                const v = pre;
                if (!cur) return pre;
                v[cur.propName] = cur.propValueName;
                return pre;
            }, {});
            this.$http
                .post('/sp/getSupplierPrintServiceByCondition', {
                    supplierPrinterServiceDto: {
                        adapterMaterialId: sku.materialId,
                        color: sku.color,
                        precisions: sku.precision
                    },
                    pageInfo: {
                        pageIndex: 1,
                        pageSize: 50
                    }
                })
                .then((data) => {
                    let arr = (data && data.data) || [];
                    arr = arr.map((item) => {
                        const {
                            id, userId, userDto, deviceAsName
                        } = item;
                        return {
                            id: `${id}|${userId}`,
                            val: `${userDto &&
                                  (userDto.realName || userDto.nickName)}  (${deviceAsName})`
                        };
                    });
                    this.tempSuppList = [...arr];
                    this.suppList = [...arr];
                });
        },
        messageWarningFn(text, key) {
            this.$Message.warning(text);
            setTimeout(() => {
                this[key].loading = false;
                this.$nextTick(() => {
                    this[key].loading = true;
                });
            }, 500);
        },
        assign() {
            const {
                joinId,
                updateAssingPrice
            } = this.assignModal.params;
            const { orderNum, assignId } = this.rowData.fatherInfo || this.rowData;
            let msg = '';
            if (!joinId) {
                msg = '请选择服务商！';
            }
            if (updateAssingPrice <= 0) {
                msg = '派单金额需大于0';
            }
            if (msg) {
                this.messageWarningFn(msg);
                return;
            }
            const arr = joinId.split('|');

            const pams = {
                loginUserId: this.$localStore.get('user_id'),
                orderAssignDtos: [
                    {
                        assignPrice: updateAssingPrice,
                        supplierPrinterServiceId: arr[0],
                        userId: arr[1]
                    }
                ]
            };

            if ( this.isPaid ) {
                pams.originAssignId = assignId;
            } else {
                pams.orderNum = orderNum;
            }
            this.$http
                .post('/orderAssign/updateAssign', pams)
                .then(() => {
                    this.$Message.success('派单成功！');
                    this.assignModal.show = false;
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                })
                .catch(() => {
                    this.assignModal = { ...this.assignModal, loading: false };
                    this.$nextTick(() => {
                        this.assignModal.loading = true;
                    });
                });
        },
        splite() {
            const { orderSplitDtos } = this.spliteOrderModal.params;
            const ret = orderSplitDtos.reduce((pre, cur) => {
                if (!cur) return pre;
                const obj = pre;
                const { orderAssignItemDtos } = cur;
                orderAssignItemDtos.forEach((item) => {
                    const { orderItemId, quantity, totalPrice } = item;
                    const child = { quantity, totalPrice };
                    console.log(totalPrice);
                    const key = orderItemId;
                    // eslint-disable-next-line
                    if (obj.hasOwnProperty(key)) {
                        const v = obj[key];
                        v.quantity = this.$utils.add(v.quantity, child.quantity);
                        v.totalPrice = this.$utils.add(v.totalPrice, child.totalPrice);
                    } else {
                        obj[key] = { ...child };
                    }
                });
                return pre;
            }, {});
            let msg = '';
            const hasNoSup = orderSplitDtos.some(v => v.deviceAsId === 0);
            if (hasNoSup) { msg = '请选择服务商'; }
            if (!msg) {
                Object.keys(ret).forEach((key) => {
                    if (msg) return;
                    if (key === '0') {
                        msg = '请选择源文件！';
                    }
                    const find = this.splitOrder.data.find(item => Number(item.id) === Number(key));
                    if (!find) return;
                    const v = ret[key];
                    if (v.quantity > find.quantity) {
                        msg = '填入数量总和不得超过原数量';
                    }
                    // if (v.totalPrice > this.rowData.fatherInfo.totalPrice) {
                    //     msg = '填入价格总和不得超过原总价';
                    // }
                    if (!v.totalPrice) {
                        msg = '请输入有效的价格！';
                    }
                    if (v.quantity < find.quantity) {
                        msg = '请保证拆完所有数量和模型';
                    }
                });
                if (Object.keys(ret).length < this.splitOrder.data.length) {
                    msg = '请保证拆完所有数量和模型';
                }
            }
            if (msg) {
                this.$Message.warning(msg);
                setTimeout(() => {
                    this.spliteOrderModal.loading = false;
                    this.$nextTick(() => {
                        this.spliteOrderModal.loading = true;
                    });
                }, 500);
                return false;
            }
            const curUserId = this.$localStore.get('user_id');
            const list = orderSplitDtos.map((item) => {
                const { deviceAsId, loginUserId, ...other } = item;
                const arr = deviceAsId.split('|');
                return {
                    ...other,
                    userId: arr[1],
                    supplierPrinterServiceId: arr[0],
                    loginUserId: curUserId
                };
            });
            this.$http.post('/orderAssign/updateAssign', {
                orderNum: this.rowData.fatherInfo.orderNum || this.rowData.orderNum,
                loginUserId: this.$localStore.get('user_id'),
                orderAssignDtos: list
            }).then(() => {
                this.$Message.success('订单拆分成功！');
                this.$router.push({ name: 'assignCenter' }); // 派单中心
            }).catch(() => {
                this.spliteOrderModal.loading = false;
                this.$nextTick(() => {
                    this.spliteOrderModal.loading = true;
                });
            });
        },
        showSplit() {
            const {
                printGuide
            } = this.rowData.fatherInfo || this.rowData;

            if (!printGuide) {
                this.$Message.warning('请先填写作业指导书！');
                return;
            }
            this.spliteOrderModal = {
                ...this.spliteOrderModal, show: true, loading: true, params: this.newObj(initSpliteOrderParams)
            };
            // 分配拆单数据
            this.getSupplierPrintServiceByCondition( this.rowData.fatherInfo || this.rowData );
            this.initSpliteModalInfo(this.rowData.fatherInfo || this.rowData);
        },
        newObj(obj = {}) {
            return JSON.parse(JSON.stringify(obj));
        }
    }
};
</script>
<style lang="less" scoped>
h5 {
  color: @warning-color;
  margin: 10px 0;
}
.assign-wrap {
}
.splite-wrap {
  .sub{
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #ccc;
    border-radius: 2px;
    margin-bottom: 20px;
    &:last-child{
      margin-bottom: 0;
    }
    &-wrap{
      list-style: none;
      display: flex;
      flex-direction: column;
      li{
        display: flex;flex-direction: column;
        .li-row{
          display: flex;flex-direction:row;align-items: center;margin-bottom: 10px;
          &:first-child{
            margin-top: 30px;
          }
          &:last-child{
            margin-bottom: 20px;
          }
          label{
            display: inline-block;
            margin: 0 10px;
          }
          label:first-child{
            width: 60px;
            margin: 0;
          }
          .ivu-btn{
            margin-left: 10px;
          }
        }
      }
    }
    &-item{
      position: relative;
    }
  }
}
</style>
