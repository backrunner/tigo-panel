<template>
  <div class="server-status server-status__offline" v-if="show">
    <i></i><span>{{$t('server.offline')}}</span>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      alreadyLost: false,
    };
  },
  watch: {
    heartbeat(newVal) {
      if (!newVal) {
        this.$message.error(this.$t('server.offline.tip'));
        this.alreadyLost = true;
      } else {
        // eslint-disable-next-line no-lonely-if
        if (this.alreadyLost) {
          this.alreadyLost = false;
          this.$message.success(this.$t('server.reconnect.tip'));
        }
      }
    },
  },
  computed: {
    ...mapState('service', ['heartbeat']),
    show() {
      return !this.heartbeat;
    },
  },
};
</script>

<style lang="less">
.server-status {
  height: 40px;
  line-height: 40px;
  padding-right: 20px;
  font-size: 12px;
  user-select: none;
  &__offline {
    color: #EB5F5F;
    i {
      width: 6px;
      height: 6px;
      line-height: 40px;
      border-radius: 4px;
      display: inline-block;
      background-color: #EB5F5F;
      margin-right: 6px;
      transform: translateY(-1px);
    }
  }
}
</style>
