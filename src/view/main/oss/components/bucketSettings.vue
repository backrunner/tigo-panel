<template>
  <el-drawer
    class="oss-settings"
    :visible.sync="show"
    :modal="false"
    size="400px"
    :title="$t('oss.settings')"
    >
    <el-form ref="form" :model="settings" label-width="80px" label-position="left">
      <el-form-item :label="$t('oss.settings.public')">
        <el-switch v-model="settings.public"></el-switch>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      settings: {
        public: false,
      },
    };
  },
  methods: {
    open(policy) {
      this.settings.public = policy?.public || false;
      this.show = true;
    },
  },
};
</script>
