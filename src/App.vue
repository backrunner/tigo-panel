<template>
  <transition mode="out-in" name="fade" appear>
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
  --regular-text: #999;
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
  transition: opacity 125ms;
}
.fade-enter, .fade-leave {
  opacity: 0;
}
</style>
