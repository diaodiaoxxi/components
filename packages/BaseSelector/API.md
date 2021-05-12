### Select Base Props 基础属性值
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| value / v-model | 绑定值 | boolean / string / number | — | — |
| multiple | 是否多选 | boolean | — | false |
| readonly | 是否只读 | boolean | — | false |
| disabled | 是否禁用 | boolean | — | false |
| size | 输入框尺寸 | string | small/default/large | default |
| align | 单选文本对齐 | string | left/right/center | left |
| placeholder | 选择框默认文字 | string | - | 请选择 |
| tabindex | 设置输入框tabindex | boolean | - | true |
| isArrow | 不显示箭头，默认显示 | boolean | - | true |
| animated | 是否开启下拉框展开收起动画效果,或指定下拉框展开收起动画效果 | boolean/string | - | true |
| optionTexts | 常规option显示字段 | array | ['value, 'label'] ['label, 'value'] ['value'] ['label'] | 多选:['value, 'label'],单选: ['label'] |
| validate | 是否触发表单校验,与表单校验触发情况区分,将相应场景移除数组,,该场景不触发表单校验<br>initValue: mouted 初始化赋值触发表单校验<br>valueChange: 值变动,包括手动对value赋值,或select选中对应选项<br>blur/focus: 失焦/聚焦时触发 | boolean/array | [ 'initValue', 'valueChange', 'blur', 'focus' ] | true |

<!-- | showTitle | 是否显示提示 | boolean | - | true | -->

### Select Dropdown Props 下拉弹窗相关属性
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| placement | 自定义下拉框展开方向,需要关闭 autoPlacement | string | top/bottom/top-start/top-end | bottom-start |
| autoPlacement | 自适应面板方向 | boolean | - | true |
| widthAdaption  | 下拉框的宽度是否随着内容自适应，以select设置的宽度为最小宽度，最大宽度取输入框宽度与maxDropWidth的最大值 | boolean | - | false |
| dropWidth  | 设置下拉框的宽度,不设置或为0时下拉框的宽度等于输入框宽度 | number | - | - |
| maxDropWidth  | 需要开启 widthAdaption 下拉框的自适应时设置的最大宽度，实际值会取输入框宽度与maxDropWidth的最大值 | number | - | - |
| transfer | 是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果 | boolean | - | false |


### Select Props value 值特殊格式化
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| labelInValue | 在返回选项时，是否将 label 和 value 作为 object 一并返回{label:label,value:value}，默认只返回 value | boolean | - | false |
| zeroToNull | 双向绑定输入‘0’转化为空值，输出空值转化为‘0’(仅单选有效) | boolean | - | false |
| zeroToNull | 只在多选模式下使用,将多选时双向绑定的变量的格式变为String类型，多个选项用','隔开| boolean | - | false |

### Select Props value 前端过滤
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| filterable | 是否开启前端过滤搜索 | boolean | - | false |
| filterMethod | 过滤方法<br>all: 根据value,label匹配搜索<br>label: 只根据label搜索<br>value: 只根据value搜索<br>function(query,{value,label})  自定义搜索函数| string/function | all/value/label/function | all |
| notFoundText | 当下拉列表为空时显示的文本内容 | string | - | - |
| highLightQuery | 实时高亮匹配字段 | boolean | - | false |
| setDefSelect | 输入框选择为空时默认选择第一条 | boolean | - | false |
| notAutoFocus | 搜索时是否不将焦点放在第一搜索项 | boolean | - | false |
| accuFilter | 如果搜索时输入的信息完全匹配到value或者label的时候 自动勾上 | boolean | - | false |


### Select Props 多选相关属性
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| multiple | 是否开启多选 | boolean | - | false |
| multHeadType | 多选显示类型<br>tag: 常规标签显示<br>text: 连续文本显示<br>| string | tag/text | tag |
| tagKey | 多选标签显示键名,默认为 option的 label | string | - | label |
| valueKey | 如果 option value 类型为object,需要指定 value 具体显示object的属性 | string | - | value |
| labelKey | 如果 option value 类型为object,需要指定 label 具体显示object的属性 | string | - | label |
| multipleNumber | 限制用户选择的个数 | string/number | - | - |
| maxTagCount | 标签显示数量 | string/number | - | - |
| maxTagPlaceholder | 自定义更多标签文本,配合 maxTagCount | string/function | - | - |
| hideOptionCheckbox | 隐藏多选 option 前的 checkbox 选择框 | boolean | - | false |
| isBackClear | 输入框是否可通过backspace按键清除选中项 | boolean | - | true |
| initRadioOptions | 需要互斥的option value 值 | string/array | - | '' |

