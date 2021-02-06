<template>
  <div id="app">
    <transition mode="out-in" name="fade" appear>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="less">
.fade-enter-active, .fade-leave-active {
  transition: opacity 125ms;
}
.fade-enter, .fade-leave {
  opacity: 0;
}

@entry-padding-left: 64px;

.entry-container {
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: @entry-padding-left;
  .entry {
    flex: 1;
    transform: translateY(-3.75%);
  }
}

// element cover
.el-dropdown {
  user-select: none;
  &-link {
    color: var(--primary);
  }
}
.el-dropdown-menu {
  padding: 8px 0;
  &__item {
    line-height: 32px;
    padding: 0 18px;
  }
}
</style>
