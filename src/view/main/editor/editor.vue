<template>
  <div class="page-main editor">
    <div class="editor-list-wrapper" v-context="'listContextMenu'">
      <List ref="list" :list="list" :type="type" @new="handleCreateNew" />
    </div>
    <div class="editor-monaco-wrapper">
      <Monaco ref="monaco" :item="editItem" :type="type" />
    </div>
    <div class="clearfix"></div>
    <ScriptEnv ref="scriptEnv" :scriptId="scriptEnvItemId" v-if="renderScriptEnv" />
    <ContextMenu ref="listContextMenu" @item-clicked="handleListContextClick">
      <ContextMenuItem name="refresh">刷新列表</ContextMenuItem>
    </ContextMenu>
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import List from './components/list';
import Monaco from './components/monaco';
import ScriptEnv from './components/scriptEnv';
import apiBaseMap from './constants/ApiBaseMap.js';

export default {
  props: {
    type: String,
  },
  components: {
    List,
    Monaco,
    ScriptEnv,
  },
  computed: {
    ...mapState({
      userId: (state) => state.auth.uid,
    }),
    renderScriptEnv() {
      return this.type === 'lambda';
    },
    scriptEnvItemId() {
      return this.editItem?.id;
    },
  },
  data() {
    return {
      list: [],
      editItem: null,
    };
  },
  async mounted() {
    await this.initList();
    // init selected item
    if (this.$route.query.id) {
      const { id } = this.$route.query;
      const idx = this.list.findIndex((item) => `${item.id}` === id);
      if (idx >= 0) {
        this.editItem = this.list[idx];
        this.$refs.list.setSelected(parseInt(id, 10));
        this.setTabQuery({
          path: this.$route.path,
          query: this.$route.query,
        });
      }
    }
  },
  methods: {
    ...mapMutations('nav', ['openTab', 'setTabQuery']),
    async initList() {
      const res = await this.$nApi.get(`/${apiBaseMap[this.type]}/list`);
      if (!res) {
        this.$message.error(this.$t('editor.list.failed'));
        return;
      }
      this.list = res.data.data || [];
    },
    setEditItem(item) {
      this.editItem = item;
    },
    handleCreateNew() {
      const timestamp = new Date().valueOf();
      let item = {
        id: `new-${timestamp}`,
      };
      if (this.type === 'cfs') {
        item = {
          ...item,
          name: `new_config_${timestamp}`,
          type: 'json',
        };
      } else if (this.type === 'lambda') {
        item = {
          ...item,
          name: `new_lambda_${timestamp}`,
        };
      }
      this.list.push(item);
      this.editItem = item;
      this.$refs.list.setSelected(item.id);
    },
    modifyItemId(oldId, newId) {
      const idx = this.list.findIndex((item) => item.id === oldId);
      if (idx < 0) {
        return;
      }
      this.$set(this.list[idx], 'id', newId);
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
      this.$set(this.list[idx], 'type', type);
    },
    modifyItemName(id, newName) {
      const idx = this.list.findIndex((item) => item.id === id);
      if (idx < 0) {
        return;
      }
      this.$set(this.list[idx], 'name', newName);
    },
    async deleteItem(item) {
      if (!`${item.id}`.startsWith('new')) {
        const res = await this.$nApi.post(`/${apiBaseMap[this.type]}/delete`, {
          id: item.id,
        });
        if (!res) {
          return;
        }
      }
      const idx = this.list.findIndex((t) => t.id === item.id);
      if (idx >= 0) {
        this.list.splice(idx, 1);
      }
      if (this.editItem.id === item.id) {
        this.editItem = null;
      }
      if (!this.list.length) {
        this.router.replace({
          query: null,
        });
        this.setTabQuery({
          path: this.$route.path,
          query: null,
        });
      }
      this.$message.success('删除成功');
    },
    async handleListContextClick(name) {
      if (name === 'refresh') {
        await this.initList();
        this.$message.success('刷新成功');
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
    },
    // script env
    openScriptEnv() {
      this.$refs.scriptEnv.open();
    },
    openDebug() {
      this.openTab({
        uid: this.userId,
        name: this.$t('debugger'),
        path: '/lambda-debugger',
      });
      this.$router.replace({
        path: '/app/lambda-debugger',
        query: {
          scriptName: this.editItem.name,
        },
      });
    },
  },
};
</script>

<style lang="less">
.editor {
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
