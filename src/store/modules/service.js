/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
const state = {
  available: false,
  heartbeat: false,
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
};

export default {
  namespaced: true,
  state,
  mutations,
};
