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
        <Explorer :bucket="selected" @upload="openUpload" />
      </div>
      <div class="oss-main oss-empty" v-else>
        <div class="oss-empty__icon">
          <tigoGear />
        </div>
      </div>
      <div class="clearfix"></div>
      <Uploader ref="uploader" @upload="doUpload" :list="uploading" />
    </div>
  </Page>
</template>

<script>
import Page from '../layout/components/page';
import BucketList from './components/bucketList';
import Explorer from './components/explorer';
import Uploader from './components/uploader';
import tigoGear from '@/common/icon/tigoGear';
import { mapMutations, mapState } from 'vuex';

export default {
  components: {
    Page,
    BucketList,
    Explorer,
    Uploader,
    tigoGear,
  },
  data() {
    return {
      selected: null,
      buckets: null,
    };
  },
  computed: {
    ...mapState('oss', ['uploading']),
    showEmpty() {
      return !this.selected;
    },
  },
  created() {
    this.fetchBuckets();
    const queryBucket = this.$route.query?.bucket;
    if (queryBucket) {
      this.selected = queryBucket;
    }
  },
  methods: {
    ...mapMutations('oss', ['addUploading', 'updateUploadProgress']),
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
      this.$router.replace({
        query: {
          bucket: bucketName,
        },
      });
    },
    handleListItemClick(bucketName) {
      this.setSelected(bucketName);
    },
    handleNewBucketAdded(bucketName) {
      this.buckets.push(bucketName);
      this.setSelected(bucketName);
    },
    openUpload({ prefix }) {
      this.$refs.uploader.open(prefix);
    },
    doUpload({ prefix, files, force }) {
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
          file,
        });
        try {
          await this.$pApi.post('/oss/putObject', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (e) => {
              if (e.lengthComputable) {
                this.onUploadProgress(e, bucketName, key);
              }
            },
          });
        } catch (err) {
          const { message } = err.response.data;
          this.$message.error(`上传失败${message ? `: ${message}` : ''}`);
          return;
        }
        this.$message.success('uploaded');
      });
    },
    onUploadProgress(e, bucket, key) {
      const progress = (e.loaded / e.total) * 100;
      this.updateUploadProgress({ bucket, key, progress });
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
