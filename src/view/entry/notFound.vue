<template>
  <div class="entry-container">
    <div class="entry cantuse">
      <div class="cantuse-icon">
        <i class="el-icon-close"></i>
      </div>
      <div class="cantuse-text">
        <span>{{$t('entry.notfound.message')}}</span>
      </div>
      <div class="cantuse-control">
        <el-button type="primary" @click="back">{{$t('entry.notfound.back')}}</el-button>
      </div>
      <EntryFooter />
    </div>
  </div>
</template>

<script>
import EntryFooter from './components/entryFooter';

export default {
  components: {
    EntryFooter,
  },
  methods: {
    back() {
      this.$router.back();
    },
  },
};
</script>

<style lang="less">
.cantuse {
  &-icon {
    color: var(--primary);
    font-size: 72px;
    transform: translateX(-12px);
  }
  &-text {
    color: var(--primary);
    font-size: 26px;
    margin-top: 8px;
  }
  &-control {
    margin-top: 42px;
    .el-button {
      padding: 12px 24px;
    }
  }
  .entry-footer {
    margin-top: 168px;
  }
}
</style>
