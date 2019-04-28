<template>
    <div class="line-border-block pt0">
        <Row type="flex" justify="start" v-if="list.length > 0" class="query-wrap">
            <Col span="8" v-for="(item, index) in list" :key="`${item.title}_${index}`" class="col-wrap">
                <label :style="{width: item.width}" class="query-label">{{item.label}}</label>
                <Input
                        v-if="item.type === 'input'"
                        v-model="queryParams[item.model]"
                        :placeholder="item.pl"
                        style="width: 200px"
                        clearable/>
                <DatePicker
                        split-panels
                        v-if="item.type.indexOf('date') !== -1"
                        v-model="queryParams[item.model]"
                        :type="item.type"
                        :placeholder="item.pl"
                        style="width: 200px"/>
                <Select
                        v-if="item.type === 'select'"
                        v-model="queryParams[item.model]"
                        clearable
                        :placeholder="item.pl"
                        style="width:200px">
                    <Option v-for="o in item.list"
                            :value="o[item.valueKey]"
                            :key="o[item.valueKey]">{{ o[item.labelKey] }}</Option>
                </Select>
                <Select
                        v-if="item.type === 'selectAsync'"
                        v-model="queryParams[item.model]"
                        @on-change="(...params) => onSelectChange(item, params)"
                        filterable
                        remote
                        clearable
                        :placeholder="item.pl"
                        :remote-method="item.fn"
                        :loading="item.isLoading"
                        style="width:200px;">
                    <Option v-for="o in item.list"
                            :value="o[item.valueKey]"
                            :key="o[item.valueKey]">{{ o[item.labelKey] }}</Option>
                </Select>
                <Cascader
                        v-if="item.type === 'cascader'"
                        v-model="queryParams[item.model]"
                        :data="item.data"
                        :placeholder="item.pl"
                        change-on-select
                        style="width: 200px;display: inline-block;" ></Cascader>
            </Col>
            <Col span="4" class="col-wrap">
                <Button type="primary" @click="onConfirm">搜索</Button>
                <Button :style="{marginLeft: '10px'}" @click="onCancel">清除</Button>
                <Button
                    v-if="exportData"
                    style="margin-left: 10px"
                    type="primary"
                    @click.stop="exportData">导出</Button>
            </Col>
        </Row>
    </div>
</template>
<script>
export default {
    name: 'headerQuery',
    props: {
        exportData: {
            type: Function
        },
        items: {
            type: Array,
            default() {
                return [];
            }
        },
        lable: {
            type: String,
            default: ''
        },
        defaultQueryParams: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        const queryParams = { ...this.defaultQueryParams };
        return {
            queryParams,
            resParams: {}
        };
    },
    methods: {
        reset() {
            this.onCancel();
        },
        onConfirm() {
            this.tranParams();
            this.onParamsChange();
        },
        onCancel() {
            const obj = Object.keys(this.resParams).reduce((pre, cur) => {
                if (!cur) return pre;
                const v = pre;
                v[cur] = '';
                return v;
            }, {});
            this.resParams = { ...obj };
            this.queryParams = {
                ...obj,
                ...this.defaultQueryParams
            };
            this.onParamsChange();
        },
        onParamsChange() {
            this.$emit('on-params-change', this.resParams);
        },
        tranParams() {
            this.resParams = { ...this.queryParams };
            this.list.forEach((item) => {
                const { type, model } = item;
                const val = this.queryParams[model];
                if (['datetime', 'datetimerange', 'date'].indexOf(type) !== -1) {
                    this.$set(this.resParams, model, this.tranDate(val));
                }
            });
            // this.filterEmpty();
        },
        isEmpty(val) {
            if (!val) return true;
            if (Array.isArray(val)) {
                return val.every(item => !item);
            }
            return false;
        },
        tranDate(val) {
            if (!val) return '';
            if (Array.isArray(val)) {
                const v = val.map(o => (o && new Date(o).getTime()) || '');
                return this.isEmpty(v) ? '' : v;
            }
            return new Date(val).getTime();
        },
        filterEmpty() {
            this.resParams = Object.keys(this.resParams)
                .reduce((pre, cur) => {
                    if (!cur) return pre;
                    const v = this.resParams[cur];
                    const ret = pre;
                    if (v) ret[cur] = v;
                    return ret;
                }, {});
        },
        onSelectChange(item, params) {
            if (item.valueChange) {
                item.valueChange(...params);
            }
        }
    },
    computed: {
        list() {
            return this.items;
        }
    }
};
</script>
<style lang="less" scoped>

    .query-wrap {
        .col-wrap {
            margin-bottom: 14px;
        }
        .query-label {
            width: 84px;
            float: left;
            line-height: 36px;
            margin-right: 10px;
            font-size: 14px;
            color: @text-color;
            text-align: left;
        }
    }

</style>
