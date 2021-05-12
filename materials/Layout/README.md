# 导航框架

[文档-仓库](https://gitlab.hundsun.com/HUI/hui-pro/blob/2.x/docs/frame/navigator.md)

[文档-线上](http://hui.hundsun.com/2.x/frame/navigator.html)


## 依赖组件
- Radio v2.0
- Anchor v2.0
- Menu v2.0
  - CookSubmenu
  - CookPopper
  - MenuItem
  - SubMenu
- NavTabs v2.0
- Form v1.0
- FormItem v1.0
- Input  v1.0
- Msgbox v1.0

## layout 组件拆分
- Layout
   - LayoutHead (Topbar) 顶部栏
      - TopbarLogo logo 与 appName
      - TopbarSys 子系统
      - TopbarCtrl 右侧工具栏与个人信息操作
   - LayoutBody 主体内容 (div.h-layout-main)
      - Sidebar 侧边栏
        - CookMenu 菜谱侧边栏
        - DrawerMenu 菜单侧边栏 (手风琴侧边栏)
        - FullMenu 全部菜单 侧边栏
      - Navbar 标签导航栏 (NavTabs组件)
      - AppMain 内容框

## Layout API

### Props
| 参数      | 说明          | 类型      | 默认值                        |
|---------- |-------------- |---------- |:-------------------------------  |
| appLogo | 顶部栏 logo img url 地址 | string | - |
| appName | 顶部栏 app name | string | C/S |



## LayoutHead API 

### Props 
| 参数      | 说明          | 类型      | 默认值                        |
|---------- |-------------- |---------- |:-------------------------------  |
| appLogo | 顶部栏 logo img url 地址 | string | - |
| appName | 顶部栏 app name | string | C/S |
| fullMenu | 全部菜单位置 | in-sys/in-ctrl/none | in-sys |
| defaultSystem | 默认激活的菜单<br/>可以为systemInfo.title 名称<br>或 systemInfo 对象</br>为fullMenu时激活全部菜单 | string/systemInfo | - |
| appSystemList | 顶部栏 子系统列表 ,<br/>systemInfo.title 为显示名称<br/>systemInfo.uuid 为uuid唯一序列号,作为vue 遍历key,也可不设置 | systemInfo[] <br/>systemInfo:object | - |
| userName | 右侧个人信息浮窗-操作员名称 | string | 操作员名称 |
| loginTime | 右侧个人信息浮窗-登录时间 | string  | 上次登录时间  |
| version | 右侧个人信息浮窗-当前版本 | string  | 1.0.0 |


### Events 
| 事件名称 | 说明          | 回调参数  |
|---------- |-------------- |---------- |
| active-system | 激活子系统时触发 | systemInfo |
| open-full-menu | 打开全部菜单栏 | - |
| change-sidebar | 右侧个人信息浮窗-切换侧边栏类型<br/>drawerMenu: 手风琴 抽屉式菜单<br/>cookMenu: 菜谱式菜单 | type = 'drawerMenu' / 'cookMenu'  |
| change-skin | 右侧个人信息浮窗-切换皮肤 | type = 'blue' / 'pink' / 'dark'  |
| logout | 右侧个人信息浮窗-退出登录 | -  |


## Navbar API

### Props 
| 参数      | 说明          | 类型      | 默认值                        |
|---------- |-------------- |---------- |:-------------------------------  |
| mode | 模式类型<br>default: tab 关闭图标出现时会撑开 tab 宽度<br/>keep-width: 不撑开tab 宽度 | string = default / keep-width  | default |
| defaultTab | 初始化默认激活的 tab 标签<br>tabInfo.title 标签名称或整个 tabInfo 对象 | string/tabInfo | - |
| value | 标签导航栏数据<br>tabInfo.title tag 标签显示名称<br/>tabInfo.closable 标签是否可关闭<br/>tabInfo.isCanRefresh 标签右键菜单是否开启刷新当前页 | tabInfo:[]<br/>tabInfo:object<br/> | [] |
| ctrlMode | 左右操作按钮类型<br>default: 左右切换分页一直显示<br/>auto: 超出范围才显示左右切换 | string = default / auto  | default |
| closable | 是否开启 tag 可关闭 | boolean  | true |
| useContextmenu | 是否使用右键菜单 | boolean  | true |


### Events 
| 事件名称 | 说明          | 回调参数  |
|---------- |-------------- |---------- |
| click | 点击 tab 标签时触发 | e,tabInfo |
| close | 点击关闭图标/右键菜单-关闭当前页<br/>acitveTabInfo 当前被激活的标签(没有标签时为 undefined)<br/>tabInfoList 标签列表 | tabInfo,activeTabInfo,tabInfoList |
| close-all | 右键菜单-关闭全部页 | tabInfoList |
| close-other | 右键菜单-关闭其他页 | 右键菜单-关闭其他页 |
| refresh-page | 右键菜单-刷新当前页<br/>开启需要 value 内 tabInfo 传入 isCanRefresh | tabInfo<br>参考prop.value  |



## Sidebar API

### Props 
| 参数      | 说明          | 类型      | 默认值                        |
|---------- |-------------- |---------- |:-------------------------------  |
| defaultActive | 初始化默认激活的菜单<br>menuInfo.uuid 菜单uuid或整个 menuInfo 对象 | string/menuInfo | - |
| value | 侧边栏数据,支持层级最多三级<br/>menuInfo.uuid 唯一标志(为null的话会自动生成一个)<br>menuInfo.icon  一级菜单 iconfont class 名称<br>menuInfo.title 菜单名称<br>meuInfo.isFavour 是否激活了收藏/是否为收藏菜单<br/>menuInfo.children 子级菜单数组,嵌套menuInfo | menuInfo[] | [] |
| fullMenuData | 全部菜单侧边栏数据 (数据结构参考 value 中的 menuInfo) | menuInfo[] | [] |
| fullMenuTabs | 全部菜单多系统NavTabs (数据结构参考 Navbar value 中的 tabInfo ) | menuInfo[] | [] |


### Events 
| 事件名称 | 说明          | 回调参数  |
|---------- |-------------- |---------- |
| select | 选中侧边栏 菜单子条目 回调| menuInfo |
| add-favour | 侧边栏 添加收藏<br/>source: 'fromFullMenu'/'fromCookMenu' | menuInfo,source |
| remove-favour | 侧边栏 移除收藏 | menuInfo,source |
| click-full-menu-tab | 全部菜单 子系统 tab 过滤项 | tabInfo |


<!-- | lock-screen | 锁屏界面出现时触发,用于通信后端锁屏 | - | -->
<!-- | unlock-screen | 解锁屏幕<br/>password:解锁密码<br/>closeDialog: 关闭弹窗函数,解锁提交后执行该函数可关闭弹窗 | password,closeDialog  | -->
<!-- | reset-password | 右侧个人信息浮窗-重置密码 | (info, success,error) | -->