<template>
  <el-dialog class="lambda-imexport" :title="$t('editor.name.imexport')" :visible.sync="show">
    <div class="lambda-imexport__main">
      <el-button type="primary" @click="handleImport">{{ $t('import') }}</el-button>
      <el-button type="primary" @click="handleExport">{{ $t('export') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    lambdaId: {
      type: String,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  created() {
    this.$bus.$on('close-lambda-imexport', this.close);
  },
  beforeDestroy() {
    this.$bus.$off('close-lambda-imexport', this.close);
  },
  methods: {
    handleImport() {
      this.$bus.$emit('import-lambda', this.lambdaId);
    },
    handleExport() {
      this.$bus.$emit('export-lambda', this.lambdaId);
    },
    open() {
      this.show = true;
    },
    close(id) {
      if (id !== this.lambdaId) {
        return;
      }
      this.show = false;
    },
  },
};
</script>

<style lang="less">
.lambda-imexport {
  &__main {
    width: 100%;
    padding-bottom: 12px;
    display: flex;
    .el-button {
      flex: 1;
    }
  }
}
</style>
