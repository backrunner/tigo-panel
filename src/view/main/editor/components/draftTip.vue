<template>
  <span class="draft-tip">
    {{`${$t('editor.draft.save.at')} ${time}`}}
  </span>
</template>

<script>
export default {
  props: {
    time: String,
  },
};
</script>

<style lang="less">
.draft-tip {
  color: #666;
  height: 32px;
  line-height: 32px;
  font-size: 13px;
  margin-right: 8px;
  user-select: none;
}
</style>
