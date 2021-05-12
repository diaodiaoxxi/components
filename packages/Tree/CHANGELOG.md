# Tree 更新日志

## @hui/tree@1.4.0(HUI1.0_COMPONENT2.0_Tree_V202101.04.000)

- 🆕 `nodeEdit`方法新增返回值response{status: true/false, msg: 当前返回值的文本提示内容 } （内部优化）

- 🆕 `nodeEdit` `type='del'`状态下，新增批量删除功能（内部优化）

- 🆕 `load-data`异步加载场景下，`on-load`事件新增加载失败的判断条件，eventObj返回对象中，新增`status:true/false，表示加载是否成功`，`msg：表示当前load-data的事件文本提示` （内部优化）

## @hui/tree@1.3.1(HUI1.0_COMPONENT2.0_Tree_V202101.03.001)

- 🐞 修复virtual在大数据场景下，上下键选中在页面通过上下键选中时，通过虚拟滚动可视区数据刷新时会失效的问题 S2103120055 内部优化

## @hui/tree@1.3.0(HUI1.0_COMPONENT2.0_Tree_V202101.03.000)

- 🆕 新增treeNode的props属性`disableClick`属，禁止点击节点，视觉上跟`disabled`一样，区别：`disableClick`：参与联动计算；disabled`: 禁止响应，不参与联动计算 #S2103030111 王兰

- 🐞 修复当treeData节点设置selectable=false，聚焦在当前节点时，通过键盘enter，还可以进行选中文本的问题 S2103040082 内部优化

- 🌟 优化Tree在删除节点时的性能 #S2102050177 赵盛璐

- 🌟 优化当showCheckbox=fasle不显示复选框时，上下键聚焦节点时，没有过滤叶子节点不符合selected条件的节点

## @hui/tree@1.2.0(HUI1.0_COMPONENT2.0_Tree_V202101.02.000)

- 🌟 优化loadData异步加载节点场景下，当`点击节点触发`的异步加载loadData方法和`nodeExpand方法`调用触发的异步加载loadData方法，返回的item参数格式不统一的问题 #S2101220093 钱佳华

- 🆕 新增treeNode的props属性`showMenu`属性，支持个性化配置显示节点...图标  #S2102050174 赵盛璐

## @hui/tree@1.1.0(HUI1.0_COMPONENT2.0_Tree_V202101.01.000)

- 🆕 新增`filterType`属性，设置当isTreeFilter=true时，设置过滤方式 #S2101220092 范霄

- 🆕 新增`alwaysSelect`属性，重复点击某节点，是否总是选中当前文本节点；单选multiple=false时有效，重复点击已选择的节点，也会触发on-select事件

- 🌟 优化全选、全不选逻辑，`filterType=filter`，全选、全不选(ctrl+a、ctrl+d)时，根据当前过滤树结构来处理；`filterType=search`，全选、全不选(ctrl+a、ctrl+d)时，根据整个tree结构来处理

- 🐞 修复当tree未设置blockNode/blockDirectory时，text文本也沾满整行的问题 #S2101130050

- 🌟 优化当设置checkStrictly非联动状态下，在过滤节点的场景下，触发全选功能，全部选中了整个tree的节点，而不是当前过滤树的节点 #S2101130042

- 🌟 优化当checkKeys中包含禁用类节点(`disabled`、`disableCheckbox`)key时，键盘ctrl+a触发全选时，已选的禁用类节点保留，不去除 #S2101250046

## 1.0.0(HUI1.0_COMPONENT2.0_Tree_V202010.00.001)

`2020-12-24`

- 🆕 提供节点`blockNode`、`blockDirectory`，判断文本是否占据一行等功能

- 🆕 提供复选框 `v-model="checkedKeys` 实现双向绑定；`showCheckbox`；`checkStrictly`父子不联动；`isBoxRight`复选框在右边；方法 `nodeCheck()`； `on-check`事件等功能

- 🆕 提供文本节点 `:selectedKeys.sync`实现双向绑定；`multiple`多选；方法 `nodeSelect()`；`on-select` 事件等功能

- 🆕 提供展开/收缩`:expandedKeys.sync`实现双向绑定；`expandLevel`初始化默认暂开几级树节点；`defaultExpandAll`初始化默认展开所有树节点； 大数据场景不推荐使用；优先级：`defaultExpandAll > expandLevel`；方法`nodeExpand()`； `on-expand`事件等功能

- 🆕 提供过滤、筛选节点`filterValue`根据filterValue绑定的变量值筛选树节点（高亮显示符合条件的节点）；`isTreeFilter`搜索时，直接过滤树节点；
`filterNodeMethod`自定义按需筛选树节点（高亮）返回 true；搭配 filterValue 使用

- 🆕 提供自定义节点内容 `render`自定义节点内容；`renderMenu`自定义节点更多...菜单信息 (可以搭配 titleMaxWidth、blockNode、blockDirectory)使用 、`renderIcon`自定义图标 、`renderTextTips`自定义节点鼠标悬浮 title 提示信息

- 🆕 提供异步加载节点数据，`loadData` 异步加载节点的方法；node子节点属性 `leaf:true`, 表示为叶子节点，不能加载节点；`on-load` 事件；节点 `disabled`也支持异步加载节点

- 🆕 提供禁用`disabled`、`disableCheckbox`、`selectable`禁用类属性

- 🆕 提供`titleMaxWidth`、`isBoxRight`属性

- 🆕 提供大数据场景`virtual`

- 🆕 提供`formatValue`动态配置对象唯一值

- 🆕 提供方法：getCheckedNodes、getSelectedNodes、nodeCheck、nodeSelect、nodeExpand、nodeEdit、propsForceUpdate、nodePosition

- 🆕 提供on-check、on-select、on-expaned、on-mouseover、on-load、on-click、on-right-click、on-double-click
