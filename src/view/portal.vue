<template>
  <div class="portal-wrapper">
    <div class="portal">
      <el-form key="login" class="portal-form" ref="loginForm" v-if="showLoginForm">
        <div class="portal-form-title">
          <span>登录到 tigo</span>
        </div>
        <el-form-item>
          <el-input v-model="loginForm.username" :placeholder="$t('portal.username')"> </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="loginForm.password" :placeholder="$t('portal.password')"> </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">
            {{ $t('portal.remember') }}
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">{{ $t('portal.login') }}</el-button>
        </el-form-item>
        <div class="form-footer">
          <span @click="switchToRegister">注册</span>
        </div>
      </el-form>
      <el-form key="register" class="portal-form" ref="registerForm" v-if="showRegisterForm">
        <div class="portal-form-title">
          <span>开始使用 tigo</span>
        </div>
        <el-form-item>
          <el-input v-model="registerForm.username" :placeholder="$t('portal.username')">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="registerForm.password" :placeholder="$t('portal.password')">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="registerForm.confirmPassword"
            :placeholder="$t('portal.confirmPassword')"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register">{{ $t('portal.register') }}</el-button>
        </el-form-item>
        <div class="form-footer">
          <span @click="switchToLogin">已有帐户？登录</span>
        </div>
      </el-form>
      <div class="portal-footer">
        <span class="version">tigo-panel v{{ version }}</span>
        <a
          href="https://github.com/tigojs/tigo-panel"
          class="github"
          target="_blank"
          rel="noopener noreferer"
          >
          <GitHubIcon />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { checkAuthStatus, doTokenRefresh } from '../utils/auth';
import GitHubIcon from '@/common/icon/GitHub';
import { version } from '@/common/version';

export default {
  components: {
    GitHubIcon,
  },
  data() {
    return {
      formType: 'login',
      loginForm: {
        username: '',
        password: '',
        remember: false,
      },
      registerForm: {
        username: '',
        password: '',
        confirmPassword: '',
      },
      version,
    };
  },
  computed: {
    showLoginForm() {
      return this.formType === 'login';
    },
    showRegisterForm() {
      return this.formType === 'register';
    },
  },
  async created() {
    // 存在验证信息，自动跳转
    const { token, refreshToken } = this.$store.state.auth;
    if (token) {
      const res = await checkAuthStatus();
      if (res) {
        this.$router.push('/app');
      }
    }
    if (!token && refreshToken) {
      const res = await doTokenRefresh(refreshToken);
      if (res) {
        this.$router.push('/app');
      }
    }
  },
  methods: {
    // actions
    login() {},
    register() {},
    // switch
    switchToLogin() {
      this.formType = 'login';
    },
    switchToRegister() {
      this.formType = 'register';
    },
  },
};
</script>

<style lang="less">
@portal-padding-left: 50px;
@portal-footer-height: 42px;

.portal-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: @portal-padding-left;
  .portal {
    flex: 1;
    transform: translateY(-3.75%);
    .portal-form {
      width: 460px;
      &-title {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 32px;
        letter-spacing: 0.05rem;
        color: var(--primary);
      }
      .el-button {
        padding: 12px 64px;
      }
      .form-footer {
        font-size: 16px;
        margin-top: 64px;
        user-select: none;
        span {
          color: var(--primary);
          transition: 200ms ease;
        }
        span:hover {
          cursor: pointer;
          color: var(--regular-text);
        }
      }
    }
    .portal-footer {
      width: 100%;
      display: flex;
      align-items: center;
      user-select: none;
      margin-top: 72px;
      span, a {
        color: var(--primary);
        font-size: 12px;
        margin-right: 16px;
      }
      span:last-child {
        margin-right: 0;
      }
      .github {
        width: max-content;
        transform: translateY(1.5px);
        svg {
          display: inline;
          path {
            transition: 200ms ease;
          }
        }
        svg:hover {
          path {
            fill: var(--regular-text);
            cursor: pointer;
          }
        }
      }
    }
  }
}
</style>
