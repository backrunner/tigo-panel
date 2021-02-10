<template>
  <div class="card-text">
    <span class="card-text__label">{{`${label}:`}}</span>
    <span :class="{
      'card-text__text': true,
      'card-text__selectable': selectable,
      }">{{text}}</span>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    text: String,
    selectable: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="less">
.home-card {
  .card-text {
    user-select: none;
    span {
      font-size: 12.5px;
      color: var(--primary);
      letter-spacing: 0.05em;
    }
    &__label {
      margin-right: 8px;
    }
  }
  .card-text__selectable {
    user-select: text !important;
  }
}
</style>
