<template>
  <div class="editor">
    <div class="editor-list-wrapper">
      <List :list="list" :type="type" />
    </div>
    <div class="editor-monaco-wrapper">
      <Monaco :item="editItem" :type="type" />
    </div>
  </div>
</template>

<script>
import List from './components/list';
import Monaco from './components/monaco';

export default {
  props: {
    type: String,
  },
  components: {
    List,
    Monaco,
  },
  data() {
    return {
      list: [],
      editItem: null,
    };
  },
  methods: {
    setEditItem(item) {
      this.editItem = item;
    },
  },
};
</script>

<style lang="less">
.editor {
  width: 100%;
  height: 100%;
  background: #282828;
  box-shadow: 8px 8px 0px rgba(255, 255, 255, 0.025);
  display: flex;
  &-list-wrapper {
    position: relative;
    width: 280px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background: #2e2e2e;
    box-shadow: 2px 0px 0px #252525;
  }
  &-monaco-wrapper {
    width: 100%;
    height: 100%;
  }
}
</style>
