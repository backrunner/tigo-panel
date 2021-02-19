<template>
  <div class="debugger-response">
    <div class="debugger-response__header">
      <span>Response</span>
      <span
        :class="{
          'response-status': true,
          'response-status__success': status === 200,
          'response-status__error': status !== 200,
        }"
        v-if="response"
        >{{ status }}</span
      >
    </div>
    <div class="debugger-response__body">
      <pre class="c-scroll c-scroll__small response-headers">{{ headers }}</pre>
      <pre class="c-scroll c-scroll__small response-body">{{ body }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      response: null,
    };
  },
  computed: {
    headers() {
      if (!this.response) {
        return '';
      }
      const strs = Object.keys(this.response.headers).map((key) => {
        return `${key}: ${this.response.headers[key]}`;
      });
      return strs.join('\n');
    },
    body() {
      if (!this.response) {
        return '';
      }
      return this.response.body;
    },
    status() {
      if (!this.response) {
        return '';
      }
      return this.response.status;
    },
  },
  methods: {
    setResponse(res) {
      this.response = res;
    },
  },
};
</script>

<style lang="less">
.debugger-response {
  &__header {
    font-size: 14px;
    color: var(--primary);
    .response-status {
      font-size: 10px;
      padding: 2px 6px;
      color: #282828;
      margin-left: 12px;
    }
    .response-status__success {
      background-color: #6FBB49;
    }
    .response-status__error {
      background-color: #EB5F5F;
    }
  }
  &__body {
    height: 300px;
    position: relative;
    display: flex;
    .response-headers {
      width: 375px;
      border-right: 1px solid #323232;
    }
    .response-body {
      flex: 1;
    }
    .c-scroll::-webkit-scrollbar-track {
      background-color: #232323;
    }
    .c-scroll::-webkit-scrollbar-corner {
      background-color: #232323;
    }
    pre {
      height: 100%;
      background: #232323;
      box-shadow: 4px 4px 8px rgba(25, 25, 25, 0.125);
      padding: 4px 6px;
      color: var(--primary);
      box-sizing: border-box;
      white-space: pre-wrap;
      word-break: break-all;
      word-wrap: break-word;
      overflow-y: auto;
    }
  }
}
</style>
