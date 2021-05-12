import Mock from 'mockjs'
const bizMockData = require('./bizMenus.json')

export const initMockMutiMenu = (level = 3) => {
  return Mock.mock({
    'array|2-10': [
      {
        uuid: () => Mock.Random.uuid(),
        icon: 'layout-iconfont h-layout-icon-smile',
        title: () => Mock.Random.ctitle(2, 8),
        isFavour: () => false,
        url: () => '/' + Mock.Random.word() + '/' + Mock.Random.uuid(),
        favourItemList: [],
        children: () => {
          if (level === 1) return
          return Mock.mock({
            'array|1-15': [
              {
                uuid: () => Mock.Random.uuid(),
                title: () => Mock.Random.ctitle(2, 20),
                isFavour: () => false,
                url: () => '/' + Mock.Random.word() + '/' + Mock.Random.uuid(),
                children: () => {
                  if (level === 2) return
                  return Mock.mock({
                    'array|1-9': [
                      {
                        uuid: () => Mock.Random.uuid(),
                        title: () => Mock.Random.ctitle(2, 14),
                        isFavour: () => false,
                        url: () => '/' + Mock.Random.word() + '/' + Mock.Random.uuid(),
                      },
                    ],
                  }).array
                },
              },
            ],
          }).array
        },
      },
    ],
  }).array
}

export const systemList = [
  {
    title: '菜单项混合',
    uuid: '68bfd437-2AF7-9B87-d9DD-ede2d2865bc6',
    children: initMockMutiMenu(1)
      .concat(initMockMutiMenu(2))
      .concat(initMockMutiMenu(3)),
  },
  {
    title: '三级菜单',
    uuid: 'aD9bc157-d314-EE8D-1bcd-c17eE1f2ee25',
    children: initMockMutiMenu()
  },
  {
    title: '二级菜单',
    uuid: 'fd97eCef-c4b5-C4cB-0cEf-0bfCE1d7BAfa',
    children: initMockMutiMenu(2),
  },
  {
    title: '单项菜单',
    uuid: '4c2E2E53-A796-1eAB-a81E-1d90e2ff28Cb',
    children: initMockMutiMenu(1),
  },
  bizMockData,
  { title: '客户中心', uuid: 'abaEc27C-Bf9b-31fd-6CbC-dFCFE5CAE978' },
  { title: '子系统八', uuid: '7caC2A78-Ed90-aA9d-89DB-14FCc4ffB61c' },
  { title: '子系统十', uuid: 'B2D2e35D-f5Ac-cEb0-443b-Db0e6BEFd687' },
  { title: '子系统十一', uuid: 'EECFFEAc-CEB4-Ddae-957C-Ded8b17885FA' },
  { title: '子系统十二', uuid: 'EeDc965B-0B7A-ecda-6660-E3A6FDcc1eFF' },
]
