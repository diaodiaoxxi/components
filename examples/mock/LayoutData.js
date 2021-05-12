import Mock from 'mockjs'

const bizMockData = require('./bizMenus.json').data
export const mockTab48 = [
  { title: '王张为', closable: true },
  { title: '或感委今元深', closable: true },
  { title: '法所军酸表较导', closable: true },
  { title: '作造济则青由还', closable: true },
  { title: '么儿院人大', closable: true },
  { title: '油候什院一因', closable: true },
  { title: '去直转边', closable: true },
  { title: '时压积公', closable: true },
  { title: '争取外林门应资', closable: true },
  { title: '已界证论理决效', closable: true },
  { title: '住论风省重', closable: true },
  { title: '志议器开红周规', closable: true },
  { title: '必相次四飞', closable: true },
  { title: '次开料好住议', closable: true },
  { title: '业目第矿应中', closable: true },
  { title: '火形规状代状包', closable: true },
  { title: '实算等清', closable: true },
  { title: '土确思复产持', closable: true },
  { title: '存同八把', closable: true },
  { title: '步现器所约', closable: true },
  { title: '千叫本门', closable: true },
  { title: '细一示维律五', closable: true },
  { title: '心厂总义情关', closable: true },
  { title: '将信权程争今', closable: true },
  { title: '应关容从', closable: true },
  { title: '部表对', closable: true },
  { title: '矿海根候节然条', closable: true },
  { title: '平复复义都主', closable: true },
  { title: '天按低二度', closable: true },
  { title: '特几此设活', closable: true },
  { title: '王解指素动容', closable: true },
  { title: '际之片究风因精', closable: true },
  { title: '率才见正毛', closable: true },
  { title: '原员持几周机水', closable: true },
  { title: '段持火', closable: true },
  { title: '在会特选高', closable: true },
  { title: '青相此王', closable: true },
  { title: '世因八', closable: true },
  { title: '装格达们议', closable: true },
  { title: '风就和务至育', closable: true },
  { title: '县满亲起新眼利', closable: true },
  { title: '叫道易个', closable: true },
  { title: '代采该而', closable: true },
  { title: '料组器市全发', closable: true },
  { title: '选整色取院内', closable: true },
  { title: '六八发公这本', closable: true },
  { title: '华新路三', closable: true },
  { title: '油被题', closable: true },
]
export const navbarTestData = [
  {
    uuid: '2',
    title: '示例菜单 1-2',
    url: '/foo/#/home',
    children: [],
    closable: true,
    isCanRefresh: true,
  },
  {
    uuid: '3',
    title: '示例菜单 1-3',
    url: '/foo/#/test',
    children: [],
    closable: true,
    isCanRefresh: true,
  },
  {
    uuid: '4',
    title: '示例菜单 1-4',
    url: '/foo/#/test',
    children: [],
    closable: true,
    isCanRefresh: true,
  },
]

export const menusForHui = [
  {
    app_code: 'demo',
    title: '示例',
    children: [
      {
        title: '示例菜单一',
        children: [
          {
            title: '示例菜单 1-1',
            url: '/foo/#',
            children: [
              {
                title: '示例菜单 1-1-1',
                url: '/foo/#',
              },
              {
                title: '示例菜单 1-1-2',
                url: '/foo/#/home',
              },
            ],
          },
          {
            title: '示例菜单 1-2',
            url: '/foo/#/home-1',
            children: [
              {
                title: '示例菜单 1-2-1',
                url: '/foo/#/tool',
              },
            ],
          },
        ],
      },
      {
        title: '示例菜单二',
        url: '/foo/#/about',
      },
    ],
  },
  {
    app_code: 'test',
    title: '示例二',
    children: [
      {
        title: '示例二',
        children: [
          {
            title: '示例二 1-1',
            url: '/foo/#',
            children: [
              {
                title: '示例二 1-1-1 ',
                url: '/foo/#',
              },
              {
                title: '示例二 1-1-2',
                url: '/foo/#/home',
              },
            ],
          },
          {
            title: '示例二 1-2',
            url: '/foo/#/home-1',
            children: [
              {
                title: '示例二 1-2-1',
                url: '/foo/#/tool',
              },
            ],
          },
        ],
      },
      {
        title: '示例二 2',
        url: '/foo/#/about',
      },
    ],
  },
]

