import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './locale'

import 'h_ui/dist/h_ui.min.css'
import hui1 from 'h_ui/dist/h_ui.min.js'
import Select from '@packages/Select'

Vue.use(Select)
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
