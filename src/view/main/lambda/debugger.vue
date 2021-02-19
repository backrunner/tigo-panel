<template>
  <Page class="debugger-wrapper">
    <div class="page-main debugger">
      <History ref="history" :history="history" @select="historySelected" />
      <div class="debugger-main">
        <Sender ref="sender" @sent="handleSent" />
        <Response ref="response" />
      </div>
      <div class="clearfix"></div>
    </div>
  </Page>
</template>

<script>
import Page from '../layout/components/page';
import History from './components/history';
import Sender from './components/sender';
import Response from './components/response';
import { mapMutations, mapState } from 'vuex';

export default {
  components: {
    Page,
    History,
    Sender,
    Response,
  },
  computed: {
    ...mapState({
      uid: (state) => state.auth.uid,
      history: (state) => state.debug.history,
    }),
  },
  mounted() {
    this.initList();
  },
  watch: {
    uid(newValue) {
      if (newValue) {
        this.initList();
      }
    },
  },
  methods: {
    ...mapMutations('debug', ['addHistory', 'setHistory']),
    async initList() {
      if (!this.uid) {
        return;
      }
      try {
        const history = await this.$idb.get(`debug-history-${this.uid}`);
        if (history) {
          this.setHistory(history);
        }
      } catch (err) {
        // do nothing
      }
    },
    handleSent(request) {
      this.$refs.response.setResponse(request.res);
      const rt = new Date().valueOf();
      this.addHistory({
        ...request,
        rt,
      });
      this.$refs.history.setSelected(rt);
      this.$idb.put(`debug-history-${this.uid}`, this.history);
    },
    historySelected(data) {
      this.$refs.sender.setRequest(data.req);
      this.$refs.response.setResponse(data.res);
    },
  },
};
</script>

<style lang="less">
.debugger-wrapper {
  .debugger {
    .debugger-history {
      float: left;
      width: 300px;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      background: #2e2e2e;
      box-shadow: 2px 0px 0px #252525;
      position: relative;
      .n-scroll::-webkit-scrollbar-track {
        background-color: #2e2e2e;
      }
      .n-scroll::-webkit-scrollbar-corner {
        background-color: #2e2e2e;
      }
    }
    .debugger-main {
      width: calc(100% - 300px);
      height: 100%;
      max-height: 100%;
      float: right;
      padding: 16px;
      flex: 1;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
