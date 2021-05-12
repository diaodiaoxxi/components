import PropTypes from '@hui/shared-utils/vue-types'

const defaultPropsValue = {
  showCheckbox: false,
  multiple: false,
  selectable: true,
  formatValue: 'id',
  formatLabel: 'title',
  checkStrictly: false,
  defaultExpandAll: false,
  blockNode: false,
  blockDirectory: false,
  isBoxRight: false,
  isTreeFilter: false,
  filterType: 'filter',
  disabled: false,
  virtual: false,
  maxHeight: 500,
  itemHeight: 30,
  onlyScroll: false,
  isString: false,
  showTitle: false,
  transferScrollOptions: {
    type: 'keep',
    disabled: false,
  },
  alwaysSelect: false,
  isTreeBody: false,
}

const treeProps = {
  treeData: PropTypes.array,
  /* 显示checkbox 复选框 */
  showCheckbox: PropTypes.bool,
  /* 文本节点多选 */
  multiple: PropTypes.bool,
  /* 文本节点是否可选中 */
  selectable: PropTypes.bool,
  /* 选中复选框的树节点 v-model */
  // checkedKeys: PropTypes.array,
  checkedKeys: PropTypes.oneOfType([String, Array]),
  /* 选中的文本节点 sync */
  /* 选中的文本节点 sync String, Number类型只是正对selectree扩展，tree本身只支持数组Array类型 */
  // selectedKeys: PropTypes.array,
  selectedKeys: PropTypes.oneOfType([String, Number, Array]),
  /* 展开指定的树节点 sync */
  expandedKeys: PropTypes.array,
  /* 根据哪个字段来控制 checkedKeys、selectedKeys、expandedKeys */
  formatValue: PropTypes.string,
  /* 根据哪个字段来显示title，包括过滤  */
  formatLabel: PropTypes.string,
  /* 初始化默认展开所有树节点 */
  defaultExpandAll: PropTypes.bool,
  /* 初始化默认暂开几级树节点，优先级：defaultExpandAll >  expandLevel */
  expandLevel: PropTypes.sNumber,
  /* 是否节点占据一行 */
  blockNode: PropTypes.bool,
  /* 是否节点沾满增一行，包括节点前面 */
  blockDirectory: PropTypes.bool,
  /* 异步加载数据 */
  loadData: PropTypes.func,
  /* 自定义节点内容 */
  render: PropTypes.func,
  /* 自定义title内容 */
  renderTextTips: PropTypes.oneOfType([Function, String, Array]),
  /* 自定义节点菜单 */
  renderMenu: PropTypes.func,
  /* checkbox复选框展示在右边 */
  isBoxRight: PropTypes.bool,
  /* checkbox 级联 父子节点选中状态不再关联 */
  checkStrictly: PropTypes.bool,
  /* 节点的title文字最大宽度，当文本超出显示省略号，鼠标悬浮显示全部文本 */
  titleMaxWidth: PropTypes.sNumber,
  /* 按需筛选树节点（高亮），返回 true */
  filterNodeMethod: PropTypes.func,
  /* 筛选树节点调用的方法的value */
  filterValue: PropTypes.oneOfType([String, Number]),
  /* 搜索时，过滤树节点 */
  isTreeFilter: PropTypes.bool,
  /* 设置当isTreeFilter=true时，设置filter方式选择，filterType: search(检索)、filter(默认，真实过滤树) */
  filterType: PropTypes.string,
  /* 将树禁用 */
  disabled: PropTypes.bool,
  /* 自定义图标 */
  renderIcon: PropTypes.func,
  /* 支持大数据 虚拟滚动 */
  virtual: PropTypes.bool,
  /* tree的最大高度，一般适用于大数据，虚拟滚动场景 */
  maxHeight: PropTypes.number,
  /* tree 每个item的高度（包括加上margin） */
  itemHeight: PropTypes.sNumber,
  /* 在个别单一数场景下，滚动树节点，不涉及checked、selected、expanded、loading等计算时,可以提高滚动的效率 */
  onlyScroll: PropTypes.bool,
  /* 数组转字符串格式 */
  isString: PropTypes.oneOfType([Boolean, Array]),
  /* 是否开启文本的鼠标提示， 若想要个性化定义提示文本，搭配renderTextTips使用 */
  showTitle: PropTypes.bool,
  /**
   * 动态配置 transfer-scroll 配置项
   * @type
   * keep: 表示dropdown下拉框在可视区域不随着滚动条滚动而关闭（超出边界上下位置自动关闭）
   * hide: 表示滚动条滚动就关闭dropdown
   * @disabled true: 表示关闭transfer-scroll这个功能
   */
  transferScrollOptions: PropTypes.object,
  /* 文本节点单选时有效（multiple=false）重复点击某节点，是否总是选中当前节点 */
  alwaysSelect: PropTypes.bool,
  /* 内部开放，针对是否作为body项在select内部使用 */
  isTreeBody: PropTypes.bool,
}

export {
  defaultPropsValue,
  treeProps,
}

export default treeProps
