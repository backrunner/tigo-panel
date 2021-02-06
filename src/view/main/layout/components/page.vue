<template>
  <div class="page">
    <slot></slot>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$bus.$on('tab-close', this.tabCloseHandler);
  },
  beforeDestroy() {
    this.$bus.$off('tab-close', this.tabCloseHandler);
  },
  methods: {
    tabCloseHandler(id) {
      const path = this.$store.getters['nav/getTabPath'](id);
      if (path && path === this.$route.path) {
        this.$destroy();
      }
    },
  },
};
</script>
