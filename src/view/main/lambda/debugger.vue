<template>
  <Page class="debugger-wrapper">
    <div class="page-main debugger">
      <History />
      <div class="debugger-main">
        <Sender />
        <Response />
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

export default {
  components: {
    Page,
    History,
    Sender,
    Response,
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
