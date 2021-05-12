# layout worktable 工作台

依赖 layout 框架使用

## 依赖组件
- [VueGridLayout](https://github.com/jbaysolutions/vue-grid-layout/blob/master/README-zh_CN.md)


## API 

### Props 
| 参数      | 说明          | 类型      | 默认值                        |
|---------- |-------------- |---------- |:-------------------------------  |
| gridData | 数据源 | gridItem[] | - |
| initGridData | 点击重置恢复的数据源 | gridItem[] | - |

### gridItem key
| 参数      | 说明          | 类型      | 默认值                        |
|---------- |-------------- |---------- |:-------------------------------  |
| i | 栅格中元素的ID,没有会自动生成一个 | string | - |
| x | 标识栅格元素位于第几列，需为自然数 | number | - |
| y | 标识栅格元素位于第几行，需为自然数 | number | - |
| w | 标识栅格元素的初始宽度，值为colWidth的倍数 | number | - |
| h | 标识栅格元素的初始高度，值为rowHeight的倍数 | number | - |
| minW | 栅格元素的最小宽度，如果w小于minW，则minW的值会被w覆盖 | number | 2 |
| minH | 栅格元素的最小高度，如果h小于minH，则minH的值会被h覆盖 | number | 2 |
| static | 标识栅格元素是否为静态的（无法拖拽、调整大小或被其他元素移动） | boolean | false |
| title | 标识栅格元素标题文本,为空时不显示标题 | string | - |
| componentName | 栅格元素内容-挂载的组件名称(需要在Vue.component 注册组件) | string | - |
| html | 栅格元素内容-挂载的html内容(组件名称优先级更高) 栅格元素内容 | string | - |

### Events 
| 事件名称 | 说明          | 回调参数  |
|---------- |-------------- |---------- |
| edit | 编辑/配置布局元素时触发 | gridData |
| reset | 重置布局元素时触发(个人信息栏重置工作区触发) | gridData |
| confirm | 点击确认操作按钮时触发 | gridData |
| recover | 点击取消按钮时触发(恢复编辑前布局) | gridData |
| create-item | 点击新增按钮时触发 | - |
| delete-item | 点击 gridItem 角标 关闭图标按钮时触发 | gridItem,gridData |













