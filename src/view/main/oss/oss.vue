<template>
  <Page>
    <div class="page-main oss">
      <BucketList :listData="buckets" :selected="selected" />
      <div class="oss-main" v-if="!showEmpty"></div>
      <div class="oss-main oss-empty" v-else>
        <div class="oss-empty__icon">
          <tigoGear />
        </div>
      </div>
      <div class="clearfix"></div>
    </div>
  </Page>
</template>

<script>
import Page from '../layout/components/page';
import BucketList from './components/bucketList';
import tigoGear from '@/common/icon/tigoGear';

export default {
  components: {
    Page,
    BucketList,
    tigoGear,
  },
  data() {
    return {
      selected: null,
      buckets: ['aaaa', 'bbbb', 'cccc'],
    };
  },
  computed: {
    showEmpty() {
      return !this.selected;
    },
  },
};
</script>

<style lang="less">
@oss-list-width: 260px;

.oss {
  &-list {
    width: @oss-list-width;
    height: 100%;
    float: left;
    background: #2e2e2e;
    box-shadow: 2px 0px 0px #252525;
    position: relative;
    .n-scroll::-webkit-scrollbar-track {
      background-color: #2e2e2e;
    }
    .n-scroll::-webkit-scrollbar-corner {
      background-color: #2e2e2e;
    }
  }
  &-main {
    width: calc(100% - @oss-list-width);
    float: right;
    box-sizing: border-box;
  }
  &-empty {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    &__icon {
      width: 268px;
      transform: translateY(-5%);
    }
  }
}
</style>
