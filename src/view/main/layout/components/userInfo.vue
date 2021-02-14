<template>
  <el-dropdown class="nav-user" @command="handleCommand" trigger="click">
    <span>{{ username }}</span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="logout">{{ $t('nav.user.logout') }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      username: (state) => state.auth.username,
    }),
  },
  methods: {
    ...mapMutations('auth', ['clearUserInfo']),
    handleCommand(command) {
      if (command === 'logout') {
        this.clearUserInfo();
        this.$router.replace('/portal');
        this.$message.success(this.$t('nav.logout.success'));
      }
    },
  },
};
</script>

<style lang="less">
.nav-user {
  width: max-content;
  justify-self: flex-end;
  padding: 0 20px;
  border-left: 1px solid #2e2e2e;
  line-height: 40px;
  user-select: none;
  span {
    font-size: 12px;
  }
}
</style>
