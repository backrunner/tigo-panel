<template>
  <div class="monaco" v-if="item">
    <div class="monaco-header">
      <HeaderName ref="headerName" :editorType="type" :name="displayName" @edit="handleNameEdit" />
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
            :disabled="saveButtonStatus"
            @loading="saveButtonLoading"
            @click="save"
          >
            {{ $t('editor.save') }}
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
import tigoGear from '@/common/icon/tigoGear';
import MonacoEditor from './monacoEditor';
import TypeSelector from './typeSelector';
import HeaderName from './headerName';
import DraftTip from './draftTip';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';
import moment from 'moment';
import apiBaseMap from '../constants/ApiBaseMap';
import { getTabPath } from '@/utils/path';
import { mapMutations } from 'vuex';
import { lambdaTester } from '../constants/TestPattern';

const DRAFT_SAVE_TIMEOUT = 500;
const DRAFT_ENABLED_TYPE = ['cfs', 'lambda'];

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
          if (!this.content) {
            this.getContent(newItem.id);
            this.content = '';
          }
        } else {
          this.content = '';
        }
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
      },
    },
  },
  computed: {
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
  methods: {
    ...mapMutations('nav', ['setCannotClose', 'setTabQuery']),
    validateContent() {
      if (this.type === 'lambda') {
        const testRes = lambdaTester.test(this.content);
        if (!testRes) {
          this.$message.error('未检测到必需的 handleRequest 方法');
        }
        return testRes;
      }
      return true;
    },
    async save() {
      if (!this.content) {
        this.$message.error('请先输入内容再保存');
        return;
      }
      this.$set(this.saving, this.item.id, true);
      if (!this.validateContent()) {
        return;
      }
      if (`${this.item.id}`.startsWith('new')) {
        let res;
        // add
        if (this.type === 'cfs') {
          res = await this.$nApi.post('/config-storage/save', {
            action: 'add',
            content: Base64.stringify(Utf8.parse(this.content)),
            name: this.item.name,
            type: this.item.type,
          });
        } else if (this.type === 'lambda') {
          res = await this.$nApi.post('/faas/save', {
            action: 'add',
            content: Base64.stringify(Utf8.parse(this.content)),
            name: this.item.name,
          });
        }
        if (!res) {
          this.$set(this.saving, this.item.id, false);
          return;
        }
        const { id } = res.data.data;
        this.clearDraftTimeout(this.item.id);
        this.$parent.modifyItemId(this.item.id, id);
        this.$message.success(this.$t('edtior.save.success'));
        this.$set(this.saving, this.item.id, false);
      } else {
        // edit
        // eslint-disable-next-line no-lonely-if
        let res;
        if (this.type === 'cfs') {
          res = await this.$nApi.post('/config-storage/save', {
            action: 'edit',
            id: this.item.id,
            content: Base64.stringify(Utf8.parse(this.content)),
            name: this.item.name,
            type: this.item.type,
          });
        } else if (this.type === 'lambda') {
          res = await this.$nApi.post('/faas/save', {
            action: 'edit',
            id: this.item.id,
            content: Base64.stringify(Utf8.parse(this.content)),
            name: this.item.name,
          });
        }
        if (!res) {
          this.$set(this.saving, this.item.id, false);
          return;
        }
        this.clearDraftTimeout(this.item.id);
        this.$message.success(this.$t('edtior.save.success'));
      }
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
      const { content } = res.data.data;
      this.content = Utf8.stringify(Base64.parse(content));
      this.$set(this.saveDisabled, id, false);
      this.$set(this.contentLoading, id, false);
      this.$set(this.contentLoadFailed, id, false);
    },
    handleTypeChanged(type) {
      this.$parent.modifyItemType(this.item.id, type);
    },
    handleEditorChange(value) {
      if (this.draftEnabled) {
        if (this.draftSaveTimeout[this.item.id]) {
          clearTimeout(this.draftSaveTimeout[this.item.id]);
        }
        this.draftSaveTimeout[this.item.id] = setTimeout(() => {
          if (!this.drafts[this.item.id] || this.drafts[this.item.id] !== value) {
            this.setCannotClose({
              path: getTabPath(this.$route.path),
              status: { msg: this.$t('editor.closeTip.haveDraft') },
            });
            this.drafts[this.item.id] = value;
          }
          this.$set(this.draftSaveTime, this.item.id, moment().format('HH:mm:ss'));
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
        await this.$confirm(`${this.$t('editor.confirm.editName')}`);
      } catch {
        return;
      }
      const res = await this.$nApi.post(`${apiBaseMap[this.type]}/rename`, {
        id: this.item.id,
        newName,
      });
      if (!res) {
        this.$refs.headerName.setToOriginal();
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
  },
};
</script>

<style lang="less">
.monaco {
  box-sizing: border-box;
  padding: 8px 24px 24px 24px;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  &-header {
    display: flex;
    height: 48px;
    align-items: center;
    margin-bottom: 8px;
    &__name {
      flex: 1;
      color: var(--primary);
      font-size: 15px;
      justify-self: flex-start;
      span {
        margin-right: 8px;
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
      padding: 8px 12px;
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
        }
      }
    }
  }
  &-body {
    flex: 1;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    &-editor {
      width: 100%;
      height: 100%;
      box-shadow: 4px 4px 8px rgba(25, 25, 25, 0.25);
    }
    .el-loading-mask {
      background-color: rgba(25, 25, 25, 0.9);
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
