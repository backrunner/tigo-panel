<template>
  <div class="monaco" v-if="item">
    <div class="monaco-header">
      <div class="monaco-header__name">
        <span>{{ displayName }}</span>
      </div>
      <div class="monaco-header__ctrl">
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
            {{$t('editor.save')}}
          </el-button>
        </span>
      </div>
    </div>
    <div class="monaco-body">
      <MonacoEditor
        class="monaco-body-editor"
        v-model="content"
        :language="item.type"
        v-loading="editorLoading"
        />
      <div class="monaco-body-failed" v-if="showFailed">
        <div class="monaco-body-failed__icon">
          <i class="el-icon-close"></i>
        </div>
        <div class="monaco-body-failed__text">
          <span>{{$t('editor.failed.text')}}</span>
        </div>
        <div class="monaco-body-failed__btn">
          <el-button type="primary" @click="reload">{{$t('editor.failed.retry')}}</el-button>
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
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';

export default {
  components: {
    tigoGear,
    MonacoEditor,
    TypeSelector,
  },
  props: {
    item: Object,
    type: String,
  },
  watch: {
    item: {
      deep: true,
      handler(newItem) {
        this.fileType = newItem.type;
        this.content = '';
        if (!`${newItem.id}`.startsWith('new')) {
          this.getContent(newItem.id);
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
    saveButtonLoading() {
      return !!this.saving[this.item.id];
    },
    saveButtonStatus() {
      return !!this.saveDisabled[this.item.id];
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
    };
  },
  methods: {
    async save() {
      this.$set(this.saving, this.item.id, true);
      if (`${this.item.id}`.startsWith('new')) {
        // add
        if (this.type === 'cfs') {
          const res = await this.$nApi.post('/config-storage/save', {
            action: 'add',
            content: Base64.stringify(Utf8.parse(this.content)),
            name: this.item.name,
            type: this.item.type,
          });
          if (!res) {
            this.$set(this.saving, this.item.id, false);
            return;
          }
          const { id } = res.data.data;
          this.$parent.modifyItemId(this.item.id, id);
          this.$message.success(this.$t('edtior.save.success'));
          this.$set(this.saving, this.item.id, false);
        }
      } else {
        // edit
        // eslint-disable-next-line no-lonely-if
        if (this.type === 'cfs') {
          const res = await this.$nApi.post('/config-storage/save', {
            action: 'edit',
            id: this.item.id,
            content: Base64.stringify(Utf8.parse(this.content)),
            name: this.item.name,
            type: this.item.type,
          });
          if (!res) {
            this.$set(this.saving, this.item.id, false);
            return;
          }
          this.$message.success(this.$t('edtior.save.success'));
          this.$set(this.saving, this.item.id, false);
        }
      }
    },
    reload() {
      this.getContent(this.item.id);
    },
    async getContent(id) {
      this.$set(this.contentLoading, id, true);
      this.$set(this.saveDisabled, id, true);
      const res = await this.$nApi.get('/config-storage/getContent', {
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
