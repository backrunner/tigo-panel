<template>
  <div class="fmanager">
    <div class="fmanager-header">
      <div class="fmanager-nav">
        <div
          :class="{
            'fmanager-nav__item': true,
            'fmanager-nav__item--current': currentRoute === route,
          }"
          v-for="(route, index) in currentRoutes"
          :key="route"
        >
          <span>{{ route }}</span>
          <NavRightArrow v-if="index !== currentRoutes.length - 1" />
        </div>
      </div>
      <i class="el-icon-refresh-right"></i>
    </div>
    <div class="fmanager-list n-scroll" v-if="!folderEmpty" @dblclick="handleListDblClick">
      <div class="fmanager-file fmanager-file--head">
        <span class="file-item__name">{{ $t('oss.fmanager.name') }}</span>
        <span class="file-item__lm">{{ $t('oss.fmanager.lastModified') }}</span>
        <span class="file-item__size">{{ $t('oss.fmanager.size') }}</span>
      </div>
      <FileItem v-for="file in currentDirectoryFiles" :key="file.key" :file="file" />
      <div class="fmanager-list__infinite"></div>
    </div>
    <div class="fmanager-empty" v-else>
      <span>{{ $t('oss.fmanager.empty') }}</span>
    </div>
  </div>
</template>

<script>
import NavRightArrow from './navRightArrow';
import FileItem from './fileItem';

export default {
  props: {
    bucket: String,
  },
  components: {
    NavRightArrow,
    FileItem,
  },
  watch: {
    bucket: {
      immediate: true,
      handler(newVal) {
        if (!this.routes[newVal]) {
          this.$set(this.routes, newVal, []);
          this.routes[newVal].push('/');
        }
        if (!this.files[newVal]) {
          this.$set(this.files, newVal, {});
        }
        this.currentRoutes = this.routes[newVal];
        this.currentFiles = this.files[newVal];
      },
    },
    currentRoutes: {
      immediate: true,
      deep: true,
      handler() {
        this.currentRoute = this.currentRoutes[this.currentRoutes.length - 1];
      },
    },
    currentRoute: {
      immediate: true,
      handler(newVal) {
        if (!this.currentFiles[newVal]) {
          this.$set(this.currentFiles, newVal, []);
        }
        this.currentDirectoryFiles = this.currentFiles[newVal];
        if (!this.currentDirectoryFiles.length) {
          this.listObjects();
        }
      },
    },
  },
  data() {
    return {
      routes: {},
      files: {},
      currentRoutes: null,
      currentRoute: null,
      currentFiles: null,
      currentDirectoryFiles: null,
    };
  },
  computed: {
    folderEmpty() {
      return !this.currentDirectoryFiles.length;
    },
  },
  methods: {
    async listObjects(startAt) {
      let res;
      try {
        res = await this.$pApi.get('/oss/listObjects', {
          params: {
            bucketName: this.bucket,
            prefix: this.currentRoute,
            startAt: startAt?.key || null,
            startAtType: startAt?.type || null,
            pageSize: 30,
          },
        });
      } catch (err) {
        if (err.response.status !== 404) {
          const message = err.response?.data?.message;
          this.$message.error(`文件列表获取失败${message ? `: ${message}` : ''}`);
        }
        return;
      }
      this.currentDirectoryFiles.push(...res.data.data);
    },
    handleListDblClick(e) {
      if (e.target.classList.contains('fmanager-file')) {
        if (e.target.dataset.directory === 'true') {
          this.currentRoutes.push(e.target.dataset.name);
        }
      }
    },
  },
};
</script>

<style lang="less">
.fmanager {
  width: 100%;
  height: 100%;
  background: #232323;
  .n-scroll::-webkit-scrollbar-track {
    background-color: #232323;
  }
  .n-scroll::-webkit-scrollbar-corner {
    background-color: #232323;
  }
  &-header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #323232;
    user-select: none;
    padding: 10px 20px;
    .fmanager-nav {
      color: #999;
      font-size: 13px;
      line-height: 24px;
      flex: 1;
      display: flex;
      align-items: center;
      &__item {
        margin-right: 7px;
        display: flex;
        align-items: center;
        span:hover {
          cursor: pointer;
          color: var(--primary);
        }
        svg {
          width: 18px;
          height: 18px;
          margin-left: 7px;
          transform: translateY(1px);
        }
      }
      &__item--current {
        color: var(--primary);
        span:hover {
          cursor: default;
        }
      }
    }
    i {
      color: var(--primary);
      justify-content: flex-end;
      transition: color 100ms ease;
    }
    i:hover {
      color: var(--regular-text);
      cursor: pointer;
    }
  }
  &-list {
    width: 100%;
    height: calc(100% - 45px);
    max-height: calc(100% - 45px);
  }
  &-empty {
    width: 100%;
    height: calc(100% - 45px);
    max-height: calc(100% - 45px);
    color: var(--primary);
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    span {
      margin-bottom: 48px;
    }
  }
}
</style>
