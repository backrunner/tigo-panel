<template>
  <div class="entry-container">
    <transition mode="out-in" name="fade" :appear="show">
      <div class="entry service-check" v-show="show">
        <span>{{$t('entry.check.checking')}}</span>
        <span>{{symbol}}</span>
        <i class="el-icon-loading"></i>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      symbol: '.',
      show: true,
    };
  },
  created() {
    if (this.$route.query.to?.includes('/app') || this.$route.query.to?.includes('/portal')) {
      this.show = false;
      this.showDelay = setTimeout(() => {
        this.show = true;
      }, 500);
    }
  },
  beforeDestroy() {
    if (this.showDelay) {
      clearTimeout(this.showDelay);
      this.showDelay = null;
    }
  },
  async mounted() {
    this.interval = setInterval(() => {
      if (this.symbol.length > 5) {
        this.symbol = '.';
      } else {
        this.symbol += '.';
      }
    }, 500);
    await this.checkAvailable();
  },
  destroyed() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },
  methods: {
    ...mapMutations('service', ['setServiceStatus']),
    async checkAvailable() {
      const res = await this.$tApi.get('/common/checkAvailable');
      if (!res) {
        this.$router.push('/notAvailable');
        return;
      }
      this.setServiceStatus(true);
      if (this.$route.query.to) {
        this.$router.replace(this.$route.query.to).catch(() => {
          // eslint-disable-next-line no-console
          console.warn(`Cannot get into path ${this.$route.query.to}`);
        });
      } else {
        this.$router.replace('/portal');
      }
    },
  },
};
</script>

<style lang="less">
.service-check {
  margin-bottom: 64px;
  user-select: none;
  color: var(--primary);
  display: flex;
  align-items: center;
  font-size: 26px;
  span {
    letter-spacing: 0.05em;
  }
  i {
    margin-left: 24px;
    margin-top: 4px;
  }
}
</style>
