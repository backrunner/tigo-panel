<template>
  <div class="loglist">
    <div class="loglist-head">
      <div class="loglist-head__title">
        <span>{{ lambdaName }}</span>
      </div>
      <div class="loglist-head__action">
        <i class="el-icon-refresh-right loglist-refresh" @click="handleRefresh"></i>
        <el-date-picker :disabledDate="dateDisabled" v-model="date"></el-date-picker>
      </div>
    </div>
    <div class="loglist-body">
      <el-table
        :tableData="tableData"
        class="el-table-dark loglist-body__table"
        height="calc(100% - 48px)"
      >
        <el-table-column prop="time" label="创建时间" :formatter="timeFormatter"></el-table-column>
        <el-table-column prop="type" label="类别"></el-table-column>
        <el-table-column prop="message" label="日志内容"></el-table-column>
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
      lambdaName: null,
      date: new Date(),
      dateDisabled: (date) => {
        return (
          date.valueOf() >
          moment()
            .add(1, 'day')
            .startOf('day')
            .valueOf()
        );
      },
      timeFormatter: (time) => {
        return moment(time).format('YYYY-MM-DD HH:mm:ss');
      },
      tableData: [],
      logs: [],
      total: 0,
      page: 1,
      pageSize: 30,
    };
  },
  created() {
    this.lambdaName = this.$route.query.lambdaName;
    this.date = new Date();
    this.fetchData();
  },
  methods: {
    async fetchData() {
      let res;
      try {
        res = await this.$pApi.get('/faas/queryLogs', {
          params: {
            lambdaName: this.lambdaName,
            beginTime: moment(this.date)
              .startOf('day')
              .unix(),
            endTime: moment(this.date)
              .endOf('day')
              .unix(),
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
    }
    &__action {
      justify-self: flex-end;
      .loglist-refresh {
        margin-right: 12px;
        font-size: 18px;
        color: var(--primary);
        transform: translateY(2px);
      }
      .loglist-refresh:hover {
        color: #999;
        cursor: pointer;
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
