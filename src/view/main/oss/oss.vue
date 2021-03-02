<template>
  <Page>
    <div class="page-main oss">
      <BucketList
        :listData="buckets"
        :selected="selected"
        @added="handleNewBucketAdded"
        @item-click="handleListItemClick"
      />
      <div class="oss-main" v-if="!showEmpty">
        <Explorer :bucket="selected" @upload="openUpload" @open-settings="openSettings" />
      </div>
      <div class="oss-main oss-empty" v-else>
        <div class="oss-empty__icon">
          <tigoGear />
        </div>
      </div>
      <div class="clearfix"></div>
      <Uploader ref="uploader" @upload="doUpload" :list="uploading" />
      <BucketSettings ref="settings" :bucket="selected" @policy-updated="handlePolicyUpdated" />
    </div>
  </Page>
</template>

<script>
import Page from '../layout/components/page';
import BucketList from './components/bucketList';
import Explorer from './components/explorer';
import Uploader from './components/uploader';
import BucketSettings from './components/bucketSettings';
import tigoGear from '@/common/icon/tigoGear';
import { mapMutations, mapState } from 'vuex';

export default {
  components: {
    Page,
    BucketList,
    Explorer,
    Uploader,
    BucketSettings,
    tigoGear,
  },
  data() {
    return {
      selected: null,
      buckets: null,
    };
  },
  computed: {
    ...mapState('oss', ['uploading', 'policy']),
    showEmpty() {
      return !this.selected;
    },
  },
  created() {
    this.fetchBuckets();
    const queryBucket = this.$route.query?.bucket;
    if (queryBucket) {
      this.setSelected(queryBucket);
    }
    // listen event
    this.$bus.$on('oss-bucket-deleted', this.handleBucketDeleted);
  },
  beforeDestroy() {
    this.$bus.$off('oss-bucket-deleted', this.handleBucketDeleted);
  },
  methods: {
    ...mapMutations('oss', [
      'addUploading',
      'updateUploadProgress',
      'setUploadStatus',
      'setPolicy',
      'updatePolicy',
    ]),
    async fetchBuckets() {
      const res = await this.$nApi.get('/oss/listBuckets');
      if (!res) {
        return;
      }
      this.buckets = res.data.data;
      if (this.selected && !this.buckets.includes(this.selected)) {
        this.selected = null;
      }
    },
    setSelected(bucketName) {
      this.selected = bucketName;
      if (this.$route.query?.bucket !== bucketName) {
        this.$router.replace({
          query: {
            bucket: bucketName,
          },
        });
      }
      this.fetchPolicy(bucketName);
    },
    async fetchPolicy(bucket) {
      let res;
      try {
        res = await this.$pApi.get('/oss/getBucketPolicy', {
          params: {
            bucketName: bucket,
          },
        });
      } catch {
        return;
      }
      if (res && res.data.data) {
        this.setPolicy({ bucket, policy: res.data.data });
      }
    },
    handleListItemClick(bucketName) {
      if (bucketName === this.selected) {
        return;
      }
      this.setSelected(bucketName);
    },
    handleNewBucketAdded(bucketName) {
      this.buckets.push(bucketName);
      this.setSelected(bucketName);
    },
    openUpload({ prefix }) {
      this.$refs.uploader.open(prefix);
    },
    doUpload({ prefix, files, timestamp, force }) {
      const bucketName = this.selected;
      files.forEach(async (file) => {
        let fixedPrefix;
        if (prefix) {
          fixedPrefix = prefix.startsWith('/') ? prefix.substr(1) : prefix;
        } else {
          fixedPrefix = '';
        }
        const key = `${fixedPrefix}${file.name}`;
        const formData = new FormData();
        formData.append('bucketName', bucketName);
        formData.append('key', key);
        formData.append('file', file);
        formData.append('force', force);
        this.addUploading({
          bucket: bucketName,
          key,
          timestamp,
        });
        this.$pApi
          .post('/oss/putObject', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (e) => {
              if (e.lengthComputable) {
                this.onUploadProgress(e, bucketName, key, timestamp);
              }
            },
          })
          .then(() => {
            this.setUploadStatus({ bucket: bucketName, key, timestamp, status: 'success' });
          })
          .catch((err) => {
            const { message } = err.response.data;
            this.$message.error(`上传失败${message ? `: ${message}` : ''}`);
            this.setUploadStatus({ bucket: bucketName, key, timestamp, status: 'failed' });
          });
      });
    },
    onUploadProgress(e, bucket, key, timestamp) {
      const progress = (e.loaded / e.total) * 100;
      this.updateUploadProgress({ bucket, key, progress, timestamp });
    },
    openSettings() {
      this.$refs.settings.open(this.policy[this.selected]);
    },
    handlePolicyUpdated(bucket, policy) {
      this.updatePolicy({ bucket, policy });
    },
    handleBucketDeleted(name) {
      const idx = this.buckets.findIndex((item) => item === name);
      if (idx < 0) {
        return;
      }
      this.buckets.splice(idx, 1);
      if (name === this.selected) {
        this.selected = null;
      }
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
    height: 100%;
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
