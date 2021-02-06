<template>
  <Page class="lambda">
    <Editor type="lambda" />
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
.lambda {
  padding: 18px;
  position: relative;
}
</style>
