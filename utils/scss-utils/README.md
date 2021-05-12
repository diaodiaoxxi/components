# `@hui/scss-utils`

> TODO: description

## element bem scss 混合器

来自 element
https://github.com/ElemeFE/element/tree/dev/packages/theme-chalk/src/mixins

## 其他 scss 混合器


``` scss
@include clearfix();  // 清除浮动
@include vertical-center(); // 利用伪类垂直居中
@include user-select(); // 禁用选择
@include ellipsis(); // 字符超长省略号
@include with-count($num); // 根据子级 dom 数量应用不同规则

/* 只对 webkit 谷歌浏览器有效
 --------------------------------------- */
@include scrollbar($scrollbar-color) // 滚动条样式
/* --------------------------------------- */

// input placeholder 样式
@include placeholder()

// include 易用替换
@include share-rule($name) // 封装 css 规则
@include extend-rule($name) // 引用 封装的 css 规则

// flex 居中
@include flex-center() // 水平居中
@include flex-middle($name) // 垂直居中
@include flex-center-middle($name) // 水平垂直居中

// 媒体查询封装
@include meadia-query($key, $map: $breakpoints)

// 一些常用的中文字体，在 basic-font 内
// ...


```