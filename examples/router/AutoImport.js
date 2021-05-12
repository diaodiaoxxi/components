// 利用 webpack require.context 批量引入
const importViews = function (
  webpackContext,
  routerFrontPath = '',
  isLazy = false
) {
  if (!webpackContext) return
  const routeParams = webpackContext.keys().map((key, i) => {
    // viewName : "./InstallPkg.vue"
    const viewName = key.replace(/^\.\/(.+).vue/, '$1')
    return {
      path: `${routerFrontPath}${viewName}`,
      name: `${routerFrontPath}${viewName}-${i}`,
      component: isLazy
        ? () => {
          return webpackContext(key)
        }
        : webpackContext(key).default
    }
  })
  return routeParams
}

const formatDemos = (demos) => {
  const rootCom = demos.find(item => item.path.includes('index'))
  const children = demos.filter(item => !item.path.includes('index'))
  const demoRouterTpl = {
    path: rootCom.path.replace('/index', ''),
    component: rootCom.component,
    children: [
      {
        path: '/',
        redirect: '/Menu/src/base'
      }
    ].concat(children)
  }
  return demoRouterTpl
}

const views = importViews(
  require.context('../views', true, /\.vue$/, 'lazy'),
  '/',
  true
)

const _demos = importViews(
  require.context('../demos', true, /\.vue$/, 'lazy'),
  '/',
  true
)

const demos = formatDemos(_demos)

const selectDemos = importViews(
  require.context('../SelectDemos/src', true, /\.vue$/, 'lazy'),
  '',
  true
)
const tableDemos = importViews(
  require.context('../TableDemos/src', true, /\.vue$/, 'lazy'),
  '',
  true
)
const treeTableDemos = importViews(
  require.context('../TreeTableDemos/src', true, /\.vue$/, 'lazy'),
  '',
  true
)
const treeDemos = importViews(
  require.context('../TreeDemos/src', true, /\.vue$/, 'lazy'),
  '',
  true
)
const dateDemos = importViews(
  require.context('../DateDemos/src', true, /\.vue$/, 'lazy'),
  '',
  true
)

const selectTreeDemos = importViews(
  require.context('../SelectTreeDemos/src', true, /\.vue$/, 'lazy'),
  '',
  true
)
export { views as default, views, selectDemos, tableDemos, demos, treeTableDemos, treeDemos, selectTreeDemos, dateDemos }
