<template>
  <div class="monaco" v-if="item">
    <div class="monaco-header">
      <HeaderName
        ref="headerName"
        :lambdaId="item.id"
        :editorType="type"
        :name="displayName"
        @edit="handleNameEdit"
      />
      <div class="monaco-header__ctrl">
        <DraftTip :time="displayDraftSaveTime" v-if="!!displayDraftSaveTime" />
        <TypeSelector
          v-model="fileType"
          v-if="type === 'cfs'"
          @change="handleTypeChanged"
          :id="item.id"
          :isNew="isNew"
        />
        <span class="monaco-ctrl monaco-ctrl__btn">
          <el-button
            type="primary"
            size="small"
            :disabled="saveButtonStatus"
            @loading="saveButtonLoading"
            @click="save"
          >
            {{ $t('save') }}
          </el-button>
        </span>
      </div>
    </div>
    <div class="monaco-body">
      <MonacoEditor
        class="monaco-body-editor"
        v-model="content"
        :language="editorLanguage"
        v-loading="editorLoading"
        @change="handleEditorChange"
      />
      <div class="monaco-body-failed" v-if="showFailed">
        <div class="monaco-body-failed__icon">
          <i class="el-icon-close"></i>
        </div>
        <div class="monaco-body-failed__text">
          <span>{{ $t('editor.failed.text') }}</span>
        </div>
        <div class="monaco-body-failed__btn">
          <el-button type="primary" @click="reload">{{ $t('editor.failed.retry') }}</el-button>
        </div>
      </div>
    </div>
  </div>
  <div class="monaco-empty" v-else>
    <div class="monaco-empty-icon">
      <tigoGear />
    </div>
  </div>
</template>

<script>
import { Utf8 } from 'crypto-es/lib/core';
import { Base64 } from 'crypto-es/lib/enc-base64';
import moment from 'moment';
import { mapMutations, mapState } from 'vuex';
import tigoGear from '@/common/icon/tigoGear';
import MonacoEditor from './monacoEditor';
import TypeSelector from './typeSelector';
import HeaderName from './headerName';
import DraftTip from './draftTip';
import apiBaseMap from '../constants/apiBaseMap';
import { getTabPath } from '@/utils/path';

const DRAFT_SAVE_TIMEOUT = 500;
const DRAFT_ENABLED_TYPE = ['cfs', 'lambda'];
const API_TARGET = {
  lambda: 'faas',
  cfs: 'cfs',
};

