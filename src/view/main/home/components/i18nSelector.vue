<template>
  <span class="i18n-selector">
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link">
        {{ displaySelected }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="cn">中文</el-dropdown-item>
        <el-dropdown-item command="en">English</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

const localeMap = {
  cn: '中文',
  en: 'English',
};

export default {
  computed: {
    ...mapState('locale', ['locale']),
    displaySelected() {
      return localeMap[this.locale];
    },
  },
  methods: {
    ...mapMutations('locale', ['setLocale']),
    handleCommand(val) {
      this.setLocale(val);
    },
  },
};
</script>

<style lang="less">
.manaco-type-selector {
  span {
    color: var(--primary);
  }
}
</style>
