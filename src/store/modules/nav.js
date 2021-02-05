/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
const state = {
  tabs: [],
  activatedTab: null,
};

const mutations = {
  openTab(state, { uid, name, path }) {
    const idx = state.tabs.findIndex((item) => item.path === path);
    if (idx >= 0) {
      state.activatedTab = state.tabs[idx].id;
      return;
    }
    const id = (Math.random() + new Date().valueOf()).toString();
    state.tabs.push({
      id,
      name,
      path,
    });
    this.activatedTab = id;
    window.localStorage.setItem('nav', {
      uid,
      tabs: state.tabs,
    });
  },
  closeTab(state, { uid, id }) {
    const idx = state.tabs.findIndex((el) => el.id === id);
    state.tabs = state.tabs.splice(idx, 1);
    window.localStorage.setItem('nav', {
      uid,
      tabs: state.tabs,
    });
  },
  setActivateTab(state, id) {
    state.activatedTab = id;
  },
  recover(state, tabs) {
    state.tabs = tabs;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
