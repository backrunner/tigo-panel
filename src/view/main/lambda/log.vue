<template>
  <Page class="lambdalog-wrapper">
    <div class="page-main lambdalog">
      <LogList />
    </div>
  </Page>
</template>

<script>
import Page from '../layout/components/page.vue';
import LogList from './components/logList.vue';

export default {
  components: {
    LogList,
    Page,
  },
};
</script>

<style lang="less">
.lambdalog {
  padding: 12px 14px;
}
</style>
