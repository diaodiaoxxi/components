import PropTypes from '@hui/shared-utils/vue-types'

export const TableProps = {
  data: PropTypes.array.def([]),
  columns: PropTypes.array.def([]),
  size: PropTypes.oneOf(['default', 'middle', 'small', 'large']), // size
  width: PropTypes.sNumber, // 宽度
  height: PropTypes.sNumber, // 高度
  stripe: PropTypes.bool.def(false), // 斑马条纹
  border: PropTypes.bool.def(true),
  showHeader: PropTypes.bool.def(true), // 是否显示表头
  highlightRow: PropTypes.bool.def(true), // 是否支持高亮选中的行，即单选
  rowClassName: PropTypes.func.def(() => { return '' }), // 行的 className 的回调方法
  noDataText: PropTypes.string.def('暂无数据'), // 数据为空时显示的提示内容
  noFilteredDataText: PropTypes.string.def('暂无筛选结果'), // 筛选数据为空时显示的提示内容
  disabledHover: PropTypes.bool.def(false), // 禁用鼠标悬停时的高亮
  canDrag: PropTypes.bool.def(false), // 是否可以拖拽
  // canDragFixed: PropTypes.bool.def(false), // 左列固定列可以拖动
  canMove: PropTypes.bool.def(false), // 表格是否可拖动,改变表格列顺序
  // rowSelect: PropTypes.bool.def(true), // 多选时是否支持点击行选中
  rowSelectOnly: PropTypes.bool.def(false), // 多选时是否支持点击行只选中，再次点击不进行反选
  loading: PropTypes.bool.def(false), // 表格是否加载中
  headAlgin: PropTypes.oneOf(['default', 'left', 'center', 'right']), // 表头文字显示位置
  bodyAlgin: PropTypes.oneOf(['default', 'left', 'center', 'right']), // 表格体文字显示位置
  // selectOption: PropTypes.bool.def(false),
  showTitle: PropTypes.bool.def(false), // 是否显示title（只在开启ellipsis后有效）
  //    lastColWidth: PropTypes.sNumber.def(80), //列宽拖动时有效，表示最后一列在变小时的最小宽度
  minDragWidth: PropTypes.sNumber.def(30), // table宽度拖动时，列最小可拖动宽度
  // patibleHeight: PropTypes.bool.def(false), //table设置固定列和固定高度时，table总高度加上了滚动条高度，设置此属性去掉多余滚动条高度
  multiLevel: PropTypes.array.def(null), // 提供table组件多级表头
  summationData: PropTypes.array.def([]), // 汇总之后的一条数据,格式参考data,需在column中开启isSum属性
  maxHeight: PropTypes.sNumber, // 设置表格的最大高度，不超过最大高度时自适应，超出后出现滚动条,暂无数据时高度为最大高度
  notSort: PropTypes.bool.def(false), // data（数据）发生变化时，数据不进行重新排序
  fixedAutoHeight: PropTypes.bool.def(true), // 表格设置固定高度，当数据内容少于表格高度时，冻结列区域高度自适应
  notSetWidth: PropTypes.bool.def(false), // 表格宽度根据内容宽度自适应，且内容不换行，只在当前列不设置宽度时有效
  autoHeadWidth: PropTypes.bool.def(false), // 根据表头自适应表格宽度
  // 设置点击高亮选中和多选不高亮，clickToSelect与highlight-row不同时使用(highlight-row表示单选，不适用)
  // clickToSelect: PropTypes.bool.def(false),
  // data中默认添加_checked属性记录当前选中状态，注：如初始化有默认选中项（_checked为true）当选中项改变时，也会同步当前选中状态
  dataCheckedProp: PropTypes.bool.def(false),
  // ctrSelection: PropTypes.bool.def(false), // 仅开启highlight-row时支持ctrl和shift多选
  closeExpandResize: PropTypes.bool.def(false), // 关闭展开过程中重新resize功能
  disabledExpand: PropTypes.bool.def(false), // 禁用展开功能
  minColWidth: PropTypes.number.def(80), // table自适应时，列的最小宽度，column当列未设置width时生效
  isMulitSort: PropTypes.bool.def(false), // 多列排序
  clickHeadSort: PropTypes.bool.def(false), // 点击单元格头部排序
  noDataHeight: PropTypes.sNumber,
  // adaptiveNoDataHeight: PropTypes.bool.def(false)
  loadingText: PropTypes.string.def('加载中'), // 自定义表格加载中文本
  loadData: PropTypes.func.def(() => {}), // 异步加载方法
  // 新增属性
  // minWidth: PropTypes.sNumber.def(80), // 单元格伸缩最小宽度单元格伸缩最小宽度
  // spanMethod: PropTypes.func.def(() => {}), // 合并单元格
  titleEllipsis: PropTypes.bool.def(true), // 表头缩略
  headSelection: PropTypes.bool.def(true), // 表头多选框
  showEditInput: PropTypes.bool.def(false), // 是否默认显示编辑框
  checkStrictly: PropTypes.bool.def(false), // 选中联动
  // bigData: PropTypes.object.def({ size: 32, keeps: 10 }),
  itemHeight: PropTypes.sNumber.def(32),
  editType: PropTypes.string.def('disEdit'),
}
