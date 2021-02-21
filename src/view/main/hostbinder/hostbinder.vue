<template>
  <Page>
    <div class="page-main hostbinder">
      <div class="hostbinder-header">
        <span>{{ $t('hostbinder') }}</span>
      </div>
      <div class="hostbinder-body">
        <el-form class="hostbinder-body-form" :inline="true">
          <el-input v-model="addForm.domain" :placeholder="$t('hostbinder.domain')"></el-input>
          <el-input v-model="addForm.targer" :placeholder="$t('hostbinder.target')"> </el-input>
          <el-button type="primary">{{ $t('add') }}</el-button>
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
              <el-table-column
                prop="target"
                :label="$t('hostbinder.target')"
              ></el-table-column>
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
    };
  },
};
</script>

<style lang="less">
.hostbinder {
  padding: 16px 18px;
  &-header {
    font-size: 15px;
    color: var(--primary);
    margin-bottom: 16px;
  }
  &-body {
    width: 100%;
    height: calc(100% - 36px);
    max-height: calc(100% - 36px);
    position: relative;
    &-form {
      width: 100%;
      margin-bottom: 16px;
      display: flex;
      .el-input {
        margin-right: 8px;
        flex: 1;
      }
      .el-button {
        width: 72px;
      }
    }
    &-table {
      height: calc(100% - 56px);
      max-height: calc(100% - 56px);
      position: relative;
      .hostbinder-table__title {
        font-size: 14px;
        color: var(--primary);
        margin-bottom: 16px;
      }
      .hostbinder-table__main {
        height: calc(100% - 35px);
        max-height: calc(100% - 35px);
      }
    }
  }
}
</style>
