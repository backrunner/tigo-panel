<template>
  <div class="home-card">
    <div class="home-card-header">
      <span>{{title}}</span>
    </div>
    <div class="home-card-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
  },
};
</script>

<style lang="less">
.home-card {
  position: relative;
  padding: 8px 16px;
  box-sizing: border-box;
  background: #2a2a2a;
  box-shadow: 6px 6px 0px rgba(255, 255, 255, 0.075);
  &-header {
    font-size: 14px;
    font-weight: 600;
    line-height: 32px;
    color: var(--primary);
    user-select: none;
  }
  &-body {
    padding: 12px 0;
  }
}
</style>
