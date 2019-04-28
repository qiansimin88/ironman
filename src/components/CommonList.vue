<template>
    <div :style="setStyle" class="list-wrap">
        <Table
            ref="table"
            :loading="loading"
            @on-selection-change="onSelectChange"
            @on-sort-change="onSortChange"
            :columns="columnDefines"
            :data="dataSources"
            highlight-row/>
        <div style="margin: 20px;overflow: hidden" v-if="dataSources.length > 0">
            <div style="display: flex;flex-direction: row;justify-content: center">
                <Page
                        :current="pageInfo.pageIndex"
                        :total="totalCount"
                        :page-size="pageInfo.pageSize"
                        @on-change="changePage"
                        @on-page-size-change="changePageSize"
                        show-sizer></Page>
            </div>
        </div>
    </div>
</template>
<script>

// const initPageInfo = {
//     current: 1,
//     size: 10
// };

export default {
    name: 'commonList',
    props: {
        setStyle: {
            type: Object
        },
        columns: {
            type: Array,
            default() {
                return [];
            }
        },
        baseUrl: {
            type: String,
            default: ''
        },
        queryParams: {
            type: Object,
            default() {
                return {};
            }
        },
        hasPageInfo: {
            type: Boolean,
            default: true
        },
        itemMap: {
            type: Function
        },
        isInit: {
            type: Boolean,
            default: true
        },
        filterEmpty: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            initPageInfo: {
                pageIndex: 1,
                pageSize: 10
            },
            // dataSources: this.datas,
            dataSources: [],
            pageInfo: null,
            totalCount: 0,
            uniKey: new Date().getTime(),
            loading: true
        };
    },
    mounted() {
        this.pageInfo = { ...this.initPageInfo };
        if (this.isInit) this.doFetch();
    },
    computed: {
        columnDefines() {
            return this.tranDefineToColumns(this.columns);
        },
        reqUrl() {
            return this.baseUrl;
        },
        reqParams() {
            return { ...this.queryParams };
        }
    },
    watch: {
        reqParams() {
            this.pageInfo = { ...this.initPageInfo };
            this.doFetch();
        }
    },
    methods: {
        refresh() {
            this.doFetch();
        },
        doFetch() {
            // console.log('doFetch');
            // console.log('reqUrl', this.reqUrl);
            // console.log('reqParams', this.reqParams);
            // console.log('pageInfo', this.pageInfo);
            const params = this.filterEmpty ? this.removeEmpty(this.reqParams) : this.reqParams;
            const pageInfo = this.hasPageInfo ? this.pageInfo : {};
            this.loading = true;
            this.$http.post(this.reqUrl, { ...params, pageInfo })
                .then((data) => {
                    let ret = data.data || [];
                    if (this.itemMap && this.itemMap instanceof Function) {
                        try {
                            ret = ret.map(this.itemMap);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                    this.dataSources = ret;
                    this.changeTotalCount(data.pageInfo.rowCount);
                    this.loading = false;
                }).catch((e) => {
                    console.log(e);
                    this.loading = false;
                });
        },
        tranDefineToColumns(val = []) {
            return val.map(item => item);
        },
        changePage(pn) {
            this.pageInfo.pageIndex = pn;
            this.doFetch();
        },
        changePageSize(size) {
            this.pageInfo.pageSize = size;
            if (this.pageInfo.pageIndex === 1) {
                this.doFetch();
            }
        },
        changeTotalCount(totalCount) {
            this.totalCount = totalCount;
        },
        onSelectChange(selection) {
            this.$emit('on-selection-change', selection);
            this.uniKey = new Date().getTime();
        },
        onSortChange(val) {
            this.$emit('on-sort-change', val);
        },
        handleSelectAll(status) {
            this.$refs.table.selectAll(status);
        },
        removeEmpty(params) {
            if (typeof params !== 'object' || params instanceof Date) {
                return params;
            }
            const newParams = {};
            const keys = Object.keys(params);
            keys.forEach((item) => {
                if (params[item] !== '') {
                    if (typeof params[item] === 'object' && !Array.isArray(params[item])) {
                        newParams[item] = this.removeEmpty(params[item]);
                    } else {
                        newParams[item] = params[item];
                    }
                }
            });
            return newParams;
        },
        exportData(name, columns, data) {
            this.$refs.table.exportCsv({
                filename: name,
                original: false,
                quoted: true,
                columns,
                data
            });
        },
        getDataSource() {
            return this.dataSources;
        }
    }
};
</script>
<style lang="less" scoped>
.list-wrap {
    margin-top: 20px;
}
</style>
