/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
const state = {
  history: [],
};

const mutations = {
  setHistory(state, history) {
    state.history = history;
  },
  addHistory(state, item) {
    state.history.unshift(item);
    if (state.history.length > 100) {
      state.history.pop();
    }
  },
};

module.exports = {
  namespaced: true,
  state,
  mutations,
};
