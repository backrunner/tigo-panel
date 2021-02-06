<template>
  <div class="page cfs">
    <Editor type="cfs" />
  </div>
</template>

<script>
import Editor from '../editor/editor';

export default {
  components: {
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
