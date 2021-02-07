<template>
  <div class="editor">
    <div class="editor-list-wrapper">
      <List ref="list" :list="list" :type="type" @new="handleCreateNew" />
    </div>
    <div class="editor-monaco-wrapper">
      <Monaco :item="editItem" :type="type" />
    </div>
    <div class="clearfix"></div>
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
  async created() {
    await this.initList();
  },
  methods: {
    async initList() {
      if (this.type === 'cfs') {
        const res = await this.$nApi.get('/config-storage/list');
        if (!res) {
          this.$message.error(this.$t('editor.list.failed'));
          return;
        }
        this.list = res.data.data;
      }
    },
    setEditItem(item) {
      this.editItem = item;
    },
    handleCreateNew() {
      if (this.type === 'cfs') {
        const timestamp = new Date().valueOf();
        const item = {
          id: `new-${timestamp}`,
          name: `new_config_${timestamp}`,
          type: 'json',
        };
        this.list.push(item);
        this.editItem = item;
        this.$refs.list.setSelected(item.id);
      }
    },
    modifyItemId(oldId, newId) {
      const idx = this.list.findIndex((item) => item.id === oldId);
      if (idx < 0) {
        return;
      }
      this.list[idx].id = newId;
    },
    modifyItemType(id, type) {
      const idx = this.list.findIndex((item) => item.id === id);
      if (idx < 0) {
        return;
      }
      this.list[idx].type = type;
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
  position: relative;
  &-list-wrapper {
    position: relative;
    width: 260px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background: #2e2e2e;
    box-shadow: 2px 0px 0px #252525;
    float: left;
  }
  &-monaco-wrapper {
    width: calc(100% - 260px);
    height: 100%;
    position: relative;
    float: right;
  }
}
</style>
