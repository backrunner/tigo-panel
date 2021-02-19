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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 125ms;
}
.fade-enter,
.fade-leave {
  opacity: 0;
}

// basic

div:focus,
span:focus,
a:focus,
li:focus {
  outline-width: 0;
}

// scroll

.c-scroll::-webkit-scrollbar {
  width: 16px;
  left: -100px;
}
.c-scroll::-webkit-scrollbar-thumb {
  width: 4px;
  border-right: 4px var(--primary) solid;
}
.c-scroll::-webkit-scrollbar-button {
  display: none;
}
.c-scroll::-webkit-scrollbar-track {
  margin-left: 4px;
  background-color: #282828;
}
.c-scroll::-webkit-scrollbar-corner {
  background-color: #282828;
}

.c-scroll__small::-webkit-scrollbar {
  width: 10px;
}

.n-scroll::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.n-scroll::-webkit-scrollbar-thumb {
  width: 4px;
  background-color: var(--primary);
}
.n-scroll::-webkit-scrollbar-button {
  display: none;
}
.n-scroll::-webkit-scrollbar-track {
  margin-left: 4px;
  background-color: #282828;
}
.n-scroll::-webkit-scrollbar-corner {
  background-color: #282828;
}

.el-table__body-wrapper::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.el-table__body-wrapper::-webkit-scrollbar-thumb {
  width: 4px;
  background-color: var(--primary);
}
.el-table__body-wrapper::-webkit-scrollbar-button {
  display: none;
}
.el-table__body-wrapper::-webkit-scrollbar-track {
  margin-left: 4px;
  background-color: #282828;
}
.el-table__body-wrapper::-webkit-scrollbar-corner {
  background-color: #282828;
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
    color: var(--primary);
    user-select: none;
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
.el-button {
  border-radius: 0 !important;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.175);
  transition: box-shadow 200ms ease;
}
.el-button:hover {
  box-shadow: 4px 4px 0px #323232;
}
.el-button--text {
  box-shadow: none;
}
.el-button--text:hover {
  box-shadow: none;
}
.el-dropdown {
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  user-select: none;
  &-link {
    color: var(--primary);
  }
}
.el-dropdown:hover {
  cursor: pointer;
}
.el-dropdown-menu {
  border-radius: 0;
  padding: 8px 0;
  &__item {
    line-height: 32px;
    padding: 0 18px;
  }
}
.el-dropdown-menu--small {
  padding: 4px 0;
}
.el-input-group__prepend {
  border-radius: 0;
  padding: 0 14px;
}
.el-input__inner {
  border-radius: 0;
  transition: box-shadow 200ms ease;
}
.el-input__inner:focus {
  box-shadow: 4px 4px 0px #333;
}
.el-input--small {
  .el-input__inner {
    padding-left: 12px;
    line-height: 28px;
  }
}
.el-input--mini {
  .el-input__inner {
    padding: 0 10px;
  }
}
.el-checkbox__inner {
  border-radius: 0;
}
.el-message {
  user-select: none;
}
.el-popper {
  border-radius: 0;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
}
.el-tooltip__popper {
  border-color: #666 !important;
  color: var(--primary);
  padding: 8px 12px 9px 12px;
  user-select: none;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0;
  .popper__arrow {
    border-bottom-color: #666 !important;
  }
}
.el-drawer__wrapper {
  position: absolute;
  .el-drawer__container {
    background: rgba(28, 28, 28, 0.75);
  }
  .el-drawer {
    &__header {
      padding: 18px 24px;
      margin-bottom: 0;
      .el-drawer__close-btn {
        transform: translateX(10px);
      }
    }
    &__body {
      padding: 8px 24px;
      box-sizing: border-box;
      position: relative;
    }
  }
}
.el-form--inline {
  .el-form-item {
    margin-bottom: 16px;
  }
  .el-form-item:last-child {
    margin-right: 0;
  }
}
.el-loading-mask {
  background-color: rgba(25, 25, 25, 0.75) !important;
}
.el-message-box {
  border-radius: 0;
  border: 1px solid #282828;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
  user-select: none;
  .el-message-box__header {
    padding-bottom: 8px;
    .el-message-box__title {
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #aeaeae;
    }
    .el-message-box__headerbtn {
      transform: translateX(4px);
      color: #aeaeae;
    }
  }
}
.v-modal {
  background: #080808 !important;
}
</style>
