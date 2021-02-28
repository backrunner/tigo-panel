/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
const state = {
  uploading: [],
  policy: {},
};

const mutations = {
  addUploading(state, record) {
    Object.assign(record, {
      status: 'uploading',
    });
    state.uploading.push(record);
  },
  updateUploadProgress(state, { bucket, key, progress }) {
    const idx = state.uploading.findIndex((item) => item.bucket === bucket && item.key === key);
    if (idx < 0) {
      return;
    }
    state.uploading[idx].progress = progress;
    if (progress >= 100) {
      state.uploading[idx].status = 'success';
    }
  },
  setUploadStatus(state, { bucket, key, status }) {
    const idx = state.uploading.findIndex((item) => item.bucket === bucket && item.key === key);
    if (idx < 0) {
      return;
    }
    if (status === 'failed') {
      state.uploading[idx].progress = 0;
    }
    state.uploading[idx].status = status;
  },
  setPolicy(state, { bucket, policy }) {
    state.policy[bucket] = policy || {};
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
