<template>
  <div class="fmanager-file" :data-name="file.name" :data-directory="file.isDirectory" v-context>
    <span class="file-item__name">
      <i class="el-icon-folder" v-if="showDirIcon"></i>
      {{ displayName }}
    </span>
    <span class="file-item__lm">{{ displayLastModified }}</span>
    <span class="file-item__size">{{ displaySize }}</span>
    <ContextMenu @item-clicked="handleContextClick">
      <ContextMenuItem name="download" v-if="showDownload">
        {{ $t('oss.fmanager.download') }}
      </ContextMenuItem>
      <ContextMenuItem name="copyLink" v-if="showCopyLink">
        {{ $t('oss.fmanager.copyLink') }}
      </ContextMenuItem>
      <ContextMenuItem name="delete" v-if="showDelete">{{ $t('delete') }}</ContextMenuItem>
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
  data() {
    return {
      currentPolicy: {},
    };
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (
        mutation.type === 'oss/setPolicy'
        || mutation.type === 'oss/updatePolicy'
      ) {
        this.currentPolicy = state.oss.policy[this.bucket] || {};
      }
    });
  },
  computed: {
    ...mapState({
      scopeId: (state) => state.auth.scopeId,
    }),
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
    showDownload() {
      return !this.file?.isDirectory;
    },
    showCopyLink() {
      return this.currentPolicy?.public && !this.file?.isDirectory;
    },
    showDelete() {
      return !this.file?.isDirectory;
    },
  },
  methods: {
    async handleContextClick(name) {
      if (name === 'download') {
        this.$message.success(this.$t('oss.fmanager.downloadStart'));
        const res = await this.$nApi.get('/oss/getObject', {
          params: {
            bucketName: this.bucket,
            key: this.file.key,
          },
          responseType: 'blob',
        });
        const fileURL = window.URL.createObjectURL(new Blob([res.data]));
        const fileLink = document.createElement('a');
        fileLink.href = fileURL;
        fileLink.setAttribute('download', this.file.name);
        fileLink.click();
      } else if (name === 'copyLink') {
        if (navigator.clipboard) {
          const prefix = this.$apiConfig.https ? 'https://' : 'http://';
          const url = `${prefix}${this.$apiConfig.host}/storage/${this.scopeId}/${this.bucket}/${this.file.key}`;
          navigator.clipboard.writeText(url);
        }
        this.$message.success(this.$t('oss.fmanager.copied'));
      } else if (name === 'delete') {
        try {
          await this.$pApi.post('/oss/removeObject', {
            bucketName: this.bucket,
            key: this.file.key,
          });
          this.$bus.$emit('oss-file-deleted', this.bucket, this.file.key);
          this.$message.success(this.$t('deleteSuccess'));
        } catch {
          this.$message.error(this.$t('deleteFailed'));
        }
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
