/* 此文件未使用，只是为了让idea可以识别实际位置 */
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  resolve: {
    alias: {
      '@': resolve('src'),
      '@hui1.0': resolve('hui-component/src'),
      '@materials': resolve('materials'),
      '@examples': resolve('examples'),
      '@packages': resolve('packages'),
    }
  }
}
