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
// transition

.fade-enter-active, .fade-leave-active {
  transition: opacity 125ms;
}
.fade-enter, .fade-leave {
  opacity: 0;
}

// basic
div:focus, span:focus, a:focus, li:focus {
  outline-width: 0;
}

// context

.context-menu {
  background-color: #121212;
  box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.375);
  transition: background-color 100ms;
  &__item {
    font-size: 13px;
    height: 36px;
    line-height: 36px;
    padding: 0px 12px;
  }
  &__item:hover {
    background-color: #1e1e1e;
  }
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

.clearfix {
  clear: both;
}

// element cover
.el-dropdown {
  user-select: none;
  &-link {
    color: var(--primary);
  }
}
.el-dropdown:hover {
  cursor: pointer;
}
.el-dropdown-menu {
  padding: 8px 0;
  &__item {
    line-height: 32px;
    padding: 0 18px;
  }
}
</style>
