/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
import merge from 'deepmerge';

const state = {
  uploading: [],
  policy: {},
};

const mutations = {
  addUploading(state, record) {
    Object.assign(record, {
      status: 'uploading',
    });
    state.uploading.unshift(record);
  },
  updateUploadProgress(state, { bucket, key, timestamp, progress }) {
    const idx = state.uploading.findIndex(
      (item) => item.bucket === bucket && item.key === key && item.timestamp === timestamp,
    );
    if (idx < 0) {
      return;
    }
    state.uploading[idx].progress = progress;
    if (progress >= 100) {
      state.uploading[idx].status = 'success';
    }
  },
  setUploadStatus(state, { bucket, key, timestamp, status }) {
    const idx = state.uploading.findIndex(
      (item) => item.bucket === bucket && item.key === key && item.timestamp === timestamp,
    );
    if (idx < 0) {
      return;
    }
    if (status === 'failed') {
      state.uploading[idx].progress = 0;
    } else if (status === 'success') {
      state.uploading[idx].progress = 100;
    }
    state.uploading[idx].status = status;
  },
  setPolicy(state, { bucket, policy }) {
    state.policy[bucket] = policy || {};
  },
  updatePolicy(state, { bucket, policy }) {
    state.policy[bucket] = merge(state.policy[bucket], policy);
    console.log(state.policy[bucket]);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
