<template>
  <transition mode="out-in" name="fade">
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-else></router-view>
  </transition>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="less">
:root {
  --primary: #f16d41;
  --bg-main: #1e1e1e;
}

html,
body,
#app {
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background-color: var(--bg-main);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .125s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
