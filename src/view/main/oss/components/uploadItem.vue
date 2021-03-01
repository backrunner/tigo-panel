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
  data() {
    return {
      progressStyle: null,
    };
  },
  watch: {
    item: {
      immediate: true,
      deep: true,
      handler(item) {
        const fixedProgress = item.progress || 0;
        this.progressStyle = `background-image: linear-gradient(to right, #f16d41 0%, #f16d41 ${fixedProgress}%, #232323 ${fixedProgress}%, #232323 100%)`;
        this.$forceUpdate();
      },
    },
  },
  computed: {
    displayProgress() {
      if (this.item.status === 'uploading') {
        return `${this.item.progress}%`;
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
    margin-bottom: 6px;
  }
  &__key {
    margin-bottom: 8px;
  }
  &__progress {
    display: flex;
    align-items: center;
    .oss-upload-progress {
      flex: 1;
      height: 12px;
      margin-right: 12px;
    }
  }
}
</style>
