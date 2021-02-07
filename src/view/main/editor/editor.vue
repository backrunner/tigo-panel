<template>
  <div class="editor">
    <div class="editor-list-wrapper" v-context="'listContextMenu'">
      <List ref="list" :list="list" :type="type" @new="handleCreateNew" />
    </div>
    <div class="editor-monaco-wrapper">
      <Monaco ref="monaco" :item="editItem" :type="type" />
    </div>
    <div class="clearfix"></div>
    <ContextMenu ref="listContextMenu" @item-clicked="handleListContextClick">
      <ContextMenuItem name="refresh">刷新列表</ContextMenuItem>
    </ContextMenu>
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
      // sync modification
      if (this.$refs.list.selected === oldId) {
        this.$refs.list.setSelected(newId);
      }
    },
    modifyItemType(id, type) {
      const idx = this.list.findIndex((item) => item.id === id);
      if (idx < 0) {
        return;
      }
      this.list[idx].type = type;
    },
    async deleteItem(item) {
      if (!`${item.id}`.startsWith('new')) {
        if (this.type === 'cfs') {
          const res = await this.$nApi.post('/config-storage/delete', {
            id: item.id,
          });
          if (!res) {
            return;
          }
        }
      }
      const idx = this.list.findIndex((t) => t.id === item.id);
      if (idx >= 0) {
        this.list.splice(idx, 1);
      }
      if (this.editItem.id === item.id) {
        this.editItem = null;
      }
      this.$message.success('删除成功');
    },
    handleListContextClick(name) {
      if (name === 'refresh') {
        if (this.type === 'cfs') {
          this.initList();
          const { selected } = this.$refs.list;
          let found = false;
          if (selected) {
            for (let i = 0; i < this.list.length; i++) {
              if (this.list[i].id === selected) {
                found = true;
                break;
              }
            }
          }
          if (!found) {
            this.editItem = null;
            this.$refs.list.setSelected(null);
          }
        }
      }
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
