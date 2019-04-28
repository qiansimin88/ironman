<template>
    <Steps class="order-step" :current="cur">
        <Step
                v-for="(item, index) in list"
                :title="item"
                :key="`${item}_${index}`"></Step>
    </Steps>
</template>

<script>
const statusMaps = {
    new: 0, printing: 1, pause: 2, pass: 3, print_complete: 3, complete: 4, close: 5
};

export default {
    name: 'orderStep',
    props: {
        curStatus: String
    },
    computed: {
        cur() {
            return statusMaps[this.curStatus] || 0;
        },
        list() {
            const v = ['待生产', '打印中', '暂停', '通过', '打印完成', '完成', '关闭'];
            return v;
        }
        // status() {
        //     let v = 'process';
        //     if (this.curStatus === 'complete') {
        //         v = 'finish';
        //     } else if (this.curStatus === 'close') {
        //         v = 'error';
        //     }
        //     return v;
        // }
    }
};
</script>

<style lang="less">
.order-step{
    margin: 15px 0 20px;
    text-align: center;
    .ivu-steps-item{
        text-align: left;
    }
    .ivu-steps-item:last-child{
        width: auto !important;
    }
    .ivu-steps-head-inner{
        width: 44px;
        height: 44px;
        font-size: 20px;
        line-height: 44px;
        position: relative;
        top: -10px;
    }
    .ivu-steps-main{
        display: block;
    }
    .ivu-steps-title{
        padding-right: 0;
    }
}
</style>
