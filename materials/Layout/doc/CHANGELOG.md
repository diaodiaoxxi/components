## UED 走查修改点

1. - [x] 图标多余示例 删除
2. - [x] 锁定组件 修改
3. - [x] 间隔线删除 topbar-left 间隔线
4. - [x] 点击子系统后 全部菜单关闭 星星为白色
5. - [x] topbar system 点击颜色区分
6. - [x] navbar 标签宽度不撑开 
7. - [x]  菜谱菜单 active 颜色校订
8.  - [x] 菜谱菜单 图标
9.  - [x] 菜谱菜单 搜索下边线
10. - [x] 菜谱菜单 收藏项额外操作
11. - [x] 菜谱 图标为 14px ,聚焦颜色
12. - [x] 二级菜单位置 添加 圆圈图标
13. - [x] 三级菜单位置 添加 圆圈图标
14. - [x] 全部菜单 hover 触发
15. - [x] 全部菜单 抽屉盒 图标与背景颜色
16. - [x] anchor 点击后 对应标题有背景颜色
17. - [x] anchor hover 状态修正
18. - [x] navtab 切换

## 2020-06-03
1. - [x] layout-head 需要初始化默认值
3. - [x] layout-sidebar 单层子节点不能触发 select 事件
4. - [x] layout-sidebar 第一层菜单未设置icon 时需要有默认 icon
5. - [x] layout-navbar 激活回调 click change close
6. - [x] layout-sidebar navbar topbar default value
7. - [x] menu-item icon 不设置时需要 有默认图标

## 2020-06-04

1. - [x] menu-item active hover 后不改变 active 色值
3. - [x] menu-item 子项条目 icon active hover 色值不正确
4. - [x] menu-item icon 大小 为14px ,折叠后为 16px
5. - [x] 菜谱菜单 cook-popper 离边 1px ,圆角 2px


## 2020-06-05
1. - [x] cook-submenu 激活后图标 颜色未更改
2. - [x] cook-sidebar menu-item 去除火柴棍
3. - [x] cook-popper cook-menu-item 如果为标题去除 hover 效果


## 2020-06-09

1. - [x] 侧边栏出现滚动条时 菜谱菜单浮窗出现 滚动条宽度 6像素 错位
2. - [x] 框架侧边栏折叠动画优化, cook-submenu,submenu 涉及 collapse 图标显隐藏 ,卡顿
3. - [x] 添加: topbar fullmenu topbar-star 全部菜单可配置到工具栏

## 2020-06-10

1. - [x] 修复: 菜谱式 搜索后,再次展开弹窗,弹窗只显示搜索的那个选项
2. - [x] 修复: 手风琴式 子选项选中 图标没变蓝
3. - [x] 修复: 关闭全部页后 这个弹窗还是存在
4. - [x] 修复: 菜谱菜单 取消收藏会因为冒泡激活点亮下一收藏项
5. - [x] 修复: navTabs tab 标签 acitve 后 close 图标显示隐藏异常
6. - [x] 修复: sidebar addFavour 事件未触发
7. - [x] 修复: 手风琴 侧边栏 select 事件未触发

8.  - [x] 修复: cook-popper 搜索后 存在空白 anchor-link
9.  - [x] 修复: 菜谱菜单 二级标题项触发了 select 事件
10. - [x] 修复: navTabs一屏的数据 手动删没了 而前一屏选项的刚刚是一屏的宽度 就不会自动跳到前一屏
11. - [x] 修复: 顶部栏 fullmenu 配置后图标不显示
12. - [x] 格式: Sidebar fullmenu 变更为 fullMenu
13. - [x] 功能: navTabs 没有相同页时滚动到前一页
14. - [x] 功能: navTabs 激活相邻标签,相邻标签跨页时滚动到相邻标签页


## 2020-06-11 跃川提出的修改点

1. - [x]  Topbar 支持默认选中，触发对应的事件
2. - [x]  Navbar 支持还原选中的菜单
3. - [x]  默认值处理，包括操作员信息，登录时间等等，
4. - [x]  页签关闭的API，第二个参数应该返回页签关闭后仍然处于激活状态的页签信息
5. - [x]  默认的菜单类型，菜谱或手风琴
6. - [x]  Sidebar 和 Navbar 联动，
7. - [x]  页签关闭 取消 sidebar 选中状态
8. - [x]  全部菜单支持默认选中，页面刷新后可以定位到对应的子系统和菜单 (依赖layout 整合)

