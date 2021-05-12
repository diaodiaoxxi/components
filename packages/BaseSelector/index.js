import './styles/index.scss'
import { PREFIX as prefix } from './src/config'
import baseSelector from './src/Selector'
// 兼容 IE CustomEvent
(function () {
  if (typeof window.CustomEvent === 'function') return false // If not IE

  function CustomEvent (event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
})()

baseSelector.install = function (Vue) {
  Vue.component(`${prefix}Select`, baseSelector)
}

export default baseSelector
