/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
const state = {
  tabs: [],
  activatedTab: null,
  cannotClose: {},
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
    state.activatedTab = id;
    window.localStorage.setItem('nav', {
      uid,
      tabs: state.tabs,
    });
  },
  closeTab(state, { uid, id }) {
    const idx = state.tabs.findIndex((item) => item.id === id);
    if (idx < 0) {
      return;
    }
    state.cannotClose[state.tabs[idx].id] = null;
    state.tabs.splice(idx, 1);
    window.localStorage.setItem('nav', {
      uid,
      tabs: state.tabs,
    });
  },
  setActivateTab(state, id) {
    state.activatedTab = id;
  },
  setCannotClose(state, { path, status }) {
    const idx = state.tabs.findIndex((item) => item.path === path);
    if (idx < 0) {
      return;
    }
    state.cannotClose[state.tabs[idx].id] = status;
  },
  recover(state, tabs) {
    state.tabs = tabs;
  },
};

const getters = {
  getTabIdx: (state) => (id) => {
    return state.tabs.findIndex((item) => item.id === id);
  },
  getTabPath: (state) => (id) => {
    const idx = state.tabs.findIndex((item) => item.id === id);
    if (idx < 0) {
      return null;
    }
    return state.tabs[idx].path;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  getters,
};
