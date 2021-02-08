<template>
  <div class="main">
    <div class="main-nav">
      <div class="nav-tabs nav-tabs-sys">
        <Tab tabId="home" type="home" path="" />
      </div>
      <div class="nav-tabs nav-tabs-user">
        <Tab
          v-for="tab in tabs"
          :key="tab.id"
          :tabId="tab.id"
          :name="tab.name"
          :path="tab.path"
          type="default"
        />
      </div>
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
import Tab from './components/tab';
import ServerStatus from './components/serverStatus';
import NavUser from './components/userInfo';
import { checkAuthStatus } from '@/utils/auth';

export default {
  components: {
    Tab,
    NavUser,
    ServerStatus,
  },
  computed: {
    ...mapState({
      tabs: (state) => state.nav.tabs,
      uid: (state) => state.auth.uid,
      username: (state) => state.auth.username,
    }),
  },
  async created() {
    // user info not exists
    if (!this.uid || !this.username) {
      const res = await checkAuthStatus();
      if (!res) {
        this.clearAuthInfo();
        this.$router.replace('/portal');
      }
    }
    // init nav
    const storedNav = window.localStorage.getItem('nav');
    if (storedNav) {
      if (storedNav.uid === this.uid) {
        this.recover(storedNav.tabs);
      } else {
        window.localStorage.removeItem('nav');
      }
    }
    const path = this.$route.path.replace('/app', '');
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
  },
  mounted() {
    if (!this.heartbeatInterval) {
      this.heartbeatInterval = setInterval(async () => {
        const res = await this.$tApi.get('/common/heartbeat');
        if (!res) {
          this.setHeartbeat(false);
        } else {
          this.setHeartbeat(true);
        }
      }, 60 * 1000);
    }
  },
  methods: {
    ...mapMutations('service', ['setHeartbeat']),
    ...mapMutations('auth', ['clearAuthInfo']),
    ...mapMutations('nav', ['setActivateTab', 'recover']),
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
