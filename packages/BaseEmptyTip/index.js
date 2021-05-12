
import './styles/index.scss'
import BaseEmptyTip from './src/BaseEmptyTip.jsx'

BaseEmptyTip.install = (Vue) => {
  Vue.component(BaseEmptyTip.name, BaseEmptyTip)
}

export default BaseEmptyTip
