<template>
  <Page class="cfs">
    <Editor type="cfs" />
  </Page>
</template>

<script>
import Page from '../layout/components/page';
import Editor from '../editor/editor';

export default {
  components: {
    Page,
    Editor,
  },
};
</script>

<style lang="less">
.cfs {
  padding: 18px;
  position: relative;
}
</style>
