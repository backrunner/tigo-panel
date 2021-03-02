<template>
  <div
    :class="{
      'oss-list-item': true,
      'oss-list-item__selected': selected === name,
    }"
    :data-name="name"
    v-context
  >
    <span>{{ name }}</span>
    <ContextMenu @item-clicked="handleContextClicked">
      <ContextMenuItem name="delete">{{ $t('delete') }}</ContextMenuItem>
    </ContextMenu>
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
  methods: {
    async handleContextClicked(name) {
      if (name === 'delete') {
        const res = await this.$nApi.post('/oss/removeBucket', {
          bucketName: this.name,
        });
        if (!res) {
          return;
        }
        this.$message.success(this.$t('deleteSuccess'));
        this.$bus.$emit('oss-bucket-deleted', this.name);
      }
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
