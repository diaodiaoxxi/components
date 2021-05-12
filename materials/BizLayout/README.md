# 导航框架 与 操作员中心对接 页面模板

- 包含公司原操作员中心1.0 外框与登录页，依赖 hui-cli 提供的 hui-core hui-micro-app
- 基于 @hui/h-frame-layout 导航导航组件封装，扩展 操作员中心接口 与 hui-core 的交互逻辑

## 文件说明
``` 
├─dist                           打包后输出的目录
├─src                            原代码目录
│  ├─demos                       提供给客户的示例
│  ├─layout                      外框导航组件
│  │  ├─components               操作员中心业务组件
│  │  │   EditUserInfo.vue          编辑用户
│  │  │   SwitchLocale.vue          浮窗切换 i18n 多国语言
│  │  │   SwitchSpace.vue           切换空间
│  │  │   SwitchTenant.vue          切换租户
│  │  ├─eventMixin               对外暴露的事件
│  │  └─locales                  i18n 多国语言
│  ├─login                       登录页相关
│  └─utils                       
│     ├─bizApi.js                操作员中心接口封装
│     ├─bizApiInterceptors.js    操作员中心接口统一拦截器
│     ├─BizSecurity.js           操作员中心登录加密
│     ├─demoSys.js               示例扩展的子系统
│     └─index.js                 导航与登录页使用的工具类函数
└─styles
```