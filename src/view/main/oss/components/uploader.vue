<template>
  <el-drawer
    class="oss-upload"
    :visible.sync="show"
    :modal="false"
    size="450px"
    :title="$t('upload')"
    @close="handleClose"
  >
    <div class="oss-upload__form">
      <div class="oss-upload__input">
        <el-input :placeholder="$t('oss.uploader.prefix')" v-model="prefix"></el-input>
        <el-button type="primary" @click="selectFile">{{ $t('selectFile') }}</el-button>
      </div>
      <div class="oss-upload__check">
        <el-checkbox v-model="force">{{ $t('oss.uploader.force') }}</el-checkbox>
      </div>
    </div>
    <div class="oss-upload__list c-scroll" v-if="!showEmpty">
      <UploadItem v-for="item in list" :key="item.key + Math.random()" :item="item" />
    </div>
    <div class="oss-upload__empty" v-else>
      <span>{{ $t('oss.uploader.empty') }}</span>
    </div>
    <input
      type="file"
      id="ossUploadFile"
      style="display:none"
      multiple="multiple"
      @change="fileSelected"
    />
  </el-drawer>
</template>

<script>
import UploadItem from './uploadItem';

export default {
  props: {
    bucket: String,
    list: Array,
  },
  components: {
    UploadItem,
  },
  data() {
    return {
      show: false,
      prefix: '',
      force: false,
      hasUpload: false,
    };
  },
  computed: {
    showEmpty() {
      return !this.list || !Array.isArray(this.list) || !this.list.length;
    },
  },
  methods: {
    open(prefix) {
      this.show = true;
      this.hasUpload = false;
      this.prefix = prefix || '';
      this.$nextTick(() => {
        document.getElementById('ossUploadFile').value = '';
      });
    },
    handleClose() {
      if (this.hasUpload) {
        this.$bus.$emit('oss-file-refresh');
      }
    },
    selectFile() {
      document.getElementById('ossUploadFile').click();
    },
    fileSelected() {
      const { files } = document.getElementById('ossUploadFile');
      this.$emit('upload', {
        prefix: this.prefix,
        files,
        timestamp: new Date().valueOf(),
        force: this.force,
      });
      this.hasUpload = true;
      this.$nextTick(() => {
        document.getElementById('ossUploadFile').value = '';
      });
    },
  },
};
</script>

<style lang="less">
.oss-upload {
  &__form {
    .oss-upload__input {
      display: flex;
      margin-bottom: 12px;
      .el-input {
        flex: 1;
        margin-right: 8px;
      }
    }
  }
  &__list {
    margin-top: 16px;
    border-top: 1px solid #383838;
    height: calc(100% - 102px);
    max-height: calc(100% - 102px);
  }
  &__empty {
    margin-top: 16px;
    font-size: 14px;
    border-top: 1px solid #383838;
    padding-top: 12px;
    color: var(--primary);
    user-select: none;
  }
  .c-scroll::-webkit-scrollbar-track {
    background-color: #2e2e2e;
  }
  .c-scroll::-webkit-scrollbar-corner {
    background-color: #2e2e2e;
  }
}
</style>
