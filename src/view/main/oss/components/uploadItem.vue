<template>
  <div class="oss-upload-item">
    <div class="oss-upload-item__to">
      <span>{{ $t('oss.uploader.uploadTo') }} {{ item.bucket }}</span>
      <i class="el-icon-close oss-upload-item__close" v-if="closable" @click="handleClose" />
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
import { mapMutations } from 'vuex';

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
    closable() {
      return this.item.status === 'success' || this.item.status === 'failed';
    },
  },
  methods: {
    ...mapMutations('oss', ['removeUploadItem']),
    handleClose() {
      this.removeUploadItem(this.item);
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
    display: flex;
    align-items: center;
    span {
      flex: 1;
    }
    .oss-upload-item__close {
      justify-self: flex-end;
      color: rgb(114, 118, 123);
      cursor: pointer;
      transition: color 200ms ease;
    }
    .oss-upload-item__close:hover {
      color: var(--primary);
    }
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
