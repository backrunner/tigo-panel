<template>
  <div class="page home">
    <div class="home-welcome">
      <span>{{ hello }}</span>
    </div>
    <div class="home-main">
      <Card class="home-services" :title="$t('home.services')">
        <el-row :gutter="20">
          <ServiceItem
            v-for="service in pluginInfo"
            :key="service.name"
            :name="service.name"
            :path="service.path"
            />
        </el-row>
      </Card>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState } from 'vuex';
import serviceMap from './constants/serviceMap';
import Card from './components/card';
import ServiceItem from './components/service';

export default {
  components: {
    Card,
    ServiceItem,
  },
  data() {
    return {
      pluginInfo: [],
    };
  },
  async created() {
    await this.getPluginInfo();
  },
  computed: {
    ...mapState({
      username: (state) => state.auth.username,
      locale: (state) => state.locale.locale,
    }),
    hello() {
      const h = moment().hour;
      if (this.locale === 'cn') {
        if (h >= 0 && h < 4) {
          return `欢迎您使用 tigo，${this.username}。夜深了，我们建议您早些休息。`;
        } else if (h >= 6 && h < 11) {
          return `上午好，${this.username}。`;
        } else if (h >= 11 && h < 15) {
          return `中午好，${this.username}。`;
        } else if (h >= 16 && h < 18) {
          return `下午好，${this.useranme}。`;
        } else if (h >= 19 && h < 22) {
          return `晚上好，${this.username}。`;
        } else {
          return `欢迎您使用 tigo, ${this.username}。`;
        }
      } else {
        return `Welcome, ${this.username}.`;
      }
    },
  },
  methods: {
    async getPluginInfo() {
      const res = await this.$nApi.get('/common/listPlugins');
      this.pluginInfo = res.data.data?.packages.map((item) => serviceMap[item]);
    },
  },
};
</script>

<style lang="less">
.home {
  padding: 32px;
  &-welcome {
    font-size: 13px;
    color: var(--primary);
    letter-spacing: 0.1em;
    margin-bottom: 28px;
    user-select: none;
  }
}
</style>