export default {
  components: {
    tigoGear,
    MonacoEditor,
    TypeSelector,
    DraftTip,
    HeaderName,
  },
  props: {
    item: Object,
    type: String,
  },
  watch: {
    item: {
      deep: true,
      immediate: true,
      handler(newItem) {
        if (!newItem) {
          this.content = '';
          return;
        }
        this.fileType = newItem.type;
        if (this.drafts[newItem.id]) {
          this.content = this.drafts[newItem.id];
          return;
        }
        if (!`${newItem.id}`.startsWith('new')) {
          this.getContent(newItem.id);
          this.content = '';
          // set query
          if (this.$route.query?.id !== `${newItem.id}`) {
            this.$router.replace({
              query: {
                id: newItem.id,
              },
            });
            this.setTabQuery({
              path: this.$route.path,
              query: this.$route.query,
            });
          }
        } else {
          this.content = '';
          this.$router.replace({
            query: null,
          });
          this.setTabQuery({
            path: this.$route.path,
            query: null,
          });
        }
      },
    },
  },
  computed: {
    ...mapState({
      userId: (state) => state.auth.uid,
      userScopeId: (state) => state.auth.scopeId,
    }),
    isNew() {
      return `${this.item.id}`.startsWith('new');
    },
    displayName() {
      if (this.type === 'cfs') {
        return `${this.item.name}.${this.item.type}`;
      }
      return this.item.name;
    },
    displayDraftSaveTime() {
      return this.draftSaveTime[this.item.id] || null;
    },
    draftEnabled() {
      return DRAFT_ENABLED_TYPE.includes(this.type);
    },
    saveButtonLoading() {
      return !!this.saving[this.item.id];
    },
    saveButtonStatus() {
      return !!this.saveDisabled[this.item.id];
    },
    editorLanguage() {
      if (this.type === 'cfs') {
        return this.item.type;
      } else if (this.type === 'lambda') {
        return 'javascript';
      }
      return 'javascript';
    },
    editorLoading() {
      return !!this.contentLoading[this.item.id];
    },
    showFailed() {
      return this.contentLoadFailed[this.item.id] === true;
    },
  },
  data() {
    return {
      content: '',
      fileType: '',
      saving: {},
      saveDisabled: {},
      contentLoading: {},
      contentLoadFailed: {},
      drafts: {},
      draftSaveTime: {},
      draftSaveTimeout: {},
    };
  },
  created() {
    this.$bus.$on('open-lambda-log', this.openLambdaLog);
  },
  beforeDestroy() {
    this.$bus.$off('open-lambda-log', this.openLambdaLog);
  },
  methods: {
    ...mapMutations('nav', ['openTab', 'setCannotClose', 'setTabQuery']),
    validateContent() {
      if (!this.content.trim()) {
        this.$message.error(this.$t('editor.save.emptyContent'));
        return false;
      }
      return true;
    },
    async save() {
      this.$set(this.saving, this.item.id, true);
      if (!this.validateContent()) {
        return;
      }
      const action = `${this.item.id}`.startsWith('new') ? 'add' : 'edit';
      // build request params
      const params = {
        action,
        content: Base64.stringify(Utf8.parse(this.content)),
        name: this.item.name,
      };
      if (this.type === 'cfs') {
        Object.assign(params, {
          type: this.item.type,
        });
      }
      if (action === 'edit') {
        Object.assign(params, {
          id: this.item.id,
        });
      }
      if (this.type === 'lambda' && action === 'add') {
        // assign policy and env
        const cached = this.$parent.getNewLambdaCache(this.item.id);
        Object.assign(params, cached);
      }
      // send save request
      const res = await this.$nApi.post(`/${API_TARGET[this.type]}/save`, params);
      this.$set(this.saving, this.item.id, false);
      if (!res) {
        return;
      }
      this.clearDraftTimeout(this.item.id);
      if (action === 'add') {
        const { id } = res.data.data;
        this.$parent.modifyItemId(this.item.id, id);
      }
      this.$message.success(this.$t('edtior.save.success'));
      if (this.drafts[this.item.id]) {
        delete this.drafts[this.item.id];
        if (!Object.keys(this.drafts).length) {
          this.setCannotClose({
            path: getTabPath(this.$route.path),
            status: null,
          });
        }
        this.$set(this.draftSaveTime, this.item.id, null);
      }
    },
    reload() {
      this.getContent(this.item.id);
    },
    async getContent(id) {
      this.$set(this.contentLoading, id, true);
      this.$set(this.saveDisabled, id, true);
      const res = await this.$nApi.get(`/${apiBaseMap[this.type]}/getContent`, {
        params: {
          id,
        },
      });
      if (!res) {
        this.$set(this.contentLoading, id, false);
        this.$set(this.contentLoadFailed, id, true);
        return;
      }
      let { content } = res.data.data;
      content = Utf8.stringify(Base64.parse(content));
      this.content = content;
      this.$set(this.saveDisabled, id, false);
      this.$set(this.contentLoading, id, false);
      this.$set(this.contentLoadFailed, id, false);
    },
    handleTypeChanged(type) {
      this.$parent.modifyItemType(this.item.id, type);
    },
    saveDraft(value) {
      if (!this.drafts[this.item.id] || this.drafts[this.item.id] !== value) {
        this.setCannotClose({
          path: getTabPath(this.$route.path),
          status: { msg: this.$t('editor.closeTip.haveDraft') },
        });
        this.drafts[this.item.id] = value;
      }
      this.$set(this.draftSaveTime, this.item.id, moment().format('HH:mm:ss'));
    },
    handleEditorChange(value) {
      if (this.draftEnabled) {
        if (this.draftSaveTimeout[this.item.id]) {
          clearTimeout(this.draftSaveTimeout[this.item.id]);
        }
        if (
          this.lastSaveDraftCall &&
          new Date().valueOf() - this.lastSaveDraftCall >= DRAFT_SAVE_TIMEOUT
        ) {
          // run immediately
          this.lastSaveDraftCall = null;
          this.saveDraft(value);
          return;
        }
        this.lastSaveDraftCall = new Date().valueOf();
        this.draftSaveTimeout[this.item.id] = setTimeout(() => {
          this.lastSaveDraftCall = null;
          this.saveDraft(value);
        }, DRAFT_SAVE_TIMEOUT);
      }
    },
    async handleNameEdit(newName) {
      if (`${this.item.id}`.startsWith('new')) {
        // new item, modify directly
        this.$parent.modifyItemName(this.item.id, newName);
        this.$refs.headerName.setEditable(false);
        return;
      }
      try {
        await this.$confirm(`${this.$t('editor.confirm.editName')}`, this.$t('confirm'));
      } catch {
        return;
      }
      const res = await this.$nApi.post(`${apiBaseMap[this.type]}/rename`, {
        id: this.item.id,
        newName,
      });
      if (!res) {
        this.$refs.headerName.setEditable(false);
        return;
      }
      this.$parent.modifyItemName(this.item.id, newName);
      this.$message.success(this.$t('editor.name.edit.success'));
      this.$refs.headerName.setEditable(false);
    },
    clearDraftTimeout(id) {
      clearTimeout(this.draftSaveTimeout[id]);
      this.draftSaveTimeout[id] = null;
    },
    copyUrl() {
      const basePath = `http${this.$apiConfig.https ? 's' : ''}://${this.$apiConfig.host}`;
      try {
        const scope = this.type === 'cfs' ? 'config' : 'lambda';
        const type = this.type === 'cfs' ? `.${this.item.type}` : '';
        const path = `${basePath}/${scope}/${this.userScopeId}/${this.item.name}${type}`;
        window.navigator.clipboard.writeText(path);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to copy url', err);
        this.$message.error(this.$t('editor.name.copy.failed'));
        return;
      }
      this.$message.success(this.$t('editor.name.copy.success'));
    },
    openConfig() {
      const basePath = `http${this.$apiConfig.https ? 's' : ''}://${this.$apiConfig.host}`;
      const type = this.type === 'cfs' ? `.${this.item.type}` : '';
      const path = `${basePath}/config/${this.userScopeId}/${this.item.name}${type}`;
      window.open(path, '_blank');
    },
    openDebug() {
      const query = {
        name: this.item.name,
      };
      this.openTab({
        uid: this.userId,
        name: 'debugger',
        path: '/lambda-debugger',
        query,
      });
      this.$router.replace({
        path: '/app/lambda-debugger',
        query,
      });
    },
    openLambdaLog() {
      const query = {
        lambdaId: this.item.id,
      };
      this.openTab({
        uid: this.userId,
        name: 'lambda.log',
        path: '/lambda-log',
        query,
      });
      this.$router.replace({
        path: '/app/lambda-log',
        query,
      });
    },
  },
};
</script>

