<template>
  <Page>
    <div class="page-main permlog">
      <div class="permlog-head">
        <div class="permlog-head__name">
          <span>{{ lambdaName }}</span>
        </div>
        <div class="permlog-head__action">
          <el-date-picker
            class="permlog-date"
            :picker-options="datePickerOpts"
            v-model="date"
            size="small"
            @change="handleDateChange"
          ></el-date-picker>
          <el-button type="primary" size="small" @click="refreshCharts">
            {{ $t('refresh') }}
          </el-button>
        </div>
      </div>
      <div class="permlog-charts">
        <div class="permlog-chart">
          <div class="permlog-chart__name">
            <span>{{ $t('lambda.perm.chart.request') }}</span>
          </div>
          <div class="permlog-chart__main">
            <v-chart :option="requestStatusOpts" :autoresize="true" style="width: 40%"></v-chart>
            <v-chart :option="requestChartOpts" :autoresize="true"></v-chart>
          </div>
        </div>
      </div>
    </div>
  </Page>
</template>

<script>
import Page from '../layout/components/page.vue';
import VChart, { THEME_KEY } from 'vue-echarts';
import { GridComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { LineChart, GaugeChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { use } from 'echarts/core';
import moment from 'moment';

use([CanvasRenderer, LineChart, GaugeChart, GridComponent, TitleComponent, TooltipComponent]);

export default {
  components: {
    Page,
    VChart,
  },
  provide: {
    [THEME_KEY]: 'light',
  },
  data() {
    return {
      lambdaName: `${this.$t('loading')}...`,
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
      requestChartOpts: {
        title: {
          text: this.$t('lambda.perm.chart.execTime'),
          textStyle: {
            color: '#999',
            fontSize: 14,
            fontStyle: 'normal',
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
          formatter: (params) => {
            const { data } = params[0];
            return `${data[0]}: ${data[1]} ms`;
          },
        },
        grid: {
          left: '5%',
          right: '1.5%',
        },
        xAxis: {
          type: 'category',
          data: this.getRequestPermXAxis(),
          axisLabel: {
            color: '#999',
          },
          splitLine: {
            lineStyle: {
              color: '#4e4e4e',
            },
          },
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#999',
            formatter: '{value} ms',
          },
          splitLine: {
            lineStyle: {
              color: '#4e4e4e',
            },
          },
          axisPointer: {
            snap: true,
          },
        },
        series: [
          {
            type: 'line',
            data: [],
            lineStyle: {
              color: '#f16d41',
            },
            itemStyle: {
              color: '#f16d41',
            },
          },
        ],
      },
      requestStatusOpts: {
        series: [
          {
            type: 'gauge',
            detail: {
              color: '#aaa',
              formatter: (value) => {
                return `${value.toFixed(2)}%`;
              },
              fontSize: 22,
            },
            progress: {
              show: true,
              itemStyle: {
                color: '#6FBB49',
              },
            },
            axisLine: {
              lineStyle: {
                color: [[1, '#4e4e4e']],
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 8,
              lineStyle: {
                width: 2,
                color: '#999',
              },
            },
            axisLabel: {
              distance: 14,
              color: '#999',
              fontSize: 14,
            },
            pointer: {
              show: false,
            },
            title: {
              offsetCenter: [0, '18px'],
              color: '#999',
            },
            data: [
              {
                name: this.$t('lambda.perm.chart.reqStatus'),
                value: 0,
              },
            ],
          },
        ],
      },
    };
  },
  computed: {
    lambdaId() {
      if (!Object.keys(this.$route.query).length) {
        return null;
      }
      return this.$route.query.lambdaId || null;
    },
  },
  async created() {
    await this.fetchName();
    await this.refreshCharts();
  },
  watch: {
    lambdaId: {
      handler(newId) {
        if (!newId) {
          return;
        }
        this.fetchName();
        this.refreshCharts();
      },
    },
  },
  methods: {
    async refreshCharts() {
      await this.fetchRequestStatusData();
      await this.fetchRequestPermData();
    },
    getRequestPermXAxis() {
      const arr = [];
      for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j++) {
          let min = `${i}`;
          if (min.length < 2) {
            min = `0${min}`;
          }
          let sec = `${j}`;
          if (sec.length < 2) {
            sec = `0${sec}`;
          }
          arr.push(`${min}:${sec}`);
        }
      }
      return arr;
    },
    async fetchName() {
      if (this.$route.path !== '/app/lambda-perm') {
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
    async fetchRequestPermData() {
      if (this.$route.path !== '/app/lambda-perm') {
        return;
      }
      if (!this.lambdaId) {
        return;
      }
      let res;
      try {
        res = await this.$pApi.get('/faas/perm/requestExecTime', {
          params: {
            lambdaId: this.lambdaId,
            beginTime: moment(this.date)
              .startOf('day')
              .valueOf(),
            endTime: moment(this.date)
              .endOf('day')
              .valueOf(),
          },
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to get request perm data.', err);
        this.$message.error(this.$t('permlog.request.failed'));
      }
      // process data and set data to chart
      const map = {};
      res.data.data.forEach((permLog) => {
        map[
          moment(permLog.point)
            .startOf('minute')
            .format('HH:mm')
        ] = parseFloat(permLog.avgTimeCost.toFixed(2), 10);
      });
      const data = [];
      Object.keys(map).forEach((key) => {
        data.push([key, map[key]]);
      });
      this.requestChartOpts.series[0].data = data;
    },
    async fetchRequestStatusData() {
      if (this.$route.path !== '/app/lambda-perm') {
        return;
      }
      if (!this.lambdaId) {
        return;
      }
      let res;
      try {
        res = await this.$pApi.get('/faas/perm/requestStatus', {
          params: {
            lambdaId: this.lambdaId,
            beginTime: moment(this.date)
              .startOf('day')
              .valueOf(),
            endTime: moment(this.date)
              .endOf('day')
              .valueOf(),
          },
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to get request perm data.', err);
        this.$message.error(this.$t('permlog.request.failed'));
      }
      const chartData = res.data.data[0];
      const rate = chartData.success / (chartData.success + chartData.error) * 100;
      this.requestStatusOpts.series[0].data[0].value = rate;
    },
    handleDateChange() {
      this.requestChartOpts.series[0].data = [];
      this.requestStatusOpts.series[0].data[0].value = 0;
      this.refreshCharts();
    },
  },
};
</script>

<style lang="less">
.permlog {
  padding: 12px 18px 14px 18px;
  &-head {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    user-select: none;
    &__name {
      flex: 1;
      color: var(--primary);
    }
    &__action {
      justify-self: flex-end;
      .el-button {
        margin-left: 12px;
      }
    }
  }
  &-chart {
    &__name {
      color: var(--primary);
      font-size: 14px;
    }
    &__main {
      width: 100%;
      height: 360px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
