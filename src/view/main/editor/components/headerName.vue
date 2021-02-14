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
      <i class="el-icon-edit-outline" @click="handleEditClick" v-show="!editable"></i>
    </el-tooltip>
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
  },
  data() {
    return {
      editable: false,
      originName: false,
    };
  },
  methods: {
    handleEditClick() {
      this.editable = true;
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
    setEditable(status) {
      this.editable = status;
    },
    setToOriginal() {
      this.$refs.name.innerText = this.name;
    },
  },
};
</script>
