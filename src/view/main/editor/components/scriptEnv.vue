<template>
  <el-drawer
    class="senv"
    :visible.sync="visible"
    :title="$t('editor.env.title')"
    size="560px"
    :modal="false"
  >
    <el-form :inline="true" :model="addForm" class="senv-header">
      <el-form-item>
        <el-input v-model="addForm.key" placeholder="Key"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="addForm.value" placeholder="Value"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAddClick" :disabled="addBtnDisabled">{{
          $t('editor.env.add')
        }}</el-button>
      </el-form-item>
    </el-form>
    <div class="senv-body">
      <el-table class="senv-body__table" :data="data">
        <el-table-column prop="key" label="Key"> </el-table-column>
        <el-table-column prop="value" label="Value"> </el-table-column>
        <el-table-column :label="$t('editor.env.op')" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEditClick(scope.row)">{{
              $t('editor.env.edit')
            }}</el-button>
            <el-popconfirm
              :confirm-button-text="$t('editor.confirm')"
              :cancel-button-text="$t('editor.cancel')"
              :title="$t('editor.env.confirmDelete')"
              @confirm="handleDeleteConfirm(scope.row)"
            >
              <el-button slot="reference" type="text" size="small">
                {{ $t('editor.env.delete') }}
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    scriptId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      data: [],
      visible: false,
      addForm: {
        key: '',
        value: '',
      },
      addBtnDisabled: false,
      newScriptCache: {},
    };
  },
  methods: {
    async fetchData() {
      const res = await this.$nApi.get('/faas/env/get', {
        params: {
          scriptId: this.scriptId,
        },
      });
      if (!res) {
        this.$message.error(this.$t('editor.env.fetchFailed'));
        return;
      }
      const env = res.data.data;
      if (!env) {
        return;
      }
      this.data = Object.keys(env).map((key) => {
        return {
          key,
          value: env[key],
        };
      });
    },
    async handleAddClick() {
      this.addBtnDisabled = true;
      const key = this.addForm.key.trim();
      const value = this.addForm.value.trim();
      if (!key || !value) {
        this.$message.error(this.$t('editor.env.formValidTip'));
        this.addBtnDisabled = false;
        return;
      }
      if (`${this.scriptId}`.startsWith('new')) {
        if (this.newScriptCache[key]) {
          this.$message.error(this.$t('editor.env.duplicated'));
          return;
        }
        this.newScriptCache[key] = value;
      } else {
        const res = await this.$nApi.post('/faas/env/add', {
          scriptId: this.scriptId,
          k: key,
          v: value,
        });
        if (!res) {
          this.addBtnDisabled = false;
          return;
        }
        this.fetchData();
      }
      this.$message.success(this.$t('editor.env.addSuccess'));
      this.addBtnDisabled = false;
    },
    handleEditClick() {},
    async handleDeleteConfirm(row) {
      const res = await this.$nApi.post('/faas/env/delete', {
        scriptId: this.scriptId,
        k: row.key,
      });
      if (!res) {
        return null;
      }
      this.$message.success(this.$t('editor.env.deleteSuccess'));
      this.fetchData();
    },
    open() {
      this.visible = true;
      this.fetchData();
    },
    close() {
      this.visible = false;
      this.data = [];
    },
  },
};
</script>

<style lang="less">
.senv-header {
  display: flex;
  .el-form-item {
    flex: 1;
    position: relative;
    &__content {
      width: 100%;
    }
  }
  .el-form-item:last-child {
    flex: 0;
    width: 70px;
  }
}
.senv-body {
  .el-table {
    .cell {
      .el-button {
        margin-right: 8px;
      }
      .el-button:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
