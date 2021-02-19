<template>
  <div class="debugger-history">
    <div class="debugger-history__header">
      <span>{{ $t('debugger.history.title') }}</span>
    </div>
    <div class="n-scroll debugger-history__body">
      <div class="history-list" v-if="!showEmpty">
        <HistoryItem
          v-for="item in history"
          :key="item.rt"
          :item="item"
          :selected="selected"
          @click="itemClicked"
        />
      </div>
      <div class="history-empty" v-if="showEmpty">
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
  data() {
    return {
      selected: null,
    };
  },
  computed: {
    showEmpty() {
      return !this.history || !this.history.length;
    },
  },
  methods: {
    setSelected(rt) {
      this.selected = rt;
    },
    itemClicked(item) {
      this.selected = item.rt;
      this.$emit('select', item);
    },
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
    border-bottom: 1px solid #363636;
  }
  &__body {
    overflow-x: hidden;
    overflow-y: auto;
    max-height: calc(100% - 48px);
    .history-empty {
      margin-top: 16px;
      font-size: 12px;
      text-align: center;
      color: var(--primary);
      letter-spacing: 0.05em;
      user-select: none;
    }
  }
}
</style>