## 2020-06-12

3.  - [x] 修复: sidebar defaultActive 切换侧边栏类型后 默认选中状态丢失
4.  - [x] 修复: sidebar defaultActive 抽屉菜单 折叠下 默认选中,与图标没有选中状态
5.  - [x] 修复: 初始 navTabs 默认选中可滚动到相应位置


## 2020-06-13

1. - [x] 功能: 全部菜单 navTabs 逻辑串联
2. - [x] 功能: 全部菜单 navTabs 切换后恢复收藏状态
3. - [x] 功能: 全部菜单 与 菜谱菜单 cook-item 添加选中状态
4. - [x] 修复: 侧栏的动画，图标和文字不同步
5. - [x] 修复: 关闭 全部页签 选中状态未清除
1. - [x] 功能: Navbar 点击，Topbar 可以切换回页签菜单所在的子系统


## 2020-06-16

1. - [x] 功能: 锁屏/修改密码弹窗添加
2. - [x] 功能: topbar search 改为 select 2.0

## 2020-06-17

1. - [x] 修复: 全部菜单 三级子菜单 mark-line 带有小圆角


## 2020-06-28
1. - [x] 功能: navbar 当标签条已满，打开新标签页，整条标签条往前推进，并在末尾显示刚打开的标签页，定位新菜单标签页
2. - [x] 功能: 额外增加的“关闭当前页”删除

## 2020-06-29 测试点验收


1. - [x] 功能: cook-popper 点击 cook-item 后收起
1. - [x] 功能: drawer-sidebar collapse 折叠后 点击 item 后收起
1. - [x] 功能: topbar-sys 点击系统后 popper 收起
1. - [x] 功能: 全部菜单定宽


## 2020-06-30
1. - [x] demo topbar 示例放多一点
1. - [x] topbar 锁屏 修改密码 弹窗 修改为 ued 样式

## 2020-07-11

1. - [x] 抽屉侧边栏 暗黑皮肤 
2. - [x] 抽屉侧边栏 暗黑皮肤 动画优化
3. - [x] 抽屉侧边栏 折叠状态下 子菜单抽屉宽度错误
4. - [x] 抽屉侧边栏 折叠状态下 子菜单抽屉图标错误
5. - [x] cook-popper 排序改为从左到右
6. - [x] cook-popper 添加激活状态


## 2020-08-14

### h-frame-layout

- 新增：MenuInfo.canSelect 属性控制是否为可点击，触发 select ，不配置该项默认为可点击
- 新增：MenuInfo.closable TabInfo.systemUuid 属性控制添加到页签栏时，是否可以被关闭，不配该项默认为可关闭
- 新增：MenuInfo.systemUuid TabInfo.systemUuid 区分 systemName 重复定位子系统

### h-frame-layout 模板示例

- 修复：TabInfo.title 重复时 add-custom-tab 不能新增页签
- 修复：TabInfo.title 重复时 del-custom-tab 会清除所有页签
- 修复：刷新时页签激活状态丢失
- 新增：主应用内添加、删除、激活页签示例
- 新增：子应用内添加、删除、激活页签示例
- 新增：del-custom-tab 方法不传参数时，删除当前激活的页签，并激活临近页签


2.  - [x] 左侧到弹窗的动画 还是有点问题 (依赖范围判断,二期优化)
3.  - [x] 所有浮窗clickouside 关闭
4.  - [x] 全部菜单，hover 进/ click 出
5.  - [x] 全部菜单的图标（星星）可能会产生歧义，交互效果不太明确 (添加 tooltip 提示)
6.  - [x] 单个菜单，hover 进/ hover 出，点击菜单跳转之后抽屉收不回去
7.  - [x] 搜索框位置，搜索框下拉面板的展示方式


## TODO 

1.  - [ ] UCF 浏览器下 navTabs 刷新当前页 事件需要双击生效