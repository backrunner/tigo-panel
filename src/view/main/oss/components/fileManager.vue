<template>
  <div class="fmanager">
    <div class="fmanager-header">
      <div class="fmanager-nav">
        <div
          :class="{
            'fmanager-nav__item': true,
            // eslint-disable-next-line max-len
            'fmanager-nav__item--current':currentRoute === currentRoutes.slice(0, index + 1).join('/'),
          }"
          v-for="(route, index) in currentRoutes"
          :key="currentRoutes.slice(0, index).join('/')"
        >
          <span
            @click="handleNavClick(currentRoutes.slice(0, index + 1).join('/'))"
            >
            {{ route }}
          </span>
          <NavRightArrow v-if="index !== currentRoutes.length - 1" />
        </div>
      </div>
      <i class="el-icon-back" v-if="currentRoute !== '/'" @click="handleBack"></i>
      <i class="el-icon-refresh-right fmanager-header__refresh" @click="handleRefresh"></i>
    </div>
    <div class="fmanager-list n-scroll" v-if="!folderEmpty" @click="handleListClick">
      <div class="fmanager-file fmanager-file--head">
        <span class="file-item__name">{{ $t('oss.fmanager.name') }}</span>
        <span class="file-item__lm">{{ $t('oss.fmanager.lastModified') }}</span>
        <span class="file-item__size">{{ $t('oss.fmanager.size') }}</span>
      </div>
      <FileItem
        v-for="file in currentDirectoryFiles"
        :key="file.key + Math.random()"
        :file="file"
        :bucket="bucket"
      />
      <div class="fmanager-list__infinite"></div>
    </div>
    <div class="fmanager-empty" v-if="folderEmpty && !refreshing">
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
        this.$set(this, 'currentRoutes', this.routes[newVal]);
        this.$set(this, 'currentFiles', this.files[newVal]);
        this.refreshCurrent();
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
      refreshing: false,
    };
  },
  computed: {
    folderEmpty() {
      return !this.currentDirectoryFiles.length;
    },
  },
  created() {
    this.$bus.$on('oss-file-deleted', this.handleFileDeleted);
    this.$bus.$on('oss-file-refresh', this.handleRefresh);
  },
  beforeDestroy() {
    this.$bus.$off('oss-file-deleted', this.handleFileDeleted);
    this.$bus.$off('oss-file-refresh', this.handleRefresh);
  },
  methods: {
    refreshCurrent() {
      const currentRoute = this.currentRoutes.join('/');
      this.$set(this, 'currentRoute', currentRoute);
      this.setCurrentFiles(currentRoute);
    },
    setCurrentFiles(route) {
      if (!this.currentFiles[route]) {
        this.$set(this.currentFiles, route, []);
      }
      this.$set(this, 'currentDirectoryFiles', this.currentFiles[route]);
      if (!this.currentDirectoryFiles.length) {
        this.listObjects({ refresh: true });
      }
    },
    async listObjects({ refresh, startAt }) {
      if (refresh) {
        if (this.refreshing) {
          return;
        }
        this.refreshing = true;
      }
      const prefix = this.currentRoutes.join('/').replace(/\/+/, '') || '/';
      let res;
      try {
        res = await this.$pApi.get('/oss/listObjects', {
          params: {
            bucketName: this.bucket,
            prefix,
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
        if (refresh) {
          this.currentDirectoryFiles.splice(0, this.currentDirectoryFiles.length);
          this.refreshing = false;
        }
        return;
      }
      if (refresh) {
        this.currentDirectoryFiles.splice(0, this.currentDirectoryFiles.length);
        this.currentDirectoryFiles.push(...res.data.data);
        this.refreshing = false;
      } else {
        this.currentDirectoryFiles.push(...res.data.data);
      }
    },
    handleListClick(e) {
      for (let i = 0; i < e.path.length; i++) {
        const el = e.path[i];
        if (!el || !el.classList) {
          continue;
        }
        if (el.classList.contains('fmanager-file')) {
          if (el.dataset.directory === 'true') {
            this.currentRoutes.push(el.dataset.name);
            this.refreshCurrent();
          }
          break;
        }
      }
    },
    async handleRefresh() {
      this.listObjects({ refresh: true });
    },
    async handleNavClick(route) {
      if (route === this.currentRoute) {
        return;
      }
      for (let i = 0; i < this.currentRoutes.length; i++) {
        if (this.currentRoutes.slice(0, i + 1).join('/') === route) {
          this.currentRoutes.splice(i + 1);
          this.refreshCurrent();
          return;
        }
      }
    },
    async handleBack() {
      if (this.currentRoutes.length > 1) {
        this.currentRoutes.pop();
      }
      this.refreshCurrent();
    },
    async handleFileDeleted(bucket, key) {
      if (bucket === this.bucket) {
        const idx = this.currentDirectoryFiles.findIndex((item) => item.key === key);
        if (idx < 0) {
          return;
        }
        this.currentDirectoryFiles.splice(idx, 1);
        if (!this.currentDirectoryFiles.length) {
          this.recursiveCheckEmpty();
        }
      }
    },
    async recursiveCheckEmpty() {
      if (this.currentRoutes.length <= 1) {
        return;
      }
      this.currentRoutes.pop();
      this.refreshCurrent();
      await this.listObjects({ refresh: true });
      this.$forceUpdate();
      await this.$nextTick();
      if (!this.currentDirectoryFiles.length) {
        this.recursiveCheckEmpty();
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
    padding: 10px 16px;
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
      transition: color 100ms ease;
      justify-content: flex-end;
      margin-left: 10px;
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
