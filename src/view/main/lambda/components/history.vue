<template>
  <div class="debugger-history">
    <div class="debugger-history__header">
      <span>{{ $t('debugger.history.title') }}</span>
    </div>
    <div class="debugger-history__body">
      <div class="history-list">
        <HistoryItem v-for="item in history" :key="item.id" :item="item" />
      </div>
      <div class="history-empty">
        <span>{{ $t('debugger.history.empty') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import HistoryItem from './historyItem';

export default {
  props: {
    history: {
      type: Array,
      required: true,
    },
  },
  components: {
    HistoryItem,
  },
};
</script>

<style lang="less">
.debugger-history {
  &__header {
    padding: 14px 18px;
    color: var(--primary);
    font-size: 14px;
    user-select: none;
  }
  &__body {
    .history-empty {
      margin-top: 4px;
      font-size: 12px;
      text-align: center;
      color: var(--primary);
      letter-spacing: 0.05em;
      user-select: none;
    }
  }
}
</style>
