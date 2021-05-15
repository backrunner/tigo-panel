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
          $t('add')
        }}</el-button>
      </el-form-item>
    </el-form>
    <div class="senv-body">
      <el-table class="senv-body__table" :data="data" height="100%">
        <el-table-column prop="key" label="Key"></el-table-column>
        <el-table-column prop="value" label="Value"></el-table-column>
        <el-table-column :label="$t('op')" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleEditClick(scope.row)">{{
              $t('edit')
            }}</el-button>
            <el-popconfirm
              :confirm-button-text="$t('confirm')"
              :cancel-button-text="$t('cancel')"
              :title="$t('editor.env.delete.confirm')"
              @confirm="handleDeleteConfirm(scope.row)"
            >
              <el-button slot="reference" type="text" size="small">
                {{ $t('delete') }}
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
    lambdaId: {
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
      newLambdaCache: {},
    };
  },
  methods: {
    async fetchData() {
      const res = await this.$nApi.get('/faas/env/get', {
        params: {
          lambdaId: this.lambdaId,
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
      if (`${this.lambdaId}`.startsWith('new')) {
        if (this.newLambdaCache[key]) {
          this.$message.error(this.$t('editor.env.duplicated'));
          return;
        }
        this.newLambdaCache[key] = value;
      } else {
        const res = await this.$nApi.post('/faas/env/add', {
          lambdaId: this.lambdaId,
          k: key,
          v: value,
        });
        if (!res) {
          this.addBtnDisabled = false;
          return;
        }
        this.fetchData();
      }
      this.$message.success(this.$t('addSuccess'));
      this.addBtnDisabled = false;
    },
    handleEditClick() {},
    async handleDeleteConfirm(row) {
      const res = await this.$nApi.post('/faas/env/delete', {
        lambdaId: this.lambdaId,
        k: row.key,
      });
      if (!res) {
        return null;
      }
      this.$message.success(this.$t('deleteSuccess'));
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
.senv {
  .el-drawer__body {
    max-height: calc(100% - 55px);
  }
}
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
  height: calc(100% - 68px);
  max-height: calc(100% - 68px);
  position: relative;
  .senv-body__table {
    .cell {
      .el-button {
        margin-right: 8px;
      }
      .el-button:last-child {
        margin-right: 0;
      }
    }
    .el-table__body-wrapper::-webkit-scrollbar-track {
      background-color: #2e2e2e;
    }
    .el-table__body-wrapper::-webkit-scrollbar-corner {
      background-color: #2e2e2e;
    }
  }
}
</style>