<style lang="less">
.monaco {
  box-sizing: border-box;
  padding: 6px 8px 12px 16px;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  &-header {
    display: flex;
    height: 32px;
    align-items: center;
    margin-bottom: 10px;
    &__name {
      flex: 1;
      color: var(--primary);
      font-size: 14px;
      justify-self: flex-start;
      span {
        margin-right: 4px;
        br {
          display: none;
        }
      }
      .el-dropdown {
        color: var(--primary);
      }
      .el-dropdown:hover {
        color: var(--regular-text);
      }
      i {
        cursor: pointer;
        margin-right: 8px;
        transform: translateY(1px);
      }
      i:last-child {
        margin-right: 0;
      }
      i:hover {
        color: var(--regular-text);
      }
    }
    &__name_editing {
      background-color: #1e1e1e;
      padding: 6px 10px 7px 10px;
      margin-right: 8px !important;
    }
    &__ctrl {
      .monaco-ctrl {
        margin-right: 16px;
      }
      .monaco-ctrl:last-child {
        margin-right: 0;
      }
      .monaco-ctrl__btn {
        .el-button {
          padding: 8px 16px;
          font-size: 13px;
        }
      }
    }
  }
  &-body {
    flex: 1;
    position: relative;
    width: 100%;
    max-height: calc(100% - 42px);
    box-sizing: border-box;
    &-editor {
      width: 100%;
      height: 100%;
      box-shadow: 4px 4px 8px rgba(25, 25, 25, 0.25);
    }
    &-failed {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(25, 25, 25, 0.9);
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      &__icon {
        font-size: 42px;
        margin-bottom: 12px;
      }
      &__text {
        font-size: 24px;
        letter-spacing: 0.05em;
        margin-bottom: 28px;
      }
      &__btn {
        margin-bottom: 36px;
      }
    }
  }
}
.monaco-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  &-icon {
    width: 268px;
    transform: translateY(-5%);
  }
}
</style>
