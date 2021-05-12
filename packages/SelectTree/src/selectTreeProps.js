import { PropTypes } from '@hui/shared-utils'

const defaultPropsValue = {
  treeData: [],
  checkStrictly: false,
  defaultExpandAll: false,
  itemHeight: 30,
  showCheckedStrategy: 'SHOW_ALL',
  showTitle: false,
  virtual: false,
  filterType: 'filter',
}

const treeProps = {
  treeData: PropTypes.array,
  /* 展开指定的树节点 sync */
  // expandedKeys: PropTypes.array,
  /* 初始化默认展开所有树节点 */
  defaultExpandAll: PropTypes.bool,
  /* 初始化默认暂开几级树节点，优先级：defaultExpandAll >  expandLevel */
  expandLevel: PropTypes.sNumber,
  /* --------------- 一期不开放 --------------- */
  /* 异步加载数据 */
  /* load-data */
  // loadData: PropTypes.func,
  /* 自定义节点内容 */
  // render: PropTypes.func,

  /* 节点的title文字最大宽度，当文本超出显示省略号，鼠标悬浮显示全部文本 */
  // titleMaxWidth: PropTypes.sNumber,
  /* 自定义图标 */
  // renderIcon: PropTypes.func,
  /* --------------- 一期不开放 --------------- */

  /* checkbox 级联 父子节点选中状态不再关联 */
  checkStrictly: PropTypes.bool,
  /* 按需筛选树节点（高亮），返回 true */
  filterNodeMethod: PropTypes.func,
  /* tree 每个item的高度（包括加上margin） */
  itemHeight: PropTypes.sNumber,
  /* v-model 变量显示的值的策略方式 */
  showCheckedStrategy: PropTypes.string,
  /* 是否开启文本的鼠标提示， 若想要个性化定义提示文本，搭配renderTextTips使用 */
  showTitle: PropTypes.bool,
  /* 自定义title内容 */
  renderTextTips: PropTypes.oneOfType([Function, String, Array]),
  /*  大数据场景下，是否开启虚拟滚动 */
  virtual: PropTypes.bool,
  /* 设置当isTreeFilter=true时，设置filter方式选择，filterType: search(检索)、filter(默认，真实过滤树) */
  filterType: PropTypes.string,

}

export {
  defaultPropsValue,
  treeProps,
}

export default treeProps
