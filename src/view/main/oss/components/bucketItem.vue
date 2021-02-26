<template>
  <div
    :class="{
      'oss-list-item': true,
      'oss-list-item__selected': selected === name,
    }"
    :data-name="name"
  >
    <span>{{ name }}</span>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    selected: {
      type: String,
    },
  },
};
</script>

<style lang="less">
.oss-list-item {
  border-bottom: 1px solid #363636;
  display: flex;
  align-items: center;
  padding: 14px 18px;
  span {
    color: var(--primary);
    font-size: 13px;
  }
}
.oss-list-item:hover {
  background: #3a3a3a;
}
.oss-list-item__selected {
  background: #424242 !important;
}
</style>
