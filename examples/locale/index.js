import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from '@hui/locale/lang/zh-CN'
import en from '@hui/locale/lang/en-US'
import zhLocale from './lang/zh-CN'
import enLocale from './lang/en-US'
import { merge } from '@hui/shared-utils'
Vue.use(VueI18n) // 通过插件的形式挂载
// 多语言配置--打包后可以自定义设置
// let zh = {}
// let en = {}
const mergeZH = merge(zhLocale, zh) // 将我们项目中的语言包与h_ui的语言包进行合并   // 中文语言包
const mergeEN = merge(enLocale, en) // 英文语言包
const i18n = new VueI18n({
  locale: 'zh-CN', // set locale
  messages: {
    'zh-CN': mergeZH,
    'en-US': mergeEN
  }, // set locale messages
  silentTranslationWarn: true // 去掉warning提示
})
export default i18n
