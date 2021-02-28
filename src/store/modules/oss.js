/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
const state = {
  uploading: [],
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
  },
  setUploadStatus(state, { bucket, key, status }) {
    const idx = state.uploading.findIndex((item) => item.bucket === bucket && item.key === key);
    if (idx < 0) {
      return;
    }
    state.uploading[idx].status = status;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
