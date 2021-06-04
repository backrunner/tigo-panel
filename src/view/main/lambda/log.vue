<template>
  <Page class="lambdalog-wrapper">
    <div class="page-main lambdalog">
      <div class="loglist">
        <div class="loglist-head">
          <div class="loglist-head__title">
            <span>{{ lambdaName }}</span>
          </div>
          <div class="loglist-head__action">
            <el-date-picker
              class="loglist-date"
              :picker-options="datePickerOpts"
              v-model="date"
              size="small"
              @change="handleDateChange"
            ></el-date-picker>
            <el-button class="loglist-refresh" type="primary" size="small" @click="handleRefresh">
              {{ $t('refresh') }}
            </el-button>
          </div>
        </div>
        <div class="loglist-body">
          <el-table
            :data="tableData"
            class="el-table-dark loglist-body__table"
            height="calc(100% - 48px)"
          >
            <el-table-column
              prop="time"
              :label="$t('lambda.log.time')"
              :formatter="timeFormatter"
              width="192"
            ></el-table-column>
            <el-table-column prop="type" :label="$t('lambda.log.type')" width="150">
              <template slot-scope="scope">
                <el-tag size="small" type="info" v-if="scope.row.type === 'debug'" effect="dark">
                  {{ $t('lambda.log.debug') }}
                </el-tag>
                <el-tag size="small" v-if="scope.row.type === 'info'" effect="dark">
                  {{ $t('lambda.log.info') }}
                </el-tag>
                <el-tag size="small" type="warn" v-if="scope.row.type === 'warn'" effect="dark">
                  {{ $t('lambda.log.warn') }}
                </el-tag>
                <el-tag size="small" type="error" v-if="scope.row.type === 'error'" effect="dark">
                  {{ $t('lambda.log.error') }}
                </el-tag>
                <el-tag
                  size="small"
                  color="#c94d4d"
                  v-if="scope.row.type === 'fatal'"
                  effect="dark"
                >
                  {{ $t('lambda.log.fatal') }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="message" :label="$t('lambda.log.content')"></el-table-column>
          </el-table>
          <el-pagination
            class="loglist-body__pagination"
            layout="prev, pager, next"
            :total="total"
            :current-page="page"
            @current-change="handlePageChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import Page from '../layout/components/page.vue';
import moment from 'moment';

export default {
  components: {
    Page,
  },
  data() {
    return {
      lambdaName: `${this.$t('loading')}...`,
      date: new Date(),
      maxKeepDays: null,
      datePickerOpts: {
        disabledDate: (date) => {
          if (!this.maxKeepDays) {
            return (
              date.valueOf() >
              moment()
                .startOf('day')
                .valueOf()
            );
          } else {
            return (
              date.valueOf() <=
                moment()
                  .subtract(this.maxKeepDays, 'day')
                  .endOf('day') ||
              date.valueOf() >
                moment()
                  .startOf('day')
                  .valueOf()
            );
          }
        },
      },
      timeFormatter: (row) => {
        return moment(row.time).format('YYYY-MM-DD HH:mm:ss');
      },
      tableData: [],
      total: 0,
      page: 1,
      pageSize: 30,
    };
  },
  async created() {
    this.date = new Date();
    await this.fetchOptions();
  },
  watch: {
    lambdaId: {
      immediate: true,
      handler: async (newId) => {
        if (!newId) {
          return;
        }
        await this.fetchName();
        await this.fetchData();
      },
    },
  },
  computed: {
    lambdaId() {
      if (!Object.keys(this.$route.query).length) {
        return null;
      }
      return this.$route.query.lambdaId || null;
    },
  },
  methods: {
    async fetchOptions() {
      const res = await this.$nApi.get('/faas/log/getOptions');
      if (!res) {
        return;
      }
      this.maxKeepDays = res.data.data.maxKeepDays;
    },
    async fetchName() {
      if (this.$route.path !== '/app/lambda-log') {
        return;
      }
      if (!this.lambdaId) {
        return;
      }
      let res;
      try {
        res = await this.$pApi.get('/faas/getName', {
          params: {
            id: this.lambdaId,
          },
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch lambda name.', err);
        this.lambdaName = `[ID] ${this.lambdaId}`;
      }
      this.lambdaName = res.data.data;
    },
    async fetchData() {
      if (this.$route.path !== '/app/lambda-log') {
        return;
      }
      if (!this.lambdaId) {
        return;
      }
      let res;
      try {
        res = await this.$pApi.get('/faas/log/list', {
          params: {
            lambdaId: this.lambdaId,
            beginTime: moment(this.date)
              .startOf('day')
              .valueOf(),
            endTime: moment(this.date)
              .endOf('day')
              .valueOf(),
            page: this.page,
            pageSize: this.pageSize,
          },
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch lambda logs.', err);
        this.$message.error(this.$t('lambda.log.loadError'));
        return;
      }
      if (res) {
        this.total = res.data.data.total;
        this.tableData = res.data.data.logs;
      }
    },
    handlePageChange(page) {
      this.page = page;
      this.fetchData();
    },
    handleDateChange() {
      this.tableData = [];
      this.page = 1;
      this.total = 0;
      this.fetchData();
    },
    handleRefresh() {
      this.fetchData();
    },
  },
};
</script>

<style lang="less">
.lambdalog {
  padding: 12px 14px;
}
.loglist {
  height: 100%;
  position: relative;
  &-head {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    user-select: none;
    &__title {
      flex: 1;
      color: var(--primary);
      font-size: 14px;
    }
    &__action {
      justify-self: flex-end;
      .loglist-refresh {
        margin-left: 12px;
      }
    }
  }
  &-body {
    height: calc(100% - 56px);
    &__pagination {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 12px;
      box-sizing: border-box;
    }
  }
}
</style>
