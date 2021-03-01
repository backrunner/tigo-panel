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
        <el-switch v-model="settings.public" @change="publicChanged"></el-switch>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
export default {
  props: {
    bucket: String,
  },
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
    publicChanged(val) {
      if (val) {
        this.settings.public = false;
        this.$confirm(`${this.$t('oss.settings.enablePublic')}`, `${this.$t('confirm')}`)
          .then(async () => {
            const ret = await this.$nApi.post('/oss/setBucketPolicy', {
              bucketName: this.bucket,
              policy: {
                public: true,
              },
            });
            if (!ret) {
              return;
            }
            this.$message.success(this.$t('oss.settings.success'));
            this.settings.public = true;
            this.$emit('policy-updated', this.bucket, {
              public: true,
            });
          })
          .catch(() => {});
      } else {
        this.settings.public = true;
        this.$confirm(`${this.$t('oss.settings.disablePublic')}`, `${this.$t('confirm')}`)
          .then(async () => {
            const ret = await this.$nApi.post('/oss/setBucketPolicy', {
              bucketName: this.bucket,
              policy: {
                public: false,
              },
            });
            if (!ret) {
              return;
            }
            this.settings.public = false;
            this.$message.success(this.$t('oss.settings.success'));
            this.$emit('policy-updated', this.bucket, {
              public: false,
            });
          })
          .catch(() => {});
      }
    },
  },
};
</script>
