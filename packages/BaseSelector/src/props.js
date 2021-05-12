import { PropTypes } from '@hui/shared-utils'
export default {
  /** *************************** 基础属性 *****************************/
  value: PropTypes.any.def(''),
  /* 自定义 value 对应的属性名 */
  valueKey: PropTypes.string.def('value'),
  /* 自定义 label 对应的属性名 */
  labelKey: PropTypes.string.def('label'),
  /* 可读（可复制） */
  readonly: PropTypes.bool.def(false),
  /* 禁用 （不可复制） */
  disabled: PropTypes.bool.def(false),
  /* 是否显示清除图标 */
  clearable: PropTypes.bool.def(false),
  /* 是否显示箭头; 默认true, 显示箭头 */
  isArrow: PropTypes.bool.def(true),
  /* 设置placeholder */
  placeholder: PropTypes.string.def(''),
  /* 定义 tabindx */
  tabindex: PropTypes.sNumber.def(0),
  /* 是否开启下拉框展开收起动画效果 */
  animated: PropTypes.oneOfType([Boolean, String]).def(true),

  /* head 头 showTitle */
  // showTitle: PropTypes.bool.def(false),

  /**
   * 是否开启赋值文本，选中下拉项
   * 注意：开启下拉项，filterable=true, 粘贴不会产生过滤
   */
  selectPaste: PropTypes.bool.def(false),
  /**
    * 触发表单校验情况
    * initValue 初始化赋值
    * valueChange 手动赋值 value值改变
    * selected 选中option改变 value
    * blur
    * focus
    */
  // [ 'initValue', 'valueChange', 'blur', 'focus' ]
  validate: PropTypes.oneOfType([Array, Boolean]).def(true), // validate

  /** *************************** 下拉弹窗 *****************************/
  placement: PropTypes.oneOf([
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end'
  ]).def('bottom-start'),
  /* 是否开启表头的title提示文案 */
  showTitle: PropTypes.bool.def(false),
  /**
   * Boundaries used by the modifier. Can be scrollParent, window, viewport or any DOM element.
   * 自适应面板方向 默认边界为window窗口  参考 popper.js boundariesElement
  */
  autoPlacement: PropTypes.oneOfType([String, Object, Boolean]).def(true),
  /* 设置下拉框宽度，当设置widthAdaption，则变为最小宽度 */
  dropWidth: PropTypes.sNumber.def(0),
  /* 下拉框的宽度是否随着内容自适应，以selector设置的宽度为最小宽度，最大宽度取输入框宽度与maxDropWidth的最大值 */
  widthAdaption: PropTypes.bool.def(false),
  /* 下拉框的自适应时设置的最大宽度，实际值会取输入框宽度与maxDropWidth的最大值 */
  maxDropWidth: PropTypes.sNumber.def(0),
  /* 将元素放在外部 */
  transfer: PropTypes.bool.def(false),

  /** *************************** loading *****************************/
  /* 下拉面板展开loading（若想要自定义loading,可以在slot插槽里面使用） */
  loading: PropTypes.bool.def(false),

  /** *************************** value 特殊格式化 *****************************/
  /* 返回的方法 数据以对象形式返回 */
  // labelInValue: PropTypes.bool.def(false),
  /**
   * 下拉框value为'-1'选项和其他选项需要互斥时使用 （为true时互斥）
   * specialIndex: PropTypes.bool.def(false),
   * 双向绑定输入‘0’转化为空值，输出空值转化为‘0’(仅单选有效)
   * */
  // zeroToNull: PropTypes.bool.def(false),
  /* 只在多选模式下使用,将多选时双向绑定的变量的格式变为String类型，多个选项用','隔开 */
  isString: PropTypes.bool.def(false),

  /** *************************** 过滤筛选定位 *****************************/
  filterable: PropTypes.bool.def(false),
  /* 自定义下拉列表为空时的文本 */
  notFoundText: PropTypes.string,

  // 写入全选参数 与 ctrl props isSelectFilter 全选时是否全选过滤后的数据
  isSelectFilter: PropTypes.deprecated(
    '[HUI warn]:Select isSelectFilter 属性已停用 请使用 select SelectCheckAll 插槽组件 isSelectFilter !'
  ),
  // TODO 模糊匹配 option.label首拼,因为涉及汉字字库改为自定义指令

  /** *************************** 多选 *****************************/
  /* 多选 */
  multiple: PropTypes.bool.def(false),
  /* head头 tag显示头 textTag交互暂时去除不支持 */
  // multHeadType: PropTypes.oneOf(['tag', 'textTag', 'text']).def('tag'),
  multHeadType: PropTypes.oneOf(['tag', 'text']).def('tag'),

  tagKey: PropTypes.string.def('label'),

  /* TODO 表示用户在多选情况下，限制用户选择的个数 */
  // multipleNumber: PropTypes.sNumber,

  // maxTagCount: PropTypes.sNumber,
  /* 默认最多显示多少个选项后，开始 显示 收起选项  */
  // TODO 期望根据width宽度计算得出
  maxTagCount: PropTypes.sNumber.def(1),
  /* 头显示更多tag时，考虑到性能问题，自定义maxTagNumber个节点后，收起的tag不hover显示 */
  maxTagNumber: PropTypes.sNumber.def(200),

  /* 设置隐藏 tag 时显示的内容 */
  maxTagPlaceholder: PropTypes.oneOfType([String, Function]),

  /** * isBackClear 输入框是否可通过backspace按键清除选中项 (仅多选有效) 默认开启 */
  isBackClear: PropTypes.bool.def(true),

  moreTagPopTipProps: PropTypes.object.def({
    popClassName: '',
    zIndex: 1100,
  }), // 更多tag,气泡属性,文档上不开放给用户

  specialIndex: PropTypes.deprecated(
    '[HUI warn]:Select specialIndex 属性已停用,请使用 initRadioValues!'
  ),
  specialValue: PropTypes.deprecated(
    '[HUI warn]:Select specialValue 属性已停用,请使用 update:radioValue 事件或 :radioValue.sync 获取!'
  ),
  // 改为插槽组件实现
  showBottom: PropTypes.deprecated(
    '[HUI warn]:Select 请参考 select ctrl 插槽示例!'
  ),
  // 改为插槽组件实现
  checkToHead: PropTypes.deprecated(
    '[HUI warn]:Select 请参考 select ctrl 插槽示例!'
  ),
  // 改为插槽组件实现 是否显示全选反选快捷方式，只在多选模式下使用
  isCheckall: PropTypes.deprecated(
    '[HUI warn]:Select 请参考 select ctrl 插槽示例!'
  ),
  // hidMult 隐藏多选框的多选模式（只在设置多选时有效）(超长显示省略号所以 widthAdaption 不会触发
  hideMult: PropTypes.deprecated(
    "[HUI warn]:Select hideMult 属性已停用,请使用 multHeadType='text'!"
  ),
  // 多选框是否显示总体清空图标
  multClearable: PropTypes.deprecated(
    '[HUI warn]:Select multClearable 属性已停用,请使用 clearable!'
  ),
  // showValue 多选时输入框是否显示value值，默认label
  showValue: PropTypes.deprecated(
    '[HUI warn]:Select showValue 属性已停用,请使用 tagKey!'
  ),
  collapseTags: PropTypes.deprecated(
    '[HUI warn]:Select collapseTags 属性已停用,请使用 maxTagCount!'
  ),

  /** *************************** 远程搜索 *****************************/
  // remote 是否支持远程搜索 Object or false
  remote: PropTypes.shape({
    // remote.method 远程搜索的方法
    method: PropTypes.func,
    // remote.loading
    loading: PropTypes.bool.def(false),
    // remote.loadingText 远程搜索中的文字提示
    loadingText: PropTypes.string,
    // remote.loadingIcon 当前是否正在远程搜索String or false
    loadingIcon: PropTypes.oneOfType([Boolean, String]),
    initValue: PropTypes.oneOfType([Object, String]),

    /** *************************** 下拉加载更多 *****************************/
    scrollDisabled: PropTypes.bool.def(true),
    scrollLoading: PropTypes.bool.def(false),
    //  是否显示加载完成数据提示
    scrollNoMore: PropTypes.bool.def(false),
    // 下拉加载完成数据提示,只在使用下拉局部刷新数据时使用
    scrollNoMoreText: PropTypes.string,
    scrollLoadMore: PropTypes.func,
    scrollImmediateCheck: PropTypes.bool.def(false),
    scrollDistance: PropTypes.number.def(0),
    scrollThrottleDelay: PropTypes.number.def(300),
    // remote.initValue 仅在 remote 模式下，初始化时使用。因为仅通过 value 无法得知选项的 label，需手动设置，避免input空白。
  }).loose,

  // 远程单选搜索，已选中选项后光标进入输入框时是否显示下拉选项【修改搜索内容可以正常显示下拉】
  // remoteFocusNotShowList: PropTypes.bool.def(false),
  label: PropTypes.deprecated(
    '[HUI warn]:Select isComputed 属性已停用,请使用 initValue 来设置初始的!'
  ),
  isComputed: PropTypes.deprecated(
    '[HUI warn]:Select isComputed 属性已停用,请使用 scrollNoMore = false 来隐藏提示!'
  ),
  remoteIcon: PropTypes.deprecated(
    '[HUI warn]:Select remoteIcon 属性已停用,请使用 loadingIcon!'
  ),
  showLoadingIcon: PropTypes.deprecated(
    '[HUI warn]:Select showLoadingIcon 属性已停用,请使用 loadingIcon = false 关闭loadingIcon!'
  ),
  scrollFix: PropTypes.deprecated(
    '[HUI warn]:Select scrollFix 属性已停用'
  ),
  allowCreate: PropTypes.deprecated(
    '[HUI warn]:Select allowCreate 属性已停用,请调用方法来创建新条目,或查阅相关的 select-ctrl'
  ),
  // tabToSave 当开启 allowCreate  filterable tabToSave 表示新建条目时，输入Tab键，保存当前新建条目（与enter键功能一样）
  tabToSave: PropTypes.deprecated(
    '[HUI warn]:Select tabToSave 属性已停用,请调用方法来创建新条目,或查阅相关的 select-ctrl'
  ),

}
