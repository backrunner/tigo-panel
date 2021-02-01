<template>
  <div id="app">
    <router-view></router-view>
  </div>
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

html, body, #app {
  width: 100vw;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background-color: var(--bg-main);
}
</style>
