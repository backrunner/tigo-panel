<template>
  <div
    :class="{
      'main-tabs-item': true,
      'main-tabs-item-default': true,
      'main-tabs-item__selected': tabSelected,
    }"
    @click="handleTabClick"
    v-if="type === 'default'"
    v-context
  >
    <div class="tab-text">
      <span>{{ name }}</span>
    </div>
    <div class="tab-close">
      <i class="el-icon-close" @click.stop="handleCloseClick"></i>
    </div>
    <ContextMenu
      width="100"
      @item-clicked="handleContextClick"
      >
      <ContextMenuItem name="close">{{$t('nav.tab.close')}}</ContextMenuItem>
    </ContextMenu>
  </div>
  <div
    :class="{
      'main-tabs-item': true,
      'main-tabs-item__selected': tabSelected,
    }"
    @click="handleTabClick"
    @contextmenu.prevent.stop
    v-else
    >
    <div class="tab-icon">
      <i class="el-icon-menu"></i>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  props: {
    tabId: String,
    name: String,
    path: String,
    type: String,
  },
  computed: {
    ...mapState({
      uid: (state) => state.auth.uid,
      activatedTab: (state) => state.nav.activatedTab,
    }),
    tabSelected() {
      return this.activatedTab === this.tabId;
    },
  },
  methods: {
    ...mapMutations('nav', ['closeTab', 'setActivateTab']),
    handleTabClick() {
      if (this.activatedTab !== this.tabId) {
        this.setActivateTab(this.tabId);
        this.$router.replace(`/app${this.path}`);
      }
    },
    handleCloseClick() {
      const idx = this.$store.getters['nav/getTabIdx'](this.tabId);
      if (this.tabSelected) {
        const len = this.$store.state.nav.tabs.length;
        if (len === 1) {
          this.setActivateTab('home');
          this.$router.replace('/app');
        } else {
          let target;
          if (idx >= 1 && idx < len) {
            target = idx - 1;
          } else if (idx === 0) {
            target = idx + 1;
          }
          const tab = this.$store.state.nav.tabs[target];
          this.setActivateTab(tab.id);
          this.$router.replace(`/app${tab.path}`);
        }
      }
      this.closeTab({
        uid: this.uid,
        id: this.tabId,
      });
      this.$bus.$emit('tab-closed', this.path);
    },
    handleContextClick(name) {
      if (name === 'close') {
        this.handleCloseClick();
      }
    },
  },
};
</script>

<style lang="less">
.main-tabs-item {
  height: 40px;
  line-height: 40px;
  width: max-content;
  padding: 0 14px;
  box-sizing: border-box;
  color: var(--primary);
  display: flex;
  align-items: center;
  vertical-align: middle;
  background-color: #202020;
  border-right: 1px solid #282828;
  transition: background-color 150ms ease;
  user-select: none;
  .tab-text {
    font-size: 12px;
    margin-left: 2px;
    margin-right: 8px;
  }
  .tab-icon {
    font-size: 12px;
  }
  .tab-close {
    padding-top: 1px;
  }
  .tab-close > i {
    transition: 150ms ease;
    padding: 2px;
    box-sizing: border-box;
    border-radius: 2px;
  }
  .tab-close > i:hover {
    background: #282828;
  }
}
.main-tabs-item:hover {
  background-color: #1c1c1c;
}
.main-tabs-item-default {
  padding: 0 12px 0 16px;
}
.main-tabs-item__selected {
  background-color: #2e2e2e !important;
  .tab-close > i:hover {
    background: #262626;
  }
}
</style>
