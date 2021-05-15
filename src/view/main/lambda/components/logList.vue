<template>
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
        <el-table-column prop="type" :label="$t('lambda.log.type')" width="150"></el-table-column>
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
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      lambdaName: `${this.$t('loading') }...`,
      date: new Date(),
      datePickerOpts: {
        disabledDate: (date) => {
          return (
            date.valueOf() >
            moment()
              .startOf('day')
              .valueOf()
          );
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
    this.lambdaId = this.$route.query.lambdaId;
    this.date = new Date();
    await this.fetchName();
    await this.fetchData();
  },
  methods: {
    async fetchName() {
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
      let res;
      try {
        res = await this.$pApi.get('/faas/queryLogs', {
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
