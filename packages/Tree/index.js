import './styles/index.scss'
import Tree from './src/Tree'
import TreeNode from './src/TreeNode'
import { PREFIX as prefix } from './config'
export {
  Tree,
  TreeNode
}

Tree.install = function (Vue) {
  Vue.component(`${prefix}Tree`, Tree)
  Vue.component(`${prefix}TreeNode`, TreeNode)
}

export default Tree
