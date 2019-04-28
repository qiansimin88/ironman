<template>
    <div style="display: flex; flex-direction: column; padding: 10px 0; align-items: center;">
        <img :src="rowData.showImg" style="width: 80px; height: 60px; cursor: pointer; text-align: center;"/>
        <div style="color: #2d8cf0; cursor: pointer" class="h24" @click.stop.prevent="previewModalHanlder(rowData)">
            预览
        </div>
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
            <!-- <div v-if="nowModalAll.data.length > 1" class="table-btn-actions-view">
                <Button :disabled="nowModalAll.index === 0" @click="prewView('p')" size="small" style="margin-right: 20px;">上一个</Button>
                <Button :disabled="nowModalAll.index === nowModalAll.data.length - 1" @click="prewView('n')" size="small">下一个</Button>
            </div> -->
        </Modal>
    </div>
</template>
<script>
import { orderTypes } from '@/constant';
import { ModelObj, ModelStl } from 'vue-3d-model';

export default {
    name: 'imgShow',
    props: {
        rowData: {
            type: Object
        }
    },
    data() {
        return {
            previewModal: false,
            percentage: 0,
            stlShow: false,
            objShow: false,
            urlViews: '',
            showProgress: false
        };
    },
    components: {
        ModelObj, ModelStl
    },
    computed: {
    },
    watch: {
        rowData(nVal, oVal) {
        }
    },
    mounted() {
    },
    methods: {
        onLoadModel() {
            this.showProgress = false;
        },
        previewModalHanlder(row) {
            const { orderProduceItemDtosItem } = row;
            if (orderProduceItemDtosItem) {
                this.previewModalControl(row.orderProduceItemDtosItem);
            } else {
                this.$Message.warning('没有找到相应模型');
            }
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
        }
    }
};
</script>
<style lang="less" scoped>
</style>
