<template>
  <div class="technical pageWrap">
    <pageHeader>派单中心</pageHeader>
    <Tabs value="pending" v-on:on-click="tabChange">
      <TabPane :label="tab.k"
               :name="tab.v"
               :key="`${index}_${tab.v}`"
               v-for="(tab, index) in tabs"
      />
    </Tabs>
    <header-query ref="query" v-on:on-params-change="paramsChange" :items="queryItems" />
    <common-list
      ref="list"
      baseUrl="/orderProduce/listByAssign"
      :query-params="queryParams"
      :columns="tableColumns"
      :itemMap="itemMap"
    />
  </div>
</template>
<script>
import {
   payUserTypes
} from '@/constant';

export default {
  name: 'assigncenter',
  data() {
    return {
      allSeller: [],  
      tabs: [
          { k: '全部', v: 'all' },
          { k: '未派单', v: 'pending' },
          { k: '已派单', v: 'complete' }
      ],
      queryParams: {
        assignStatus: 'pending'
      },
      queryItems: [],
      tableColumns: []
    };
  },
  created() {
    this.getSupplierList();
  },
  mounted() {
    this.initQueryItems();
    this.initTableColumns();
  },
  methods: {
    initTableColumns() {
      this.tableColumns = [
          {
              title: '订单号',
              align: 'center',
              render: (h, { row }) => (
                  <a class="link" onClick={this.viewDetail.bind(this, row)}>
                    { row.orderNum }
                  </a>
              )
          },
          {
              title: '材料',
              align: 'center',
              key: 'materialName'
          },
          {
              title: '服务承诺时间',
              align: 'center',
              key: 'deliverTimeDesc'
          },
          {
              title: '订单金额',
              align: 'center',
              key: 'totalPriceCn'
          },
          {
              title: '销售人员',
              align: 'center',
                render: (h, { row }) => (
                <div>
                    <div>{ row.saleUserPhone }</div>
                    <div>{ row.saleUserNickName }</div>
                </div>
              )
          },
          {
              title: '派单状态',
              align: 'center',
              key: 'auditAssignStatusCn'
          },
          {
              title: '操作',
              align: 'center',
              width: 240,
              render: (h, { row }) => (
                  <div class="table-btn-actions">
                      <Button to={ { name: 'assignDetail', query: { orderNum: row.orderNum } } } size="small">{ row.auditAssignStatusCn === '已派单' ? '查看' : '派单' }</Button>
                  </div>
              )
          }
      ]
    },
    itemMap(item) {
      return {
        ...item,
        totalPriceCn: `￥${item.totalPrice}`,
        materialName: item.materialName || '--',
        saleUserPhone: item.saleUserDto ? `${item.saleUserDto.phone}` : '--',
        saleUserNickName: item.saleUserDto ? `${item.saleUserDto.nickName}` : '--',
        deliverTimeDesc: this.$utils.tranDateTime(item.deliverTime),
        auditAssignStatusCn: this.$utils.getConsListValue(this.tabs, item.assignStatus)
      }
    },
    initQueryItems() {
        this.$http.get('/sur/queryAllSaleUser', {
            params: {
                userId: this.$localStore.get('user_id')
            }
        })
                .then((data) => {
                    this.allSeller = data;
                    this.queryItems = [
                        {
                            label: '订单号',
                            type: 'input',
                            model: 'orderNum'
                        },
                        {
                            label: '订单审核时间',
                            type: 'datetimerange',
                            model: 'paymentTR'
                        },
                        {
                            label: '销售人员',
                            type: 'select',
                            model: 'saleUserId',
                            list: this.allSeller,
                            valueKey: 'userId',
                            labelKey: 'nickName'
                        },
                        {
                            label: '生产单号',
                            type: 'input',
                            model: 'orderNums'
                        }
                    ];
                });
    },
    // 获取服务商列表
    getSupplierList() {
        const params = {
            queryDto: {
                enterpriseVerify: 'y',
                loginUserId: this.$localStore.get('user_id'),
                saleUserId: null,
                gmtCreateEnd: '',
                gmtCreateStart: ''
            },
            pageInfo: {
                pageIndex: 1,
                pageSize: 100
            }
        };
        this.$http
            .post('/user/queryUserWithPage', params)
            .then((data) => {
                this.queryItems[2].list = data.data.map(item => ({
                    ...item,
                    label: `${item.nickName || item.realName}(${item.phone})`,
                    value: item.phone
                })).filter(item => item.value);
            });
    },
    paramsChange(params) {
      const {
          paymentTR,
          ...otherParams
      } = params;
      this.queryParams = {
          auditAssignStart: this.$utils.getDateTime(paymentTR[0]),
          auditAssignEnd: this.$utils.getDateTime(paymentTR[1]),
          assignStatus: this.queryParams.assignStatus,
          ...otherParams
      };
    },
    tabChange(val) {
      this.queryParams = {
          ...this.queryParams,
          assignStatus: val === 'all' ? '' : val
      };
    },
    viewDetail(item) {
      const { orderNum } = item;
      if (orderNum) {
          this.$utils.viewsBops(`/order/detail?orderNum=${orderNum}`);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.technical{
  .ivu-tabs-bar{
    margin-bottom: 20px!important;
  }
}
</style>
