<template>
  <div class="page">
    <slot></slot>
  </div>
</template>

<script>
export default {
  created() {
    this.$bus.$on('tab-closed', this.tabCloseHandler);
  },
  beforeDestroy() {
    this.$bus.$off('tab-closed', this.tabCloseHandler);
  },
  mounted() {
    this.path = this.$route.path.replace('/app', '');
  },
  methods: {
    tabCloseHandler(path) {
      if (path && path === this.path) {
        this.$parent.$destroy();
      }
    },
  },
};
</script>

<style lang="less">
.page {
  padding: 18px;
  position: relative;
}
</style>
