<template>
  <div class="oss-upload-item">
    <div class="oss-upload-item__to">
      <span>{{ $t('oss.uploader.uploadTo') }} {{ item.bucket }}</span>
    </div>
    <div class="oss-upload-item__key">
      <span>{{ item.key }}</span>
    </div>
    <div class="oss-upload-item__progress">
      <div class="oss-upload-progress" :style="progressStyle"></div>
      <span>{{ displayProgress }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  computed: {
    progressStyle() {
      return `background-image: linear-gradient(to right, #f16d41 0%, #f16d41 ${this.item.progress}%, #232323 ${this.item.progress}%, #232323 100%) !important;`;
    },
    displayProgress() {
      if (this.item.status === 'uploading') {
        return `${this.item.upload}%`;
      }
      return this.$t(`oss.uploader.status.${this.item.status}`);
    },
  },
};
</script>

<style lang="less">
.oss-upload-item {
  padding: 16px 0;
  font-size: 14px;
  color: var(--primary);
  border-bottom: 1px solid #383838;
  user-select: none;
  &__to {
    margin-bottom: 2px;
  }
  &__key {
    margin-bottom: 2px;
  }
  &__progress {
    display: flex;
    align-items: center;
    .oss-upload-progress {
      flex: 1;
      height: 4px;
      margin-right: 8px;
    }
  }
}
</style>
