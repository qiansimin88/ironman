import Vue from 'vue';
import OrderOtherActions from '@/components/orderOtherActions.vue';
import imgShow from '@/components/imgShow.vue';
// 操作 派单 拆单 驳回
Vue.component('table-action', Vue.extend( OrderOtherActions ));

// 服务商
Vue.component('table-assign', {
    template:
    `
        <div v-if="rowData.status" class="h24h centerflex">
            <div>
                {{ rowData.assignName }}
            </div>
            <div>
                生产单号：
            </div>
            <router-link :to="'/yieldorder/detail?id=' + rowData.assignId">
            {{ rowData.assignNum }}
            </router-link>
        </div>
        <div v-else class="h24h centerflex">
            --
        </div>
    `,
    props: {
        rowData: {
            type: Object
        },
        field: {
            type: String
        },
        index: {
            type: Number
        }
    },
    data() {
        return {
        }
    }
});

// 表格的材料
Vue.component('table-specification', {
    template:
    `<div style="height: 100%; display: flex; flex-direction: column; padding: 10px 0; align-items: center; justify-content: center;  align-content: center; ">
       <span style="margnin-top: 2px;" class="h24" v-for="(o, i) in rowData.printInfo">
            {{ o.title }}: {{ o.val }}
        </span>
    </div>`,
    props: {
        rowData: {
            type: Object
        },
        field: {
            type: String
        },
        index: {
            type: Number
        }
    },
    data() {
        return {
        }
    }
});

// 表格的商品信息
Vue.component('table-commodity', {
    template:
    `<div style="display: flex; flex-direction: column; padding: 10px 0;">
        <a class="h24" style="margin-bottom: 8px;" :href="$utils.genDownloadUrl(modalInfo.srcModal.dfsId)" target="_blank">
            源文件：{{ modalInfo.srcModal.name }}
        </a>
        <span class="h24" style="margin-top:2px;">
            {{ modalInfo.showVolume }}
        </span>       
        <span class="h24" style="margin-top:2px;">
            {{ modalInfo.showArea }}
        </span>   
        <span class="h24" style="margin-top:2px;">
            {{ modalInfo.showSize }}
        </span>   
        <span class="h24" v-show="isBroken" style="margin-top:2px; color: '#FF0000'">
            {{ modalInfo.showSize }}
        </span>   
    </div>`,
    props: {
        rowData: {
            type: Object
        },
        field: {
            type: String
        },
        index: {
            type: Number
        }
    },
    data() {
        return {
            modalInfo: {
                srcModal: {}
            },
            isBroken: false
        }
    },
    mounted() {
        this.modalInfo = this.rowData.modalInfo;
        this.isBroken = this.rowData.isBroken;
    },
    methods: {
        view3d() {
            const params = { type: 'view3d', index: this.index, rowData: this.rowData };
            this.$emit('on-custom-comp', params);
        }
    }
});
// 表格的图
Vue.component('img-show', Vue.extend( imgShow ));
