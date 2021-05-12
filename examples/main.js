import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './locale'
// import 'default-passive-events'
import 'h_ui/dist/h_ui.min.css'
import hui1 from 'h_ui/dist/h_ui.js'

import hui from '@packages/Hui/index'

Vue.use(hui1, { i18n: (key, value) => i18n.t(key, value) })
Vue.use(hui, { i18n: (key, value) => i18n.t(key, value) })
Vue.locale = () => {}
Vue.config.productionTip = false
Vue.config.devtools = true
Vue.config.performance = true
window.$vue = new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
