export function initDemoSubSys (layoutWrap) {
  if (!layoutWrap || !layoutWrap.$t) {
    return []
  }
  const i18n = layoutWrap.$i18n
  const demoSysMenu = {
    uuid: '9e4691b3-0267-4821-8b76-27aab67146bb',
    title: i18n.t('hui.frameLayoutDemo.systemName'),
    children: [
      {
        uuid: 'd79ad300-b5f8-4a4c-a32b-d41ba2dd4896',
        icon: 'layout-iconfont h-layout-icon-smile',
        title: i18n.t('hui.frameLayoutDemo.home'),
        url: '/home',
        canFavour: false,
      },
      {
        uuid: 'fb2ffe71-d74d-43c6-85ff-f1db689e61c4',
        icon: 'layout-iconfont h-layout-icon-smile',
        title: i18n.t('hui.frameLayoutDemo.bizMenuTab'),
        url: '/customTabExample/customTab',
        canFavour: false,
      },
      {
        uuid: 'fb2ffe71-d74d-43c6-85ff-f1db689e61c5',
        icon: 'layout-iconfont h-layout-icon-smile',
        title: '代码触发锁屏示例代码',
        url: '/customTabExample/lockScreen',
        canFavour: false,
      },
      {
        uuid: 'fb2ffe71-d74d-43c6-85ff-f1db689e61c6',
        icon: 'layout-iconfont h-layout-icon-smile',
        title: 'hash 模式子系统',
        url: '/customTabExample/#/customTab',
        canFavour: false,
      },
      {
        uuid: 'fb2ffe71-d74d-43c6-85ff-f1db689e61c7',
        icon: 'layout-iconfont h-layout-icon-smile',
        title: 'iframe 模拟一',
        url: 'www.baidu.com',
        canFavour: false,
        originData: {
          menu_type: 'iframe'
        }
      },
      {
        uuid: 'fb2ffe71-d74d-43c6-85ff-f1db689e61c8',
        icon: 'layout-iconfont h-layout-icon-smile',
        title: 'iframe 模拟二',
        url: 'www.bing.com',
        canFavour: false,
        originData: {
          menu_type: 'iframe'
        }
      },
    ],
  }
  return [demoSysMenu]
}
