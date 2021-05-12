// 根据单个组件 scss 提取 hui1.0 custom.scss 中的变量
const fs = require('fs')
const path = require('path')
const get = require('lodash/get')

const resolve = (file) => path.resolve(__dirname, file)

const scssFileName = process.argv[2] || './scss/tag.scss'

const data = fs.readFileSync(resolve(scssFileName)).toString()
const varData = fs.readFileSync(resolve('./scss/custom.scss')).toString()

const match = data.match(/\$[a-z,-]*/mg)
const matchAfter = [...new Set(match)]

const varList = matchAfter.map((v) => {
  console.log(v)
  let varMatch = varData.match(RegExp(`^\\${v}:.*;`, 'mg'))
  varMatch = get(varMatch, '0')
  console.log(varMatch)
  return varMatch
}).join('\n')

fs.writeFileSync('./_var.scss', varList, 'utf8')
