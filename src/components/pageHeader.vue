<template>
  <div class="page-header">
    <span class="mark"></span>
    <slot></slot>
  </div>
</template>
<script>
export default {
    name: 'PageHeader'
};
</script>
<style lang="less" scoped>
  .page-header{
    display: flex;flex-direction: row;align-items: center;
    font-size: 14px;
    font-weight: bold;
    .mark{
      display: inline-block;
      background: @text-color;
      width:4px;
      height:12px;
      margin-right: 4px;
    }
  }
</style>
