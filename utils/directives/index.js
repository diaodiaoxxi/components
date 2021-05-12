import Wave from './waves'
import Drag from './drag'

import Clickoutside from './clickoutside'
// import ClickOutsideX from 'v-click-outside-x'

// 处理组件 transfer 相关问题的指令
import transferClass from './transfer-class'
import transferScroll from './transfer-scroll'

const directives = {
  Wave,
  Drag,
  Clickoutside,
  // ClickOutsideX: ClickOutsideX.directive,
  transferClass,
  transferScroll,
}

export default directives

export {
  Wave,
  Drag,
  Clickoutside,
  // ClickOutsideX,
  transferClass,
  transferScroll,
}
