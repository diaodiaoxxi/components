import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './locale'

import 'h_ui/dist/h_ui.min.css'
import hui1 from 'h_ui/dist/h_ui.min.js'

import Tree from '@hui/tree'
import '@hui/tree/dist/tree.css'

Vue.locale = () => {} // 兼容HUI1.0，Vue.use(VueI18n) 有$t方法后 ,默认设置语言报错
Vue.use(Tree)
Vue.use(hui1)
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.config.performance = true
window.$vue = new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
