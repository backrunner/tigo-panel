/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
const state = {
  avaliable: false,
};

const mutations = {
  setServiceStatus(state, status) {
    state.avaliable = status;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
