<template>
  <el-col :span="6">
    <div class="service-item" @click="handleClick">
      <span>{{ displayName }}</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </el-col>
</template>

<script>
import { mapMutations, mapState } from 'vuex';

export default {
  props: {
    name: String,
    path: String,
  },
  computed: {
    ...mapState({
      uid: (state) => state.auth.uid,
      heartbeatStatus: (state) => state.service.heartbeat,
    }),
    displayName() {
      return this.$t(this.name);
    },
  },
  methods: {
    ...mapMutations('nav', ['openTab']),
    handleClick() {
      if (!this.heartbeatStatus) {
        this.$message.error(this.$t('server.connectionLost'));
        return;
      }
      this.openTab({
        uid: this.uid,
        name: this.name,
        path: this.path,
      });
      this.$router.replace(`/app${this.path}`);
    },
  },
};
</script>

<style lang="less">
.service-item {
  background: #323232;
  color: var(--primary);
  padding: 12px 16px;
  font-size: 14px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  transition: 200ms ease;
  user-select: none;
  span {
    flex: 1;
  }
  i {
    width: max-content;
    justify-self: flex-end;
  }
}
.service-item:hover {
  cursor: pointer;
  background: #3e3e3e;
  box-shadow: 4px 4px 0px rgba(255, 255, 255, 0.0375);
}
</style>
