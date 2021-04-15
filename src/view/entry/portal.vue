<template>
  <div class="entry-container">
    <div class="entry portal">
      <el-form
        key="login"
        class="portal-form"
        ref="loginForm"
        :model="loginForm"
        v-show="showLoginForm"
      >
        <div class="portal-form-title">
          <span>{{ $t('portal.login.title') }}</span>
        </div>
        <el-form-item
          prop="username"
          :rules="[{ required: true, message: $t('portal.usernameEmpty') }]"
        >
          <el-input v-model="loginForm.username" :placeholder="$t('portal.username')"> </el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="[{ required: true, message: $t('portal.passwordEmpty') }]"
        >
          <el-input
            v-model="loginForm.password"
            type="password"
            :placeholder="$t('portal.password')"
            @keyup.native.enter="handleLoginEnter"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">
            {{ $t('portal.remember') }}
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" :loading="loginLoading">
            {{ $t('portal.login') }}
          </el-button>
        </el-form-item>
        <div class="form-footer">
          <span @click="switchToRegister" v-if="showRegisterEntry">
            {{ $t('portal.toRegister') }}
          </span>
        </div>
      </el-form>
      <el-form
        key="register"
        class="portal-form"
        ref="registerForm"
        :model="registerForm"
        v-show="showRegisterForm"
      >
        <div class="portal-form-title">
          <span>{{ $t('portal.register.title') }}</span>
        </div>
        <el-form-item
          prop="username"
          :rules="[
            { required: true, message: $t('portal.usernameEmpty') },
            { min: 6, message: $t('portal.usernameLengthInvalid') },
            { pattern: /[a-zA-Z0-9_]+/, message: $t('portal.usernameInvalid') },
          ]"
        >
          <el-input v-model="registerForm.username" :placeholder="$t('portal.username')">
          </el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          :rules="[
            { required: true, message: $t('portal.passwordEmpty') },
            { min: 6, message: $t('portal.passwordLengthInvalid') },
          ]"
        >
          <el-input
            v-model="registerForm.password"
            type="password"
            :placeholder="$t('portal.password')"
          >
          </el-input>
        </el-form-item>
        <el-form-item
          prop="confirmPassword"
          :rules="[
            { required: true, message: $t('portal.confirmPasswordEmpty') },
            { validator: confirmPasswordValidator, message: $t('portal.confirmPasswordInvalid') },
          ]"
        >
          <el-input
            v-model="registerForm.confirmPassword"
            :placeholder="$t('portal.confirmPassword')"
            type="password"
            @keyup.native.enter="handleRegisterEnter"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register" :loading="registerLoading">
            {{ $t('portal.register') }}
          </el-button>
        </el-form-item>
        <div class="form-footer">
          <span @click="switchToLogin">{{ $t('portal.toLogin') }}</span>
        </div>
      </el-form>
      <EntryFooter />
    </div>
  </div>
</template>

<script>
import { checkAuthStatus, doLogin, doRegister, doTokenRefresh } from '@/utils/auth';
import EntryFooter from './components/entryFooter';

export default {
  components: {
    EntryFooter,
  },
  data() {
    const confirmPasswordValidator = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error(this.$t('portal.passwordNotSame')));
      } else {
        callback();
      }
    };
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
      loginLoading: false,
      registerLoading: false,
      confirmPasswordValidator,
      registerDisabled: false,
    };
  },
  computed: {
    showLoginForm() {
      return this.formType === 'login';
    },
    showRegisterForm() {
      return this.formType === 'register';
    },
    showRegisterEntry() {
      return !this.registerDisabled;
    },
  },
  async created() {
    // auth info existed, jump to the main page
    const { token, refreshToken } = this.$store.state.auth;
    if (token) {
      const res = await checkAuthStatus();
      if (res) {
        this.$router.push(this.$route.query?.path || '/app');
      }
    }
    if (!token && refreshToken) {
      const res = await doTokenRefresh(refreshToken);
      if (res) {
        this.$router.push(this.$route.query?.path || '/app');
      }
    }
    // check server configuration
    await this.checkServerConf();
  },
  mounted() {
    // remove nav info when user come this page
    window.localStorage.removeItem('nav');
  },
  methods: {
    // init
    async checkServerConf() {
      let res;
      try {
        res = await this.$ptApi.get('/auth/getConf');
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Cannot get server auth configuration.', err);
        this.$message.error(this.$t('portal.getConfFailed'));
        return;
      }
      if (!res) {
        return;
      }
      this.registerDisabled = res.data.data?.disableRegister || false;
    },
    // actions
    login() {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) {
          return;
        }
        this.loginLoading = true;
        let res;
        try {
          res = await doLogin(this.loginForm);
        } catch (err) {
          const message = err?.response?.data?.message;
          if (message) {
            this.$message.error(message);
          } else {
            this.$message.error(this.$t('portal.loginFailed'));
          }
          this.loginLoading = false;
          // eslint-disable-next-line no-console
          console.error('Login error.', err);
        }
        if (res) {
          this.$message.success(this.$t('portal.loginSuccess'));
          this.$router.push(this.$route.query?.path || '/app');
        }
        this.loginLoading = false;
      });
    },
    register() {
      this.$refs.registerForm.validate(async (valid) => {
        if (!valid) {
          return;
        }
        this.registerLoading = true;
        let res;
        try {
          res = await doRegister(this.registerForm);
        } catch (err) {
          const message = err?.response?.data?.message;
          if (message) {
            this.$message.error(message);
          } else {
            this.$message.error(this.$t('portal.registerFailed'));
          }
          this.registerLoading = false;
          // eslint-disable-next-line no-console
          console.error('Register error.', err);
          return;
        }
        if (res) {
          this.switchToLogin();
          this.$message.success(this.$t('portal.registerSuccess'));
        }
        this.registerLoading = false;
      });
    },
    handleLoginEnter() {
      this.login();
    },
    handleRegisterEnter() {
      this.register();
    },
    // switch
    switchToLogin() {
      this.formType = 'login';
      this.$refs.loginForm.resetFields();
    },
    switchToRegister() {
      this.formType = 'register';
      this.$refs.registerForm.resetFields();
    },
  },
};
</script>

<style lang="less">
@portal-footer-height: 42px;

.portal {
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
}
</style>
