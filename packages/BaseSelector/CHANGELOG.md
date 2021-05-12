# SelectTree 更新日志

## @hui/select@1.4.0(HUI1.0_COMPONENT2.0_Select_V202101.04.000)

- 🌟 优化IE浏览器下，在可搜索场景下selectTree2.0，初始化，下拉框drop直接展开的问题

- 🌟 优化IE浏览器下，在可搜索场景下selectTree2.0，value值为空值，点击展开下垃框，下拉框出现展开收缩又展开的问题

- 🌟 优化IE浏览器下，在可搜索场景下selectTree2.0，支持符合条件的键盘事件

## @hui/select@1.3.0(HUI1.0_COMPONENT2.0_Select_V202101.03.000)

- 🐞 优化在非可搜索状态下，keydown事件`Backspace`删除键失效的问题 #S2103050069 内部优化

## @hui/select@1.2.0(HUI1.0_COMPONENT2.0_Select_V202101.02.000)

- 🌟 优化当设置`disabled`、`readonly`，单选非可搜索场景下，文本出现换行的现象 #S2101270184 潘中阳
- 🆕 新增`showTitle`属性，设置鼠标移动到能显示title提示；注意：多选场景下，`multHeadType=tag`时，鼠标hover每个tag项，title显示每个tag项的文本内容  #S2101270184 潘中阳

## @hui/select@1.1.0(HUI1.0_COMPONENT2.0_Tree_V202101.01.000)

`2020-01-28`

- 🌟 优化select，在搭配select-tree使用的场景下，单选支持number类型 #S2101130117
- 🐞 修复当中文输入法时，用鼠标点击选中文字 ，当前场景下，过滤失效的问题 #S2101110177 刘晓凡

## @hui/select-tree@1.0.0(HUI1.0_COMPONENT2.0_SelectTree_V202010.00.000)

`2020-12-31`

- 🆕 提供`value(v-model)`、`valueKey`、`labelKey`自定义value，label对应的属性名
- 🆕 提供`disabled`（禁用）、`readonly`（只读）功能
- 🆕 提供`clearable`设置是否始终显示清除图标（默认鼠标hover显示图标）
- 🆕 提供`isArrow`是否显示下拉箭头
- 🆕 提供`placeholder`选择框默认文字、`maxTagPlaceholder`自定义设置隐藏 tag 时显示的内容
- 🆕 提供`animated`是否开启下拉框展开收起动画效果;animated为string类型自定义动态配置动画效果
- 🆕 提供粘贴赋值功能；`selectPaste`是否开启赋值文本，选中下拉项，可搜索场景下，触发`on-paste`事件
- 🆕 提供弹框方向自适应和设置功能；`placement`弹窗的展开方向、`autoPlacement`自适应面板方向,默认边界为window窗口
- 🆕 提供下拉框宽度设置、自适应功能；`dropWidth`设置下拉框的宽度，`maxDropWidth`下拉框的自适应时设置的最大宽度（maxDropWidth >= 输入框自身宽度），`widthAdaption`下拉框的宽度是否随着内容自适应
- 🆕 提供`transfer`是否将弹层放置于body内
- 🆕 提供`loading`下拉面板展开loading动画效果，`slot="loading"`自定义loading插槽
- 🆕 提供filterable支持搜索
- 🆕 提供`multiple`多选
- 🆕 提供多选时，`multHeadType`输入框显示head头的展示情况
- 🆕 提供多选时，`maxTagCount`设置多少个tag开始收起通过hover显示
- 🆕 提供多选时，`maxTagPlaceholder`自定义设置隐藏 tag 时显示的内容
- 🆕 提供多选时，`isString`将v-model绑定的变量的格式变为 String 类型，多个选项用 ' , ' 隔开
- 🆕 提供多选时，`isBackClear`可通过backspace按键清除选中项
- 🆕 提供方法`onFocus`、`onBlur`
- 🆕 提供事件`on-focus`、`on-blur`、`on-change`、`on-click`、`on-paste`、`on-clear-select`
- 🆕 提供插槽`loading`、`emptyList`
