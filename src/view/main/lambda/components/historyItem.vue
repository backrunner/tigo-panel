<template>
  <div class="debugger-history__item">
    <div class="history-method">
      <span>{{ formattedMethod }}</span>
    </div>
    <div class='history-path'>
      <span>{{ item.path }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    formattedMethod() {
      if (!this.item) {
        return null;
      }
      return this.item.method.toUpperCase();
    },
  },
};
</script>
