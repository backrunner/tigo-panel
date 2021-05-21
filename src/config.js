const getConfig = () => {
  return process.env.NODE_ENV === 'dev'
    ? {
      https: false,
      host: 'localhost:24232',
      base: '/api',
    }
    : {
      https: true,
      host: 'api.tigo.pwp.app',
      publicHost: 'public.tigo.pwp.app',
      base: '',
    };
};

export default getConfig();
