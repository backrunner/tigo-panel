<template>
  <div
    :class="{
      'debugger-history__item': true,
      'debugger-history__item--selected': selected === item.rt,
    }"
    @click="handleClick"
  >
    <div class="history-method">
      <span
        :class="{
          'history-status': true,
          'history-status__success': reqSuccess,
          'history-status__error': !reqSuccess,
        }"
        >{{ status }}</span
      >
      <span>{{ formattedMethod }}</span>
    </div>
    <div class="history-path">
      <span>{{ item.req.path }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    selected: {
      required: true,
    },
  },
  computed: {
    formattedMethod() {
      return this.item?.req?.method.toUpperCase();
    },
    status() {
      return this.item?.res?.status;
    },
    reqSuccess() {
      return this.item?.res?.status === 200;
    },
  },
  methods: {
    handleClick() {
      this.$emit('click', this.item);
    },
  },
};
</script>

<style lang="less">
.debugger-history__item {
  display: flex;
  align-items: center;
  color: var(--primary);
  padding: 16px 18px;
  user-select: none;
  border-bottom: 1px solid #363636;
  .history-method {
    margin-right: 6px;
    font-size: 10px;
    .history-status {
      font-size: 8px;
      padding: 2px 4px;
      color: #2e2e2e;
      margin-right: 6px;
    }
    .history-status__success {
      background-color: #6fbb49;
    }
    .history-status__error {
      background-color: #eb5f5f;
    }
  }
  .history-path {
    font-size: 10px;
    word-break: break-all;
    white-space: pre-wrap;
  }
}
.debugger-history__item:hover {
  background: #3a3a3a;
}
.debugger-history__item--selected {
  background: #424242 !important;
}
</style>
