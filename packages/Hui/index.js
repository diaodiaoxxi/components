// import Select from '@packages/Select/index.js'
import Scrollbar from '@packages/Scrollbar/index'
import Poptip from '@packages/Poptip/index'
import Tooltip from '@packages/Tooltip/index'
import VTooltip from '@packages/Tooltip/directives/v-tooltip'

import Menu from '@packages/Menu/index'
import Row from '@packages/Row/index'
import { Button, ButtonGroup } from '@packages/Button/index'
import Radio from '@packages/Radio/index'
import Fragment from '@packages/Fragment/index'
import Form from '@packages/Form/index'
import { Tree, TreeNode } from '@packages/Tree/index'
import BaseSelector from '@packages/BaseSelector/index'
import SelectTreeBody from '@packages/SelectTree/index'

import Table from '@packages/Table/index'
import TreeGrid from '@packages/TreeGrid/index'
import DatePicker from '@packages/DatePicker/index.js'
import Spin from '@packages/Spin/index.js'
import Switch from '@packages/Switch/index.js'

import Select2 from '@packages/Select/index.js'

import Steps from '@packages/Steps/index.js'
import locale from './locale'

const vTooltip = new VTooltip()
const vTitle = new VTooltip({ titleMode: 'tooltip' })

const prefix = 'u'
const HUI = {
  Select: BaseSelector,
  /* 与BaseSelector命名冲突 */

  Select2,
  Select2Block: Select2.SelectBlock,
  Select2CheckAll: Select2.CheckAllCtrl,
  Select2AddOption: Select2.CreateOptionCtrl,
  Option: Select2.Option,
  OptionGroup: Select2.OptionGroup,
  //
  Button,
  ButtonGroup: ButtonGroup,
  Radio,
  RadioGroup: Radio.Group,
  Fragment,
  //
  Poptip,
  Tooltip,
  Row,
  Col: Row.Col,
  //
  Menu,
  Submenu: Menu.Submenu,
  CookSubmenu: Menu.CookSubmenu,
  MenuItem: Menu.MenuItem,
  MenuItemGroup: Menu.MenuItemGroup,

  Scrollbar: Scrollbar,

  //
  Tree,
  TreeNode,

  //
  SelectTree: SelectTreeBody,
  //
  Table,
  TreeGrid,
  DatePicker,
  Form,
  FormItem: Form.Item,

  Switch: Switch,
  Spin,
  Step: Steps.Step,
  Steps,

}
// console.log('NODE_ENV', process.env.NODE_ENV)
const install = function (Vue, opts = {}) {
  // TODO Local 拆分引用
  Vue.prototype.COMPONENT_PREFIX = prefix
  locale.use(opts.locale)
  locale.i18n(opts.i18n)
  Object.keys(HUI).forEach(key => {
    Vue.component(`${prefix}${key}`, HUI[key])
  })
  Vue.directive('tooltip', vTooltip)
  Vue.directive('title', vTitle)
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

HUI.install = install
export { HUI as default, prefix }
