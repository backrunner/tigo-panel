<template>
  <div class="page-main editor" v-loading="dataLoading">
    <div class="editor-list-wrapper" v-context="'listContextMenu'">
      <List ref="list" :list="list" :type="type" @new="handleCreateNew" />
    </div>
    <div class="editor-monaco-wrapper">
      <Monaco ref="monaco" :item="editItem" :type="type" />
    </div>
    <div class="clearfix"></div>
    <LambdaEnv ref="lambdaEnv" :lambdaId="itemId" v-if="renderLambdaComps" />
    <LambdaPolicy ref="lambdaPolicy" :lambdaId="itemId" v-if="renderLambdaComps" />
    <LambdaImExport ref="lambdaImExport" :lambdaId="itemId" v-if="renderLambdaComps" />
    <ContextMenu ref="listContextMenu" @item-clicked="handleListContextClick">
      <ContextMenuItem name="refresh">{{ $t('refresh') }}</ContextMenuItem>
    </ContextMenu>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import List from './components/list';
import Monaco from './components/monaco';
import LambdaEnv from './components/lambdaEnv';
import LambdaPolicy from './components/lambdaPolicy';
import LambdaImExport from './components/lambdaImExport';
import apiBaseMap from './constants/apiBaseMap.js';

export default {
  props: {
    type: String,
  },
  components: {
    List,
    Monaco,
    LambdaEnv,
    LambdaPolicy,
    LambdaImExport,
  },
  computed: {
    renderLambdaComps() {
      return this.type === 'lambda';
    },
    itemId() {
      return this.editItem?.id;
    },
  },
  data() {
    return {
      list: [],
      editItem: null,
      dataLoading: false,
    };
  },
  created() {
    this.$bus.$on('open-lambda-env', this.openLambdaEnv);
    this.$bus.$on('open-lambda-policy', this.openLambdaPolicy);
    this.$bus.$on('open-lambda-imexport', this.openLambdaImExport);
  },
  beforeDestroy() {
    this.$bus.$off('open-lambda-env', this.openLambdaEnv);
    this.$bus.$off('open-lambda-policy', this.openLambdaPolicy);
    this.$bus.$off('open-lambda-imexport', this.openLambdaImExport);
  },
  async mounted() {
    await this.initList();
    // init selected item
    if (this.$route.query.id) {
      const { id } = this.$route.query;
      const idx = this.list.findIndex((item) => `${item.id}` === id);
      if (idx >= 0) {
        this.editItem = this.list[idx];
        const parsedId = /^\d+$/.test(id) ? parseInt(id, 10) : id;
        this.$refs.list.setSelected(parsedId);
        this.setTabQuery({
          path: this.$route.path,
          query: this.$route.query,
        });
      }
    }
  },
  methods: {
    ...mapMutations('nav', ['setTabQuery']),
    async initList() {
      this.dataLoading = true;
      const res = await this.$nApi.get(`/${apiBaseMap[this.type]}/list`);
      if (!res) {
        this.$message.error(this.$t('editor.list.failed'));
        this.dataLoading = false;
        return;
      }
      this.list = res.data.data || [];
      this.dataLoading = false;
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
    // lambda comps
    openLambdaEnv(id) {
      if (id !== this.itemId) {
        return;
      }
      this.$refs.lambdaEnv.open();
    },
    openLambdaPolicy(id) {
      if (id !== this.itemId) {
        return;
      }
      this.$refs.lambdaPolicy.open();
    },
    openLambdaImExport(id) {
      if (id !== this.itemId) {
        return;
      }
      this.$refs.lambdaImExport.open();
    },
    // get new lambda cache
    getNewLambdaCache(lambdaId) {
      const cachedEnv = this.$refs.lambdaEnv.getFromCache(lambdaId);
      const cachedPolicy = this.$refs.lambdaPolicy.getFromCache(lambdaId);
      return {
        env: cachedEnv || {},
        policy: cachedPolicy || {},
      };
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
    .n-scroll::-webkit-scrollbar-track {
      background-color: #2e2e2e;
    }
    .n-scroll::-webkit-scrollbar-corner {
      background-color: #2e2e2e;
    }
  }
  &-monaco-wrapper {
    width: calc(100% - 260px);
    height: 100%;
    position: relative;
    float: right;
  }
}
</style>
