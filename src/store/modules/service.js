/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
const state = {
  available: false,
  heartbeat: false,
  pluginInfo: null,
};

const mutations = {
  setServiceStatus(state, status) {
    state.available = status;
    if (status) {
      state.heartbeat = true;
    }
  },
  setHeartbeat(state, status) {
    state.heartbeat = status;
  },
  setPluginInfo(state, info) {
    state.pluginInfo = info;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