export const mockMutiMenu = Mock.mock({
  'array|1-8': [
    {
      uuid: () => Mock.Random.uuid(),
      icon: 'layout-iconfont h-layout-icon-smile',
      title: () => Mock.Random.ctitle(2, 5),
      isFavour: () => Mock.Random.boolean(),
      url: () => '/' + Mock.Random.word() + '/' + Mock.Random.uuid(),
      children: () =>
        Mock.mock({
          'array|1-15': [
            {
              uuid: () => Mock.Random.uuid(),
              title: () => Mock.Random.ctitle(14),
              isFavour: () => Mock.Random.boolean(),
              url: () => '/' + Mock.Random.word() + '/' + Mock.Random.uuid(),
              children: () =>
                Mock.mock({
                  'array|3-9': [
                    {
                      uuid: () => Mock.Random.uuid(),
                      title: () => Mock.Random.ctitle(),
                      isFavour: () => Mock.Random.boolean(),
                      url: () => '/' + Mock.Random.word() + '/' + Mock.Random.uuid(),
                    },
                  ],
                }).array,
            },
          ],
        }).array,
    },
  ],
}).array

export const mockFullmenuTabs = Mock.mock({
  'array|30': [
    {
      id: () => Mock.Random.uuid(),
      title: () => Mock.Random.ctitle(),
      isActive: () => false,
      closable: () => true,
    },
  ],
}).array

export const mockFullmenuData = Mock.mock({
  'array|10': [
    {
      uuid: () => Mock.Random.uuid(),
      title: () => Mock.Random.ctitle(14),
      isFavour: () => Mock.Random.boolean(),
      children: () =>
        Mock.mock({
          'array|1-15': [
            {
              uuid: () => Mock.Random.uuid(),
              title: () => Mock.Random.ctitle(),
              isFavour: () => Mock.Random.boolean(),
            },
          ],
        }).array,
    },
  ],
}).array

export const mockTabs = Mock.mock({
  'array|48': [
    {
      title: () => Mock.Random.ctitle(),
      closable: () => true,
    },
  ],
}).array

export const systemList2 = ([
  { title: '通知中心', uuid: 'aD9bc157-d314-EE8D-1bcd-c17eE1f2ee25' },
  { title: '权益中心', uuid: 'fd97eCef-c4b5-C4cB-0cEf-0bfCE1d7BAfa' },
  { title: '认证中心', uuid: '4c2E2E53-A796-1eAB-a81E-1d90e2ff28Cb' },
  { title: '用户中心', uuid: '68bfd437-2AF7-9B87-d9DD-ede2d2865bc6' },
  { title: '客户中心', uuid: 'abaEc27C-Bf9b-31fd-6CbC-dFCFE5CAE978' },
  { title: '子系统八', uuid: '7caC2A78-Ed90-aA9d-89DB-14FCc4ffB61c' },
  { title: '子系统十', uuid: 'B2D2e35D-f5Ac-cEb0-443b-Db0e6BEFd687' },
  { title: '子系统十一', uuid: 'EECFFEAc-CEB4-Ddae-957C-Ded8b17885FA' },
  { title: '子系统十二', uuid: 'EeDc965B-0B7A-ecda-6660-E3A6FDcc1eFF' },
])

export const systemList = [{
  uuid: 'BIZFRAME',
  title: '用户权限系统',
  url: '',
  isFavour: false,
  children: [
    {
      uuid: 'bizMenu',
      title: '系统菜单',
      icon: 'layout-iconfont h-layout-icon-smile',
      url: '',
      favourItemList: [],
      isFavour: false,
      children: [
        {
          uuid: 'bizUserManager',
          title: '用户管理',
          icon: 't-b-userallocation',
          url: '',
          children: [
            {
              uuid: 'bizSetUser',
              title: '用户设置',
              url: '/bizMenu/bizUserManager/bizSetUser',
              isFavour: false
            },
          ],
          isFavour: false
        },
        {
          uuid: 'bizSysManager',
          title: '系统管理',
          icon: 't-b-system',
          url: '',
          children: [
            {
              uuid: 'bizSetParam',
              title: '系统参数设置',
              icon: 'bizframe/images/bizSetParam.png',
              url: '/bizMenu/bizSysManager/bizSetParam',
              isFavour: false
            },
            {
              uuid: 'bizSetNotice',
              title: '公告管理',
              icon: 'bizframe/images/bizSetNotice.png',
              url: '/bizMenu/bizSysManager/bizSetNotice',
              isFavour: false
            }
          ],
          isFavour: false
        },
        {
          uuid: 'bizMsgManager',
          title: '消息管理',
          icon: 't-b-message',
          url: '',
          children: [
            {
              uuid: 'bizEmailInbox',
              title: '消息收件箱',
              icon: 'bizframe/images/bizEmailInbox.png',
              url: '/bizMenu/bizMsgManager/bizEmailInbox',
              isFavour: false
            },
            {
              uuid: 'bizEmailOutbox',
              title: '消息发件箱',
              icon: 'bizframe/images/bizEmailOutbox.png',
              url: '/bizMenu/bizMsgManager/bizEmailOutbox',
              isFavour: false
            }
          ],
          isFavour: false
        }
      ]
    }
  ]
}]
