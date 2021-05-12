import Vue from 'vue'
import VueRouter from 'vue-router'
import Views, { selectDemos, tableDemos, demos, treeTableDemos, treeDemos, dateDemos, selectTreeDemos } from './AutoImport'

Vue.use(VueRouter)
const LOCAL_DEFAULT_HOME = process.env.VUE_APP_HOME_PATH
const routes = [
  { path: '/', redirect: LOCAL_DEFAULT_HOME || '/entry' },
  {
    path: '/selectDemo',
    component: require('../SelectDemos/index').default,
    children: [
      {
        path: '/',
        redirect: 'multiple',
      },
    ].concat(selectDemos),
  },
  {
    path: '/tableDemo',
    component: require('../TableDemos/index').default,
    children: [
      {
        path: '/',
        redirect: 'basic',
      },
    ].concat(tableDemos),
  },
  {
    path: '/treeTableDemo',
    component: require('../TreeTableDemos/index').default,
    children: [
      {
        path: '/',
        redirect: 'basicTree',
      },
    ].concat(treeTableDemos),
  },
  {
    path: '/treeDemo',
    component: require('../TreeDemos/index').default,
    children: [
      {
        path: '/',
        redirect: 'base',
      },
    ].concat(treeDemos)
  },
  {
    path: '/dateDemo',
    component: require('../DateDemos/index').default,
    children: [
      {
        path: '/',
        redirect: 'dateBase',
      },
    ].concat(dateDemos),
  },
  {
    path: '/selectTreeDemo',
    component: require('../SelectTreeDemos/index').default,
    children: [
      {
        path: '/',
        redirect: 'base'
      },
    ].concat(selectTreeDemos)
  }
].concat(Views).concat(demos)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
