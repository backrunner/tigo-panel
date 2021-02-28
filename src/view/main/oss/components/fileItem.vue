<template>
  <div class="fmanager-file" :data-name="file.name" :data-directory="file.isDirectory" v-context>
    <span class="file-item__name">
      <i class="el-icon-folder" v-if="showDirIcon"></i>
      {{ displayName }}
    </span>
    <span class="file-item__lm">{{ displayLastModified }}</span>
    <span class="file-item__size">{{ displaySize }}</span>
    <ContextMenu @item-clicked="handleContextClick">
      <ContextMenuItem name="download" v-if="currentPolicy.public">
        {{ $t('oss.fmanager.download') }}
      </ContextMenuItem>
      <ContextMenuItem name="copyLink" v-if="currentPolicy.public">
        {{ $t('oss.fmanager.copyLink') }}
      </ContextMenuItem>
      <ContextMenuItem name="delete" v-if="!file.isDirectory">{{ $t('delete') }}</ContextMenuItem>
    </ContextMenu>
  </div>
</template>

<script>
import moment from 'moment';
import filesize from 'file-size';
import { mapState } from 'vuex';

export default {
  props: {
    file: Object,
    bucket: String,
  },
  computed: {
    ...mapState('oss', ['policy']),
    showDirIcon() {
      return !!this.file.isDirectory;
    },
    displayName() {
      return this.file.name || '';
    },
    displayLastModified() {
      if (this.file?.lastModified) {
        return moment(this.file?.lastModified).format('YYYY-MM-DD HH:mm:ss');
      }
      return '-';
    },
    displaySize() {
      if (this.file.isDirectory) {
        return '-';
      } else if (this.file.size) {
        return filesize(this.file.size).human('si');
      } else {
        return '-';
      }
    },
    currentPolicy() {
      return this.policy[this.bucket] || {};
    },
  },
  methods: {
    handleContextClick(name) {
      if (name === 'download') {
      } else if (name === 'copyLink') {
      } else if (name === 'delete') {
      }
    },
  },
};
</script>

<style lang="less">
.fmanager-file {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  font-size: 13px;
  color: var(--primary);
  border-bottom: 1px solid #323232;
  user-select: none;
  position: relative;
  .file-item__name {
    flex: 1;
    i {
      margin-right: 8px;
    }
  }
  .file-item__lm {
    width: 280px;
  }
  .file-item__size {
    width: 120px;
  }
}
.fmanager-file:hover {
  background: #2e2e2e;
}
.fmanager-file--head {
  padding: 10px 16px;
  position: sticky;
  top: 0;
  background: #232323;
  z-index: 10;
}
.fmanager-file--head:hover {
  background: #232323;
}
</style>
