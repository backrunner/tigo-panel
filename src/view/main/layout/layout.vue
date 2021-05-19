<template>
  <div class="main">
    <div class="main-nav">
      <div class="nav-tabs nav-tabs-sys">
        <Tab :tab="homeTab" type="home" />
      </div>
      <draggable class="nav-tabs nav-tabs-user" v-model="sortableTabs">
        <Tab v-for="tab in sortableTabs" :key="tab.id" :tab="tab" type="default" />
      </draggable>
      <NavUser />
      <ServerStatus />
    </div>
    <div class="main-container">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import draggable from 'vuedraggable';
import Tab from './components/tab';
import ServerStatus from './components/serverStatus';
import NavUser from './components/userInfo';
import { checkAuthStatus } from '@/utils/auth';
import ServiceMap from '@/common/constants/serviceMap';
import PathNameMap from '@/common/constants/pathNameMap';

export default {
  components: {
    Tab,
    NavUser,
    ServerStatus,
    draggable,
  },
  data() {
    return {
      homeTab: {
        id: 'home',
        path: '',
      },
    };
  },
  computed: {
    ...mapState({
      tabs: (state) => state.nav.tabs,
      uid: (state) => state.auth.uid,
      username: (state) => state.auth.username,
    }),
    sortableTabs: {
      get() {
        return this.tabs;
      },
      set(value) {
        this.setTabs(value);
        window.localStorage.setItem('nav', {
          uid: this.uid,
          tabs: this.tabs,
        });
      },
    },
  },
  async created() {
    // user info not exists
    if (!this.uid || !this.username) {
      const res = await checkAuthStatus();
      if (!res) {
        this.clearUserInfo();
        this.$router.replace('/portal');
      }
    }
    // init nav
    const storedNav = window.localStorage.getItem('nav');
    const path = this.$route.path.replace('/app', '');
    if (storedNav) {
      if (storedNav.uid === this.uid) {
        let found = false;
        storedNav.tabs.forEach((tab) => {
          if (tab.path === path) {
            found = true;
          }
        });
        if (!found) {
          const name = PathNameMap[path];
          if (name) {
            this.openTab({
              uid: this.uid,
              path,
              name,
            });
          }
        }
        this.setTabs(storedNav.tabs);
      } else {
        window.localStorage.removeItem('nav');
      }
    } else {
      const name = PathNameMap[path];
      if (path && name) {
        this.openTab({
          uid: this.uid,
          path,
          name,
        });
      }
    }
    if (path === '' || path === '/') {
      this.setActivateTab('home');
    } else {
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].path === path) {
          this.setActivateTab(this.tabs[i].id);
          break;
        }
      }
    }
    // init pluginInfo
    await this.getPluginInfo();
  },
  mounted() {
    if (!this.heartbeatInterval) {
      this.sendHeartBeat();
      this.heartbeatInterval = setInterval(async () => {
        this.sendHeartBeat();
      }, 60 * 1000);
    }
  },
  methods: {
    ...mapMutations('service', ['setHeartbeat', 'setPluginInfo']),
    ...mapMutations('auth', ['clearUserInfo']),
    ...mapMutations('nav', ['openTab', 'setActivateTab', 'setTabs']),
    async sendHeartBeat() {
      try {
        await this.$ptApi.get('/common/heartbeat');
        this.setHeartbeat(true);
      } catch (err) {
        this.setHeartbeat(false);
      }
    },
    async getPluginInfo() {
      const res = await this.$nApi.get('/common/listPlugins');
      if (!res) {
        return;
      }
      let pluginInfo = res.data.data?.packages;
      if (!pluginInfo) {
        this.$message.error(this.$t('home.pluginInfo.error'));
      }
      pluginInfo = pluginInfo.map((item) => ({
        ...ServiceMap[item],
        package: item,
      }));
      this.setPluginInfo(pluginInfo);
    },
  },
};
</script>

<style lang="less">
.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  &-nav {
    width: 100%;
    height: 40px;
    display: flex;
    border-bottom: 3px solid #2e2e2e;
    .nav-tabs {
      height: 40px;
    }
    .nav-tabs-sys {
      width: max-content;
      justify-self: flex-start;
    }
    .nav-tabs-user {
      display: flex;
    }
    .nav-tabs-user {
      flex-grow: 1;
    }
  }
  &-container {
    width: 100%;
    height: calc(100% - 43px);
    max-height: calc(100% - 43px);
    position: relative;
    flex: 1;
    .page {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }
  }
}
</style>
