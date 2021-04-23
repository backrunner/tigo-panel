<template>
  <Page>
    <div class="page-main keymanage">
      <div class="keymanage-header">
        <span class="keymanage-header-title">{{ $t('keymanage') }}</span>
      </div>
      <div class="keymanage-body">
        <div class="keymanage-body-title">
          <span>{{ $t('keymanage.list') }}</span>
          <el-button type="primary" size="medium" @click="handleAdd">{{ $t('add') }}</el-button>
        </div>
        <div class="keymanage-body-table">
          <el-table class="el-table-dark" :data="data" height="100%">
            <el-table-column prop="ak" label="Access Key" width="360px"></el-table-column>
            <el-table-column prop="sk" label="Secret Key" width="360px">
              <template slot-scope="scope">
                <div class="keymanage-sk">
                  <span v-if="showSk[scope.row.id]">{{ scope.row.sk }}</span>
                  <span v-else>{{ strTimes('*', 32) }}</span>
                  <i class="el-icon-view" @click="viewSk(scope.row.id)"></i>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('op')">
              <template slot-scope="scope">
                <el-popconfirm
                  :confirm-button-text="$t('confirm')"
                  :cancel-button-text="$t('cancel')"
                  :title="$t('keymanage.delete.confirm')"
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
  </Page>
</template>

<script>
import Page from '../layout/components/page';
import { strTimes } from '@/utils/string';

export default {
  components: {
    Page,
  },
  data() {
    return {
      data: null,
      showSk: {},
      strTimes,
    };
  },
  created() {
    this.fetchListData();
  },
  methods: {
    async fetchListData() {
      const res = await this.$nApi.get('/user/keys/list');
      if (!res) {
        return;
      }
      this.data = res.data.data;
    },
    handleAdd() {
      this.$confirm(this.$t('keymanage.add.confirm'), this.$t('confirm'))
        .then(async () => {
          this.btnDisabled = true;
          const res = await this.$nApi.post('/user/keys/add');
          if (!res) {
            this.btnDisabled = false;
            return;
          }
          this.btnDisabled = false;
          this.$message.success(this.$t('addSuccess'));
          this.fetchListData();
        })
        .catch(() => {});
    },
    async handleDelete(row) {
      const res = await this.$nApi.post('/user/keys/delete', {
        id: row.id,
      });
      if (!res) {
        return;
      }
      this.$message.success(this.$t('deleteSuccess'));
      this.fetchListData();
    },
    viewSk(id) {
      if (!this.showSk[id]) {
        this.$confirm(this.$t('keymanage.viewSk'), this.$t('confirm'))
          .then(() => {
            this.$set(this.showSk, id, true);
          })
          .catch(() => {});
      } else {
        this.$set(this.showSk, id, false);
      }
    },
  },
};
</script>

<style lang="less">
.keymanage {
  padding: 16px 24px;
  position: relative;
  &-header {
    color: var(--primary);
    margin-bottom: 16px;
    user-select: none;
  }
  &-body {
    position: relative;
    height: calc(100% - 32px - 21px - 36px);
    &-title {
      color: var(--primary);
      margin-bottom: 16px;
      font-size: 14px;
      display: flex;
      align-items: center;
      user-select: none;
      & > span {
        flex: 1;
      }
      .el-button {
        justify-self: flex-end;
      }
    }
    &-table {
      height: 100%;
    }
  }
  &-sk {
    display: flex;
    align-items: center;
    i {
      margin-left: 6px;
      cursor: pointer;
      transition: 200ms ease;
    }
    i:hover {
      color: var(--primary);
    }
  }
}
</style>
