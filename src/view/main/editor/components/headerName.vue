<template>
  <div class="monaco-header__name">
    <span
      :class="{
        'monaco-header__name_editing': editable,
      }"
      ref="name"
      :key="nameKey"
      :contenteditable="editable"
      @keydown.enter="
        () => {
          editable && handleConfirmClick();
        }
      "
    >
      {{ name }}
    </span>
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
      v-if="showCopy"
    >
      <i class="el-icon-link" @click="handleCopyClick" v-show="showDefaultIcons"></i>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="light"
      :open-delay="1000"
      :content="$t('editor.name.view')"
      placement="bottom"
      v-if="showView"
    >
      <i class="el-icon-view" @click="handleViewClick" v-show="showDefaultIcons"></i>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="light"
      :open-delay="1000"
      :content="$t('editor.name.debug')"
      placement="bottom"
      v-if="showDebug"
    >
      <i class="el-icon-cpu" @click="handleDebugClick" v-show="showDefaultIcons && showDebug"></i>
    </el-tooltip>
    <el-dropdown @command="handleMenuCommand" size="small" placement="bottom" trigger="click">
      <i class="el-icon-more el-dropdown-link" v-show="showDefaultIcons && showMore"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="env" v-if="showEnv">
          {{ $t('editor.env.title') }}
        </el-dropdown-item>
        <el-dropdown-item command="log" v-if="showLog">
          {{ $t('editor.name.log') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-tooltip
      class="item"
      effect="light"
      :open-delay="1000"
      :content="$t('cancel')"
      placement="bottom"
    >
      <i class="el-icon-close" v-show="editable" @click="handleCancelClick"></i>
    </el-tooltip>
    <el-tooltip
      class="item"
      effect="light"
      :open-delay="1000"
      :content="$t('save')"
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
    lambdaId: {
      type: [String, Number],
    },
    editorType: String,
  },
  data() {
    return {
      editable: false,
      originName: false,
      nameKey: 0,
      enabledFeats: null,
    };
  },
  computed: {
    isLambda() {
      return this.editorType === 'lambda';
    },
    showDefaultIcons() {
      return !this.editable;
    },
    showCopy() {
      return !`${this.lambdaId}`.startsWith('new');
    },
    showView() {
      return this.isLambda && !`${this.lambdaId}`.startsWith('new');
    },
    showDebug() {
      return this.isLambda && !`${this.lambdaId}`.startsWith('new');
    },
    showMore() {
      return this.isLambda;
    },
    showEnv() {
      return this.isLambda;
    },
    showLog() {
      return this.isLambda && this.enabledFeats && this.enabledFeats.log;
    },
  },
  async created() {
    if (this.editorType === 'lambda') {
      await this.fetchEnabledFeats();
    }
  },
  methods: {
    async fetchEnabledFeats() {
      let res;
      try {
        res = await this.$pApi.get('/faas/enabledFeats');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch enabled feats.', err);
        return;
      }
      this.$set(this, 'enabledFeats', res.data.data);
    },
    // icon button handlers
    handleEditClick() {
      this.editable = true;
      if (this.editorType === 'cfs') {
        const name = this.$refs.name.innerText.trim();
        const idx = name.lastIndexOf('.');
        if (idx > 0) {
          this.$refs.name.innerText = name.substring(0, idx);
        }
      }
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
      this.$parent.openDebug();
    },
    handleConfirmClick() {
      const newName = this.$refs.name.innerText.trim();
      if (!newName) {
        this.$message.error(this.$t('editor.name.edit.emptyError'));
        return;
      }
      if (newName === this.name) {
        this.editable = false;
        return;
      }
      this.$emit('edit', newName);
    },
    handleCancelClick() {
      this.nameKey++;
      this.editable = false;
    },
    handleMenuCommand(cmd) {
      if (cmd === 'env') {
        this.$parent.$parent.openLambdaEnv();
      } else if (cmd === 'log') {
        this.$parent.openLog();
      }
    },
    setEditable(status) {
      if (!status) {
        this.nameKey++;
      }
      this.editable = status;
    },
  },
};
</script>
