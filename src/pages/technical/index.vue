<template>
  <div class="technical pageWrap">
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
            <div v-if="nowModalAll.data.length > 1" class="table-btn-actions-view">
                <Button :disabled="nowModalAll.index === 0" @click="prewView('p')" size="small" style="margin-right: 20px;">上一个</Button>
                <Button :disabled="nowModalAll.index === nowModalAll.data.length - 1" @click="prewView('n')" size="small">下一个</Button>
            </div>
        </Modal>
       <!-- 审核记录 -->
        <Modal
          v-model="modalObj.show"
          title="审核记录"
          @on-ok="modalObj.show = false">
          <div class="audit-wrap">
            <template v-if="modalObj.auditHisList.length !== 0">
              <Timeline >
                <TimelineItem v-for="v in modalObj.auditHisList" :key="v.id">
                  <h5 v-if="v.actionText">{{ v.actionText }}</h5>
                  <h5 v-if="v.remarks">理由：{{ v.remarks }}</h5>
                  <h5>操作人：<span v-if="v.userDto">{{ v.userDto.nickName }}</span>&nbsp;&nbsp;<span>{{v.userDto.phone}}</span></h5>
                  <h5>操作时间：{{ $utils.tranDateTime(v.gmtCreate) }}</h5>
                </TimelineItem>
              </Timeline>
            </template>
            <template v-else>
              <p>暂无记录</p>
            </template>
          </div>
        </Modal>
    </div>
    <pageHeader>技术岗审核</pageHeader>
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
      baseUrl="/orderProduce/listByTech"
      :query-params="queryParams"
      :itemMap="itemMap"
      :columns="tableColumns"
    />
  </div>
</template>
<script>
import { ModelObj, ModelStl } from 'vue-3d-model';

export default {
  name: 'technical',
  data() {
    return {
      nowModalAll: {
        index: 0,
        data: []
      },
      nowModal: null, // 当前预览的模型
      previewModal: false,
      percentage: 0,
      stlShow: false,
      objShow: false,
      urlViews: '',
      showProgress: false,
      modalObj: {
        show: false,
        auditHisList: []
      },
      queryParams: {
        auditTechStatusList: ['pending']
      },
      materialList: [],
      tableColumns: [],
      tabs: [
          { k: '全部', v: 'all' },
          { k: '待审核', v: 'pending' },
          { k: '已审核', v: 'success' }
      ],
      queryItems: [{
        label: '订单号',
        type: 'input',
        model: 'orderNum'
      }, {
          label: '材料类型',
          type: 'select',
          model: 'materialId',
          list: [
          ],
          valueKey: 'value',
          labelKey: 'label'
      }]
    };
  },
  mounted() {
    // 所有材料
    this.getMaterialList()
      .then(data => {
        this.queryItems[1].list = this.materialList;
      });
    // 渲染表格
    this.initTableColumns();
  },
  components: {
    ModelObj, ModelStl
  },
  methods: {
    initTableColumns() {
      this.tableColumns = [
        {
              title: '图片',
              align: 'center',
              render: (h, { row }) => (
                  <div style="padding: 10px 0;">
                    <img src={ this.generatorImg(row.orderProduceItemDtos[0].mainPicId, 50, 38) }/>
                    <div style="cursor: pointer;" onClick={this.previewModalHanlder.bind(this, row)}>
                      预览
                    </div>
                  </div>
              )
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
              title: '材料',
              align: 'center',
              key: 'materialName'
          },
          {
              title: '数据数量',
              align: 'center',
              key: 'dataQuantity'
          },
          {
              title: '状态',
              align: 'center',
              key: 'auditTechStatusCn'
          },
          {
              title: '操作',
              align: 'center',
              width: 240,
              render: (h, { row }) => (
                  <div class="table-btn-actions">
                      <Button target="_blank" to={ this.$utils.genDownloadUrlZIP(row.orderProduceItemDtos.map(_ => _.dataDfsId).join(',')) } size="small">下载数据</Button>
                      <Button onClick={this.viewHis.bind(this, row)} size="small" >审核记录</Button>
                      <Button to={ { name: 'technicalDetail', query: { orderNum: row.orderNum } } } size="small">{ row.auditTechStatus === 'success' ? '查看' : '审核' }</Button>
                  </div>
              )
          }
      ];
    },
    paramsChange(params) {
      this.queryParams = {
          ...params,
          auditTechStatusList: this.queryParams.auditTechStatusList
      };
    },
    tabChange(val) {
      this.queryParams = {
          ...this.queryParams,
          auditTechStatusList: val === 'all' ? [] : [val]
      };
    },
    previewModalHanlder(row) {
      const { orderProduceItemDtos } = row;
      if (orderProduceItemDtos && orderProduceItemDtos.length) {
        this.previewModalControl(row.orderProduceItemDtos[0]);
        this.nowModalAll = {
          index: 0,
          data: row.orderProduceItemDtos
        }
      } else {
          this.$Message.warning('没有找到相应模型');
      }
    },
    prewView(l) {
      let { index } = this.nowModalAll;
      if (l === 'p') {
        index -= 1;
      } else {
        index += 1;
      }
      this.nowModalAll.index = index;
      console.log(this.nowModalAll.data[index]);
      this.previewModalControl(this.nowModalAll.data[index]);
    },
    previewModalControl(item) {
      const { productName, dataDfsId } = item;
      this.urlViews = this.$utils.genDownloadUrl(dataDfsId);
      this.itemFile = item;
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
    // 加载模型
    loadModal(item) {
      this.showProgress = true;
      const s = (item.loaded / item.total) * 100;
      this.percentage = s;
      if (s === 100) {
          this.showProgress = false;
      }
    },
    onLoadModel() {
      this.showProgress = false;
    },
    // 获取材料列表
    getMaterialList() {
        return new Promise((resolve, reject) => {
                this.$http.post('material/selectByConditions', {
                  materialDto: {},
                  pageInfo: {
                      pageIndex: 1,
                      pageSize: 1000
                  }
              }).then((data) => {
                  this.materialList = data.data.map(item => ({
                      ...item,
                      label: item.name,
                      value: item.id
                  }));
                  resolve(true);
              }).catch(err => {
                reject(err);
              })
        }); 
    },
    generatorImg(dfsId, width, height) {
        return `${this.$globalConfig.OSS_URL}${dfsId}@${width}w_${height}h_90q_1wh.jpg`;
    },
    itemMap(o) {
      return {
        ...o,
        auditTechStatusCn: this.$utils.getConsListValue(this.tabs, o.auditTechStatus)
      }
    },
    viewDetail(item) {
      const { orderNum } = item;
      if (orderNum) {
          this.$utils.viewsBops(`/order/detail?orderNum=${orderNum}`);
      }
    },
    viewHis(item) {
      this.$http.post('/orderAudit/list', {
            type: 'orderTech',
            orderNum: item.orderNum
        }).then((data) => {
          const dataItem = data.data;
          if (dataItem.length) {
              this.modalObj.show = true;
              this.modalObj.auditHisList = dataItem;
          } else {
              this.$Message.warning('暂无审核记录');
              this.reset();
          }
        })
    },
    reset() {
      this.modalObj.show = false;
      this.modalObj.auditHisList = [];
      this.previewModal = false;
      this.showProgress = false;
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
.table-btn-actions-view {
  .flex(center);
}
.progress {
  .flex; height: 300px;
}
</style>
