<template>
  <div class="monaco" v-if="item">
    <div class="monaco-header">
      <div class="monaco-header__name">
        <span>{{item.name}}</span>
      </div>
      <div class="monaco-header__ctrl">
        <TypeSelector v-model="fileType" v-if="type === 'cfs'" />
        <span class="monaco-ctrl monaco-ctrl__btn">
          <el-button type="primary">保存</el-button>
        </span>
      </div>
    </div>
    <div class="monaco-body">
      <MonacoEditor
        class="monaco-body-editor"
        v-model="content"
        :language="item.type"
        />
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
      },
    },
  },
  data() {
    return {
      content: '',
      fileType: null,
    };
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
