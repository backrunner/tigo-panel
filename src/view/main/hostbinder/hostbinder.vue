<template>
  <Page>
    <div class="page-main hostbinder">
      <div class="hostbinder-header">
        <span>{{ $t('hostbinder') }}</span>
        <span class="hostbinder-header__unlocked" v-if="unlocked">Unlocked</span>
      </div>
      <div class="hostbinder-body">
        <el-form class="hostbinder-body-form" ref="addForm" :inline="true" :model="addForm">
          <el-form-item prop="domain" class="hostbinder-body-form__input">
            <el-input v-model="addForm.domain" :placeholder="$t('hostbinder.domain')"></el-input>
          </el-form-item>
          <el-form-item prop="target" class="hostbinder-body-form__input">
            <el-input v-model="addForm.target" :placeholder="targetPlaceholder"> </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAdd" :disabled="addButtonDisbled">{{
              $t('add')
            }}</el-button>
          </el-form-item>
        </el-form>
        <div class="hostbinder-body-table">
          <div class="hostbinder-table__title">
            <span>{{ $t('hostbinder.table.title') }}</span>
          </div>
          <div class="hostbinder-table__main">
            <el-table class="el-table-dark" :data="tableData" height="100%">
              <el-table-column
                prop="domain"
                width="320"
                :label="$t('hostbinder.domain')"
              ></el-table-column>
              <el-table-column prop="target" :label="$t('hostbinder.target')"></el-table-column>
              <el-table-column :label="$t('op')" width="240">
                <template slot-scope="scope">
                  <el-popconfirm
                    :confirm-button-text="$t('confirm')"
                    :cancel-button-text="$t('cancel')"
                    :title="$t('hostbinder.delete.confirm')"
                    @confirm="handleDelete(scope.row)"
                  >
                    <el-button slot="reference" type="text" size="small">
                      {{ $t('delete') }}
                    </el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import Page from '../layout/components/page';

export default {
  components: {
    Page,
  },
  data() {
    return {
      tableData: [],
      addForm: {
        domain: '',
        target: '',
      },
      addButtonDisbled: false,
      unlocked: false,
      domainVerify: /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/,
    };
  },
  created() {
    this.checkUnlocked();
    this.fetchData();
  },
  computed: {
    targetPlaceholder() {
      return `${this.$t('hostbinder.target')} ${
        this.unlocked ? '' : '(/SERVICE/YOUR_SCOPE_ID/...)'
      }`;
    },
    targetVerify() {
      return this.unlocked ? /^\/.*/ : new RegExp(`^/(lambda)|(config)|(oss)/${this.scopeId}.*$`);
    },
  },
  methods: {
    async checkUnlocked() {
      const res = await this.$nApi.get('/hostbinder/checkUnlocked');
      if (!res) {
        return;
      }
      this.unlocked = !!res.data.data.unlocked;
    },
    async fetchData() {
      const res = await this.$nApi.get('/hostbinder/list');
      if (!res) {
        return;
      }
      this.tableData = res.data.data;
    },
    async handleAdd() {
      const { domain, target } = this.addForm;
      if (!domain) {
        this.$message.error(this.$t('hostbinder.domain.empty'));
        return;
      }
      if (!target) {
        this.$message.error(this.$t('hostbinder.target.empty'));
        return;
      }
      if (!this.domainVerify.test(domain)) {
        this.$message.error(this.$t('hostbinder.domain.invalid'));
        return;
      }
      if (!this.targetVerify.test(target)) {
        this.$message.error(this.$t('hostbinder.target.invalid'));
      }
      this.addButtonDisbled = true;
      const res = await this.$nApi.post('/hostbinder/add', {
        domain,
        target,
      });
      if (!res) {
        this.addButtonDisbled = false;
        return;
      }
      this.addButtonDisbled = false;
      this.$message.success(this.$t('addSuccess'));
      this.resetAddForm();
      this.fetchData();
    },
    async handleDelete(row) {
      const res = await this.$nApi.post('/hostbinder/delete', {
        id: row.id,
      });
      if (!res) {
        return;
      }
      this.$message.success(this.$t('deleteSuccess'));
      this.fetchData();
    },
  },
};
</script>

<style lang="less">
.hostbinder {
  padding: 16px 18px;
  &-header {
    user-select: none;
    font-size: 15px;
    color: var(--primary);
    margin-bottom: 16px;
    &__unlocked {
      font-size: 12px;
      margin-left: 12px;
      color: #4e4e4e;
    }
  }
  &-body {
    width: 100%;
    height: calc(100% - 36px);
    max-height: calc(100% - 36px);
    position: relative;
    &-form {
      width: 100%;
      margin-bottom: 4px;
      display: flex;
      &__input {
        margin-right: 8px;
        flex: 1;
        .el-form-item__content {
          width: 100%;
        }
      }
      .el-button {
        width: 72px;
      }
    }
    &-table {
      height: calc(100% - 62px);
      max-height: calc(100% - 62px);
      position: relative;
      .hostbinder-table__title {
        font-size: 14px;
        color: var(--primary);
        margin-bottom: 16px;
        user-select: none;
      }
      .hostbinder-table__main {
        height: calc(100% - 35px);
        max-height: calc(100% - 35px);
      }
    }
  }
}
</style>
