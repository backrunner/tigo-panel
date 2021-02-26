<template>
  <el-drawer
    class="oss-upload"
    :visible.sync="show"
    :modal="false"
    size="450px"
    :title="$t('upload')"
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
    <div class="oss-upload__list" v-if="!showEmpty"></div>
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
export default {
  props: {
    bucket: String,
    list: Array,
  },
  data() {
    return {
      show: false,
      prefix: '',
      force: false,
    };
  },
  computed: {
    showEmpty() {
      return !this.list || !Array.isArray(this.list) || !this.list.length;
    },
  },
  methods: {
    open() {
      this.show = true;
      this.prefix = '';
      this.$nextTick(() => {
        document.getElementById('ossUploadFile').value = '';
      });
    },
    selectFile() {
      document.getElementById('ossUploadFile').click();
    },
    fileSelected() {
      const { files } = document.getElementById('ossUploadFile');
      this.$emit('upload', {
        prefix: this.prefix,
        files,
        force: this.force,
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
    padding-top: 12px;
  }
  &__empty {
    margin-top: 16px;
    font-size: 14px;
    border-top: 1px solid #383838;
    padding-top: 12px;
    color: var(--primary);
    user-select: none;
  }
}
</style>
