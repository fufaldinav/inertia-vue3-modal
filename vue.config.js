module.exports = {
  chainWebpack: config => {
    config.externals({
      'axios': 'axios',
      '@inertiajs/inertia': '@inertiajs/inertia'
    })
  }
}
