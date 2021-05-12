import Vue from 'vue'
// 外框视图组件
import Layout from '@hui/h-frame-layout/dist/h-frame-layout.umd'
import '@hui/h-frame-layout/dist/h-frame-layout.css'
// 基于操作员中心 与 hui-core 封装的页面模板
import hBizLayout from './src/layout/BizLayout.vue'
import hBizIframe from './src/layout/components/IframeWrap.vue'
import hBizLogin from './src/login/BizLogin.vue'
// 工具类函数
import BizApi from './src/utils/bizApi'
import BizApiInterceptors from './src/utils/bizApiInterceptors'
// 调试钩子
import devHook from './src/utils/devHook'

devHook()
Vue.use(Layout)

export default {
  install () {
    Vue.component('hBizLayout', hBizLayout)
    Vue.component('hBizLogin', hBizLogin)
    Vue.component('hBizIframe', hBizIframe)
  },
}
export { BizApi, BizApiInterceptors }
