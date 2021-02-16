<template>
  <div class="monaco-header__name">
    <span
      :class="{
        'monaco-header__name_editing': editable,
      }"
      ref="name"
      :contenteditable="editable"
      >{{ name }}</span
    >
    <el-tooltip
      class="item"
      effect="light"
      :open-delay="1000"
      :content="$t('editor.name.edit')"
      placement="bottom"
    >
      <i class="el-icon-edit" @click="handleEditClick" v-show="showDefaultIcons"></i>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="light"
      :open-delay="1000"
      :content="$t('editor.name.copy')"
      placement="bottom"
    >
      <i class="el-icon-link" @click="handleCopyClick" v-show="showDefaultIcons"></i>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="light"
      :open-delay="1000"
      :content="$t('editor.name.copy')"
      placement="bottom"
      v-show="showView"
    >
      <i class="el-icon-view" @click="handleViewClick" v-show="showDefaultIcons"></i>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="light"
      :open-delay="1000"
      :content="$t('editor.name.debug')"
      placement="bottom"
      v-show="showDebug"
    >
      <i class="el-icon-cpu" @click="handleDebugClick" v-show="showDefaultIcons"></i>
    </el-tooltip>
    <el-dropdown @command="handleMenuCommand" size="small" placement="bottom" trigger="click">
      <i class="el-icon-more el-dropdown-link" v-show="showDefaultIcons && showMore"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="env" v-if="editorType === 'lambda'">{{
          $t('editor.env.title')
        }}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-tooltip
      class="item"
      effect="light"
      :open-delay="1000"
      :content="$t('editor.cancel')"
      placement="bottom"
    >
      <i class="el-icon-close" v-show="editable" @click="handleCancelClick"></i>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="light"
      :open-delay="1000"
      :content="$t('editor.save')"
      placement="bottom"
    >
      <i class="el-icon-check" v-show="editable" @click="handleConfirmClick"></i>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
      default: '',
    },
    scriptId: {
      type: [String, Number],
    },
    editorType: String,
  },
  data() {
    return {
      editable: false,
      originName: false,
    };
  },
  computed: {
    showDefaultIcons() {
      return !this.editable;
    },
    showView() {
      return this.editorType === 'cfs';
    },
    showDebug() {
      return this.editorType === 'lambda' && !`${this.scriptId}`.startsWith('new');
    },
    showMore() {
      return this.editorType === 'lambda';
    },
  },
  methods: {
    handleEditClick() {
      this.editable = true;
    },
    handleCopyClick() {
      this.$parent.copyUrl();
    },
    handleViewClick() {
      if (this.editorType === 'cfs') {
        this.$parent.openConfig();
      }
    },
    handleDebugClick() {
      this.$parent.copyDebug();
    },
    handleConfirmClick() {
      const newName = this.$refs.name.innerText.trim();
      if (!newName) {
        this.$message.error(this.$t('editor.name.edit.emptyError'));
        return;
      }
      if (this.$refs.name.innerText === this.name) {
        this.editable = false;
        return;
      }
      this.$emit('edit', this.$refs.name.innerText);
    },
    handleCancelClick() {
      this.$refs.name.innerText = this.name;
      this.editable = false;
    },
    handleMenuCommand(cmd) {
      if (cmd === 'env') {
        this.$parent.$parent.openScriptEnv();
      }
    },
    setEditable(status) {
      this.editable = status;
    },
    setToOriginal() {
      this.$refs.name.innerText = this.name;
    },
  },
};
</script>
