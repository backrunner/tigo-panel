<template>
  <div class="page">
    <slot></slot>
  </div>
</template>

<script>
export default {
  created() {
    this.$bus.$on('nav.tab.closed', this.tabCloseHandler);
  },
  beforeDestroy() {
    this.$bus.$off('nav.tab.closed', this.tabCloseHandler);
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
  &-main {
    width: 100%;
    height: 100%;
    background: #282828;
    box-shadow: 8px 8px 0px rgba(255, 255, 255, 0.025);
    position: relative;
    box-sizing: border-box;
  }
}
</style>
