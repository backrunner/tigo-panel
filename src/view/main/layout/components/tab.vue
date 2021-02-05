<template>
  <div
    :class="{
      'main-tabs-item': true,
      'main-tabs-item__selected': tabSelected,
    }"
    @click="handleTabClick"
  >
    <div class="tab-icon" v-if="type === 'home'">
      <i class="el-icon-menu"></i>
    </div>
    <div class="tab-text" v-else>
      <span>{{ name }}</span>
    </div>
    <div class="tab-close" v-if="type === 'default'">
      <i class="el-icon-close" @click="handleCloseClick"></i>
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
      this.closeTab({
        uid: this.uid,
        id: this.tabId,
      });
      const len = this.$store.state.nav.tabs.length;
      if (len > 0) {
        this.$router.replace(`/app$${this.$store.state.nav.tabs[len - 1].path}`);
      } else {
        this.$router.replace('/app');
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
  background: #202020;
  border-left: 1px solid #282828;
  border-right: 1px solid #282828;
  .tab-text {
    font-size: 12px;
    margin-left: 2px;
    margin-right: 12px;
  }
  .tab-icon {
    font-size: 12px;
  }
}
.main-tabs-item__selected {
  background: #2e2e2e;
  box-shadow: 2px 0px 2px rgba(255, 255, 255, 0.075);
}
</style>
