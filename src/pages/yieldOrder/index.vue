<template>
  <div class="technical pageWrap">
    <pageHeader>生产订单</pageHeader>
    <Tabs value="" v-on:on-click="tabChange">
      <TabPane :label="tab.k"
               :name="tab.v"
               :key="`${index}_${tab.v}`"
               v-for="(tab, index) in tabs"
      />
    </Tabs>
    <header-query :exportData="exportData" ref="query" v-on:on-params-change="paramsChange" :items="queryItems" />
    <common-list
      ref="list"
      baseUrl="/orderProduce/listByProduce"
      :query-params="queryParams"
      :columns="tableColumns"
    />
  </div>
</template>
<script>
import {
   overdueStatus, productionStatus
} from '@/constant';

export default {
  name: 'technical',
  data() {
    return {
      tabs: [
      ],
      queryItems: [],
      queryParams: {},
      tableColumns: []
    };
  },
  created() {
    this.getSupplierList();
  },
  mounted() {
    this.tabs = [
      {
        k: '全部',
        v: 'all'
      },
      ...productionStatus
    ];
    this.initQueryItems();
        // 渲染表格
    this.initTableColumns();
  },
  methods: {
    exportData() {
      const dataAll = this.$refs.list.dataSources.map((data) => {
          const isOver = data.overdue > 0 ? '是，逾期' + data.overdue + '天' : '否';
          return {
            assignNum: data.assignNum,
            orderNum: `‘${data.orderNum}`,
            userDto: (data.userDto && data.userDto.nickName) || '--',
            gmtCreate: (data.gmtCreate && this.$utils.tranDateTime(data.gmtCreate)) || '--',
            deliverTime: (data.gmtCreate && this.$utils.tranDateTime(data.deliverTime)) || '--',
            gmtPrintStart: (data.gmtCreate && this.$utils.tranDateTime(data.gmtPrintStart)) || '--',
            gmtPlanPrintEnd: (data.gmtCreate && this.$utils.tranDateTime(data.gmtPlanPrintEnd)) || '--',
            status: this.$utils.getConsListValue(productionStatus, data.status, '--'),
            overdue: isOver
          }
        });
        this.$refs.list.exportData('生产订单', [
          { title: '生产单号', key: 'assignNum' }, { title: '订单号', key: 'orderNum' },
          { title: '服务商', key: 'userDto' }, { title: '订单接收时间', key: 'gmtCreate' },
          { title: '服务承诺时间', key: 'deliverTime' }, { title: '上机时间', key: 'gmtPrintStart' },
          { title: '预计交付时间', key: 'gmtPlanPrintEnd' }, { title: '生产进度', key: 'status' },
          { title: '逾期', key: 'overdue' }
        ], dataAll);
    },
    viewDetail(item) {
      const { orderNum } = item;
      if (orderNum) {
          this.$utils.viewsBops(`/order/detail?orderNum=${orderNum}`);
      }
    },
    initTableColumns() {
      this.tableColumns = [
          {
              title: '生产单号',
              align: 'center',
              key: 'assignNum'
          },
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
              title: '服务商',
              align: 'center',
              render: (h, { row }) => {
                let tem = '--';
                if ( row.userDto ) {
                  tem = <div>
                      {row.userDto.phone}<br/>
                      {row.userDto.nickName}
                  </div>
                } 
                return (
                  tem
                )
              }
          },
          {
              title: '订单接收时间',
              align: 'center',
              render: (h, { row }) => (
                  <div>
                    { this.$utils.tranDateTime(row.gmtCreate) }
                  </div>
              )
          },
          {
              title: '服务承诺时间',
              align: 'center',
              render: (h, { row }) => (
                  <div>
                    { this.$utils.tranDateTime(row.deliverTime) }
                  </div>
              )
          },
          {
              title: '上机时间',
              align: 'center',
              render: (h, { row }) => (
                  <div>
                    { 
                      row.gmtPrintStart
                      ?
                      this.$utils.tranDateTime(row.gmtPrintStart)
                      :
                      '--'
                    }
                  </div>
              )
          },
          {
              title: '预计交付时间',
              align: 'center',
              render: (h, { row }) => (
                  <div>
                    { 
                      row.gmtPlanPrintEnd
                      ?
                      this.$utils.tranDateTime(row.gmtPlanPrintEnd)
                      :
                      '--'
                    }
                  </div>
              )
          },
          {
              title: '生产进度',
              align: 'center',
              render: (h, { row }) => (
                  <div>
                     { this.$utils.getConsListValue(productionStatus, row.status, '--') }
                  </div>
              )
          },
           {
              title: '逾期',
              align: 'center',
              render: (h, { row }) => (
                  <div>
                    {
                      row.overdue > 0 
                      ?
                      <div style="color: red;">
                        是<br/>
                        { row.overdue } 天
                      </div>
                      :
                      '否'
                    }
                  </div>
              )
          },
          {
              title: '操作',
              align: 'center',
              width: 240,
              render: (h, { row }) => (
                  <div class="table-btn-actions">
                      <Button to={ { name: 'yieldOrderDetail', query: { id: row.id } } } size="small">查看</Button>
                  </div>
              )
          }
      ];
    },
    initQueryItems() {
      this.queryItems = [
                {
                    label: '生产单号',
                    type: 'input',
                    model: 'assignNum'
                },
                {
                    label: '订单号',
                    type: 'input',
                    model: 'orderNum'
                },
                {
                    label: '服务商',
                    type: 'select',
                    model: 'userId',
                    labelKey: 'label',
                    valueKey: 'value',
                    list: []
                },
                {
                    label: '派单时间',
                    type: 'datetimerange',
                    model: 'paymentTR'
                },
                {
                    label: '是否逾期',
                    type: 'select',
                    model: 'overdueStatus',
                    list: overdueStatus,
                    valueKey: 'v',
                    labelKey: 'k'
                }
            ];
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
                    value: item.userId
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
          ...otherParams
      };
    },
    tabChange(val) {
        this.queryParams = {
            ...this.queryParams,
            status: val === 'all' ? '' : val
        };
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
