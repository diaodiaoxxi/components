import './styles/index.scss'
import { PREFIX as prefix } from './config'
import SelectTreeBody from './src/selectTreeBody'

SelectTreeBody.install = function (Vue) {
  Vue.component(`${prefix}SelectTree`, SelectTreeBody)
}

export default SelectTreeBody
