<template>
  <div class="entry-container">
    <div class="entry service-check">
      <span>{{$t('entry.check.checking')}}</span>
      <span>{{symbol}}</span>
      <i class="el-icon-loading"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      symbol: '.',
    };
  },
  mounted() {
    this.interval = setInterval(() => {
      if (this.symbol.length > 5) {
        this.symbol = '.';
      } else {
        this.symbol += '.';
      }
    }, 500);
    this.checkAvaliable();
  },
  methods: {
    async checkAvaliable() {
      const res = await this.$tApi.get('/common/ping');
      if (!res) {
        this.$router.push('/notAvaliable');
        return;
      }
      this.$router.push('/portal');
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
