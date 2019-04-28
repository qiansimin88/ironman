<template>
<div class="item-block">
    <div class="title">
        {{ title }}
    </div>
    <slot></slot>
    <template v-show="line">
        <Divider />
    </template>
</div>
</template>
<script>
export default {
    name: 'itemblock',
    props: {
        line: {
           type: Boolean,
           default: true
        },
        title: {
            type: String
        }
    }
};
</script>
<style lang="less" scoped>
.item-block {
    .title {
        font-size: 16px; color: @baseTetx; padding: 12px 0;
    }
}
</style>
