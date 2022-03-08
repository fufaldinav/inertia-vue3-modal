module.exports = {
  chainWebpack: (config) => {
    config.externals({
      axios: 'axios',
      '@inertiajs/inertia': '@inertiajs/inertia',
      '@inertiajs/inertia-vue3': '@inertiajs/inertia-vue3',
    });
  },
};
