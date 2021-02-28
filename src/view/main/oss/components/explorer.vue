<template>
  <div class="explorer">
    <div class="explorer-header">
      <div class="explorer-header__title">
        <span>{{ bucket }}</span>
        <i class="el-icon-setting" @click="openSettings"></i>
      </div>
      <el-button
        class="explorer-header__btn"
        type="primary"
        size="small"
        @click="handleUploadClick"
      >
        {{ $t('upload') }}
      </el-button>
    </div>
    <div class="explorer-body">
      <FileManager ref="fmanager" :bucket="bucket" />
    </div>
  </div>
</template>

<script>
import FileManager from './fileManager';

export default {
  props: {
    bucket: String,
  },
  components: {
    FileManager,
  },
  methods: {
    handleUploadClick() {
      this.$emit('upload', {
        prefix: `${this.$refs.fmanager.currentRoutes.join('/').substr(1) }/`,
      });
    },
    openSettings() {
      this.$emit('open-settings');
    },
  },
};
</script>

<style lang="less">
.explorer {
  width: 100%;
  height: 100%;
  padding: 16px 20px;
  position: relative;
  box-sizing: border-box;
  &-header {
    width: 100%;
    display: flex;
    align-items: center;
    user-select: none;
    margin-bottom: 16px;
    &__title {
      flex: 1;
      color: var(--primary);
      font-size: 15px;
      display: flex;
      align-items: center;
      i {
        margin-left: 8px;
        transform: translateY(1px);
      }
      i:hover {
        cursor: pointer;
        color: var(--regular-text);
      }
    }
    &__btn {
      justify-self: flex-end;
    }
  }
  &-body {
    width: 100%;
    height: calc(100% - 48px);
    max-height: calc(100% - 48px);
    position: relative;
  }
}
</style>
