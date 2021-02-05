/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
const initLocale = () => {
  if (navigator.language === 'zh-CN') {
    return 'cn';
  } else {
    return 'en';
  }
};

const locales = ['cn', 'en'];

const state = {
  locale: initLocale(),
};

const mutations = {
  setLocale(state, locale) {
    if (!locales.includes(locale)) {
      state.locale = 'en';
    } else {
      state.locale = locale;
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
