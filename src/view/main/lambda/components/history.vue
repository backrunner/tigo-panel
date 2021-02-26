<template>
  <div class="debugger-history">
    <div class="debugger-history__header">
      <span>{{ $t('debugger.history.title') }}</span>
      <i
        class="el-icon-delete-solid"
        @click="clearHistory"
      ></i>
    </div>
    <div class="debugger-history__body n-scroll">
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
import { mapMutations, mapState } from 'vuex';
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
    ...mapState({
      uid: (state) => state.auth.uid,
    }),
    showEmpty() {
      return !this.history || !this.history.length;
    },
  },
  methods: {
    ...mapMutations('debug', ['setHistory']),
    setSelected(rt) {
      this.selected = rt;
    },
    itemClicked(item) {
      this.selected = item.rt;
      this.$emit('select', item);
    },
    clearHistory() {
      this.$confirm(this.$t('debugger.history.clear.confirm'), this.$t('confirm'))
        .then(async () => {
          this.setHistory([]);
          await this.$idb.del(`debug-history-${this.uid}`);
        })
        .catch(() => {});
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
    display: flex;
    align-items: center;
    span {
      flex: 1;
    }
    i {
      transition: color 100ms ease;
      justify-self: flex-end;
    }
    i:hover {
      cursor: pointer;
      color: var(--regular-text);
    }
  }
  &__body {
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
