<template>
  <span class="monaco-ctrl manaco-type-selector">
    <el-dropdown @command="handleCommand" trigger="click">
      <span class="el-dropdown-link">
        {{ displayType }}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="json">JSON</el-dropdown-item>
        <el-dropdown-item command="xml">XML</el-dropdown-item>
        <el-dropdown-item command="yaml">YAML</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    isNew: Boolean,
  },
  model: {
    event: 'change',
  },
  computed: {
    displayType() {
      if (this.value) {
        return this.value.toUpperCase();
      }
      return 'JSON';
    },
  },
  methods: {
    handleCommand(val) {
      if (this.value !== val) {
        if (this.isNew) {
          this.$emit('change', val);
        }
      }
    },
  },
};
</script>
