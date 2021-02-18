<template>
  <div class="debugger-response">
    <div class="debugger-response__header">
      <span>Response</span>
    </div>
    <div class="debugger-response__body">
      <pre>{{ response }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    response: String,
  },
};
</script>

<style lang="less">
.debugger-response {
  &__header {
    font-size: 14px;
    color: var(--primary);
  }
  &__body {
    height: 300px;
    position: relative;
    pre {
      height: 100%;
      background: #232323;
    }
  }
}
</style>
