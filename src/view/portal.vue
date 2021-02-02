<template>
  <div class="portal-wrapper">
    <div class="portal">
      <el-form
        class="portal-form"
        ref="loginForm"
        v-if="showLoginForm"
        >
        <el-form-item>
          <el-input
            v-model="loginForm.username"
            :placeholder="$t('portal.username')">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            :placeholder="$t('portal.password')">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remember">
            {{$t('portal.remember')}}
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">{{$t('portal.login')}}</el-button>
        </el-form-item>
        <div class="form-footer">
          <a @click="switchToRegister">注册</a>
        </div>
      </el-form>
      <el-form
        class="portal-form"
        ref="registerForm"
        v-if="showRegisterForm"
        >
        <el-form-item>
          <el-input
            v-model="registerForm.username"
            :placeholder="$t('portal.username')">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="registerForm.password"
            :placeholder="$t('portal.password')">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="registerForm.confirmPassword"
            :placeholder="$t('portal.confirmPassword')">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register">{{$t('portal.register')}}</el-button>
        </el-form-item>
        <div class="form-footer">
          <a @click="switchToRegister">已有帐户？登录</a>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { checkAuthStatus, doTokenRefresh } from '../utils/auth';

export default {
  data() {
    return {
      formType: 'login',
      loginForm: {
        username: '',
        password: '',
        remember: false,
      },
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
    login() {

    },
    register() {

    },
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
