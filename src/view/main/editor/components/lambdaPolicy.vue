<template>
  <el-drawer
    class="lambda-policy"
    :visible.sync="show"
    :model="false"
    size="400px"
    :title="$t('lambda.policy')"
  >
    <el-form ref="form" :model="policy" label-width="220px" label-position="left">
      <el-form-item :label="`${$t('lambda.policy.maxWaitTime')} (1-30s)`">
        <el-input-number
          size="small"
          v-model="policy.maxWaitTime"
          :min="1"
          :max="30"
        ></el-input-number>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
const DEFAULT_POLICY = {
  maxWaitTime: 10,
};

export default {
  props: {
    lambdaId: {
      type: String,
    },
  },
  data() {
    return {
      policy: {},
      show: false,
      newLambdaCache: {},
    };
  },
  methods: {
    async fetchPolicy() {
      const res = await this.$nApi('/faas/getPolicy', {
        params: {
          lambdaId: this.lambdaId,
        },
      });
      if (!res) {
        this.$set(this, 'policy', DEFAULT_POLICY);
        return;
      }
      const policy = res.data.data;
      if (!Object.keys(policy).length) {
        this.$set(this, 'policy', Object.assign({}, DEFAULT_POLICY));
      } else {
        this.$set(this, 'policy', res.data.data);
      }
    },
    open() {
      this.$set(this, 'policy', {});
      this.show = true;
      if (!this.lambdaId.startsWith('new')) {
        this.fetchPolicy();
      } else if (this.newLambdaCache[this.lambdaId]) {
        this.policy = this.newLambdaCache[this.lambdaId];
      } else {
        this.policy = Object.assign({}, DEFAULT_POLICY);
      }
    },
    getFromCache(lambdaId) {
      return this.newLambdaCache[lambdaId];
    },
  },
};
</script>
