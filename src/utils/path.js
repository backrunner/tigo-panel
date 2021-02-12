export const getTabPath = (path) => {
  let routePath = path;
  if (routePath.startsWith('/app')) {
    routePath = routePath.replace('/app', '');
  }
  if (routePath.includes('?')) {
    // remove query
    routePath = routePath.replace(/\?.*$/, '');
  }
  if (routePath.endsWith('/')) {
    routePath = routePath.substring(0, routePath.length - 2);
  }
  return routePath;
};

