const glob = require('fast-glob')
const path = require('path')
const fs = require('fs')
const mapValues = require('lodash/mapValues')
const logdown = require('logdown')

process.env.NODE_DEBUG = 'example'
const console = logdown('example')
console.log(process.env.NODE_DEBUG)

const examplesPath = path.resolve(__dirname, '../examples')
const entries = glob.sync(['**/*.json'], {
  cwd: examplesPath
})
console.log('示例文件地址', entries)

// console.log(entries)
entries.map(item => {
  if (!item.includes('_')) {
    return
  }
  const data = require(path.resolve(examplesPath, item))
  const parentDir = path.dirname(item)
  mapValues(data, function (info) {
    console.log(info.file, info.description, parentDir, info)
    // insertZhName(parentDir, info.file, info.description || '')
  })
})

function insertZhName (parentDir = '/Demos/Select', file = 'bigData.vue', zhName = '大数据支持') {
  const filePath = path.join(examplesPath, parentDir, 'src', file)
  if (!fs.existsSync(filePath)) {
    return
  }
  fs.readFile(filePath, function (err, data) {
    if (err) throw err
    const dataArray = data.toString().split('\n')
    const hasZhName = dataArray.find(item => item.includes('zhName'))
    const vueHead = dataArray.findIndex(item => item.includes('export'))
    if (!hasZhName) {
      dataArray.splice(vueHead + 1, 0, `zhName:"${zhName}",`)
      const content = dataArray.join('\n')
      fs.writeFileSync(filePath, content, 'utf8')
    }
  })
}
