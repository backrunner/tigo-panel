<template>
  <div class="debugger-sender">
    <div class="debugger-sender__header">
      <el-select size="small" v-model="method">
        <el-option label="GET" value="get" />
        <el-option label="POST" value="post" />
      </el-select>
      <el-input size="small" v-model="path">
        <template slot="prepend">{{ pathPrepend }}</template>
      </el-input>
      <el-button size="small" type="primary"><i class="el-icon-s-promotion"></i></el-button>
    </div>
    <div class="debugger-sender__body">
      <div class="sender-form sender-headers">
        <div class="sender-form__header">
          <span>Headers</span>
          <el-button size="mini" type="primary" @click="addHeader">{{
            $t('debugger.sender.add')
          }}</el-button>
        </div>
        <div class="sender-form__body">
          <div class="sender-row" v-for="(header, index) in headers" :key="header.id">
            <el-input
              class="sender-row__key"
              size="mini"
              v-model="header.key"
              placeholder="Key"
            ></el-input>
            <el-input
              class="sender-row__value"
              size="mini"
              v-model="header.value"
              placeholder="Value"
            ></el-input>
            <i v-if="index > 0" class="el-icon-delete-solid sender-row__del"></i>
          </div>
        </div>
      </div>
      <div class="sender-form sender-values">
        <div class="sender-form__header">
          <span>{{ valuesHeader }}</span>
          <el-button size="mini" type="primary" @click="addValue">{{
            $t('debugger.sender.add')
          }}</el-button>
        </div>
        <div class="sender-form__body">
          <div class="sender-row" v-for="(v, index) in values" :key="v.id">
            <el-input
              class="sender-row__key"
              size="mini"
              v-model="v.key"
              placeholder="Key"
            ></el-input>
            <el-input
              class="sender-row__value"
              size="mini"
              v-model="v.value"
              placeholder="Value"
            ></el-input>
            <i v-if="index > 0" class="el-icon-delete-solid sender-row__del"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      method: 'get',
      path: '',
      headers: [
        {
          id: new Date().valueOf(),
          key: '',
          value: '',
        },
      ],
      values: [
        {
          id: new Date().valueOf(),
          key: '',
          value: '',
        },
      ],
    };
  },
  computed: {
    ...mapState({
      scopeId: (state) => state.auth.scopeId,
    }),
    pathPrepend() {
      return `/lambda/${this.scopeId}/`;
    },
    valuesHeader() {
      return this.method === 'get' ? 'Query' : 'Body';
    },
  },
  methods: {
    addHeader() {
      this.headers.push({
        id: new Date().valueOf(),
        key: '',
        value: '',
      });
    },
    addValue() {
      this.values.push({
        id: new Date().valueOf(),
        key: '',
        value: '',
      });
    },
  },
};
</script>

<style lang="less">
.debugger-sender {
  flex: 1;
  max-height: calc(100% - 332px);
  &__header {
    display: flex;
    margin-bottom: 12px;
    .el-select {
      width: 96px;
      margin-right: 8px;
    }
    .el-input {
      margin-right: 8px;
    }
    .el-button {
      width: 52px;
      padding: 0;
      font-size: 15px;
    }
  }
  &__body {
    height: calc(100% - 44px);
    max-height: calc(100% - 44px);
    position: relative;
    .sender-form {
      margin-bottom: 12px;
      height: calc((100% - 24px) / 2);
      max-height: calc((100% - 24px) / 2);
      position: relative;
      &__header {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: var(--primary);
        line-height: 28px;
        margin-bottom: 8px;
        span {
          flex: 1;
        }
        .el-button {
          justify-self: flex-end;
        }
      }
      &__body {
        max-height: calc(100% - 36px);
        overflow-y: auto;
        .sender-row {
          display: flex;
          margin-bottom: 8px;
          &__key {
            width: 200px;
            margin-right: 8px;
          }
          &__value {
            flex: 1;
            margin-right: 8px;
          }
          &__del {
            line-height: 28px;
            color: var(--primary);
            font-size: 12px;
            cursor: pointer;
          }
          &__del:hover {
            color: var(--regular-text);
          }
        }
        .sender-row:first-child {
          &__value {
            margin-right: 0;
          }
        }
        .sender-row:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
