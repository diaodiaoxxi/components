import hCore from 'hui-core'
import {
  isEmpty,
  isPlainObject,
  get,
  omit,
  defaults,
  compact,
  mapTree,
  getBrowerInfo,
  camelCaseObj,
  snakeCaseObj,
} from './index'
import { initDemoSubSys } from './demoSys'
import BizSecurity from './BizSecurity'
import logger from './logger'

const fetch = hCore.ajax
const console = logger('bizApi')
console.warn('*env*', process.env.NODE_ENV)

/**
 * loginRes 来自 submitLogin 登录接口返回结果
 * currentUserRes 来自 getCurrUser 获取当前用户信息接口返回结果
 * loginRes.operator_code == currentUserRes.user_id
 */

// 操作员中心接口报错封装
export class BizApiError extends Error {
  constructor (message, response) {
    super(message)
    this.response = response
    this.name = 'BizApiError'
  }
}

/**
 * 操作员中心 框架接口
 */
export default class BizApi {
  constructor () {
    // 是否显示框架示例
    this.needDemo = get(window, ['FRAME_CONFIG', 'IS_NEED_DEMO'], false)
    // 是否开启用户行为记录
    this.isSaveUserBehavior = get(window, ['FRAME_CONFIG', 'IS_RECORD_USER_BEHAVIOR'], false)
    // 是否为单点登录
    this.casLoginEnabled = get(window, 'FRAME_CONFIG.CAS_LOGIN_ENABLED', false)
    this.casLoginUrl = get(window, 'FRAME_CONFIG.CAS_LOGIN_URL', '/login')
    this.casLogoutUrl = get(window, 'FRAME_CONFIG.CAS_LOGOUT_URL', '/login')
    this.isCanRefresh = get(window, 'FRAME_CONFIG.IS_CAN_REFRESH_APP', false)
    // frame-layout 组件包裹页面
    this.layoutWrap = null
    // 与 组件通信同步的状态 注入到 skeleton data 中使用
    this.store = {
      appName: '/',
      userName: '/',
      loginTime: '/',
      version: '/',
      isShowEditUser: false,
      isShowResetPassword: false,
      isCheckPwd: false, // 是否开启初始化密码检查
      isLockScreen: false,
      isShowSpace: false, // 是否开启空间切换
      isShowTenant: false, // 是否显示多租户 // getCurrUser 内判断
      horizontalPopperMenu: false, // 菜谱菜单是否为水平排列
      systemList: [],
      favourMenuItemList: [],
      loginInfo: {}, // 登录接口获取的用户信息
      userInfo: {}, // getCurrUser 接口获取的用户信息
      pwdInfo: {
        pwdStandard: {}, // 密码强度
        isDefaultPwd: false,
        isExpiredPwd: false,
        expiredDays: null,
        isNeedExipiredConfirm: false,
      },
      menuItemMap: {}, // 菜单项索引
      tenantList: [], // 多租户列表
      spaceList: [], // 可切换空间列表
      bizMenuList: [],
      bizMenuMap: {},
    }

    this.Error = BizApiError
    /**
     *  fetch 采用 hCore.ajax, 统一拦截器在 src/index before-request-send,after-request-send 内
     *  原操作员中心 isUrlLowercase,添加 time 时间戳 ，res.data res.data.result 差异兼容适配 在此统一统一拦截器内操作
     */
    // 在hCore.ajax 统一添加 response 结果拦截
    const responseInterceptor = res => {
      return res.data
    }
    this.fetch = (config = {}) => {
      return fetch(config).then(responseInterceptor)
    }

    this.fetch.get = function (url, config = {}) {
      Object.assign(config, { url, method: 'get' })
      return fetch(config).then(responseInterceptor)
    }
    this.fetch.post = function (url, data = {}, config = {}) {
      Object.assign(config, { url, method: 'post', data })
      return fetch(config).then(responseInterceptor)
    }
  }

  // 初始化获取系统列表 与 收藏菜单
  async init (config = {}) {
    console.log('init', config, this)
    const defaultConfig = {
      layoutWrap: {}, // 导航组件对接的页面模板
      locale: 'zh-CN',
    }
    config = defaults(config, defaultConfig)
    const { locale, layoutWrap } = config
    this.layoutWrap = layoutWrap
    // cas 单点登录里利用 getCurrUser 302 重定向到单点登录页
    await this.getLoginInfo()

    return Promise.all([
      this.getAppName(locale),
      this.getCurrUser(),
      this.getMenus(locale),
      this.getFavourMenuItemList(locale),
      this.getDefaultProps(layoutWrap),
    ]).then(() => {
      return this
    })
  }

  // 获取密码相关配置
  async getPwdConfig () {
    if (!this.store.isCheckPwd) {
      return this.store.pwdInfo
    }
    // 获取重置密码校验强度,同步到 重置密码弹窗组件中
    const pwdStandard = await this.checkPwdStandard()
    // 检查当前登录用户密码是否为初始化密码，是则必须修改密码方可进入系统
    const isDefaultPwd = await this.checkDefaultPwd()
    // 检查密码是否过期,未过期获取
    const isExpiredPwd = await this.checkPwdExpired()
    let expiredDays = null
    let isNeedExipiredConfirm = false
    if (!isExpiredPwd) {
      expiredDays = await this.getPwdExpiredDays()
      isNeedExipiredConfirm = expiredDays && expiredDays <= 3
    }
    this.store.pwdInfo = Object.freeze({
      pwdStandard, // 密码强度
      isDefaultPwd,
      isExpiredPwd,
      expiredDays,
      isNeedExipiredConfirm,
    })
    return this.store.pwdInfo
  }

  // // 缓存刷新时需要还原的信息
  // setBizStorageWatch(){
  //   if(this.layoutWrap && this.layoutWrap._isVue){
  //     this.layoutWrap.$watch(
  //       function(){
  //       let { tabList, activeMenuItem } = this;
  //       return {
  //         tabList,
  //         activeMenuItem,
  //       };
  //     },
  //     function(val){
  //       this.$hCore.storage.setData({
  //         key: 'bizStorage',
  //         value: val,
  //       });
  //     })
  //   }
  // }

  // 获取登录信息, 在 login.vue 中 hCore.storage 中存入 localStorage
  async getLoginInfo () {
    let loginInfo = await hCore.storage.getData({ key: 'user' }).catch(e => null)
    console.log('login user info', loginInfo)
    if (!loginInfo) {
      // 非单点登录跳转login
      // TODO 利用 401 弹窗跳转登录页
      return
    }
    loginInfo = JSON.parse(loginInfo)
    loginInfo = camelCaseObj(loginInfo)
    this.store.loginInfo = Object.freeze(loginInfo)
    return loginInfo
  }

  // 登录-获取加密钥key
  getKeys (key1, key2) {
    this.fetch.post('/getSecurityKey', {
      key1: key1,
      key2: key2,
    })
  }

  /**
   * 加密
   * @param param
   */
  encryptParam (param) {
    const key1 = 'hs'
    const key2 = 'club'
    const key3 = '33#44'
    return BizSecurity.DES.encrypt(param, key1, key2, key3)
  }

  // 重新登录
  reLogin (username, password, tenantId, kindCode) {
    const key1 = 'hs'
    const key2 = 'club'
    const key3 = '33#44'
    const ipAddr = this.store.loginInfo.clientIp || ''
    const _this = this
    // TODO AES 加密类型切换 webEncryptType === 'AES'
    // 原操作员中心 let webEncryptType = LOCAL_CONFIG.webEncryptType + '';

    const operatorCode = BizSecurity.DES.encrypt(username, key1, key2, key3)
    const passwordEncrypt = BizSecurity.DES.encrypt(password, key1, key2, key3)
    const initData = {
      user: username,
      password,
      tenantId,
      kindCode,
      ipAddr,
    }
    const data = {
      operatorCode,
      password: passwordEncrypt,
      tenantId,
      kindCode,
      ipAddr,
    }

    return fetch
      .post('/unlock.json', snakeCaseObj(data))
      .then(res => res.data)
      .catch(e => {
        if (e.error_code === 401) {
          // unlock.json 401 失效后重新登录
          console.log('unlock.json 401', e, data, snakeCaseObj(initData), _this)
          return _this.login(snakeCaseObj(initData), {})
        }
        return Promise.reject(e)
      })
  }

  // 登录接口,在 login.vue 中
  login (data = {}, { otherData }) {
    console.warn('BizSecurity', BizSecurity)
    return this.fetch
      .post('/submitLogin', {
        operator_code: BizSecurity.DES.encrypt(data.user, 'hs', 'club', '33#44'), // 登录用户ID
        password: BizSecurity.DES.encrypt(data.password, 'hs', 'club', '33#44'), // 登录密码
        tenant_id: data.tenantId || '', // 租户ID
        kind_code: data.kindCode,
        verify_code: data.checkCode, // 验证码
        uuid: data.checkCodeId || '', // 验证码 uuid
        email_verification_code: '',
        mac: data.mac,
        ...otherData,
        // ip_addr: data.ipAddress // 原 getUserIP 被移除
      })
      .then(res => {
        console.log('login api res', res)
        this.saveUserBehaviorLog({
          appKey: data.mac,
          actionId: 'login',
          consumerId: res.operator_code,
          ipAddr: res.ip_addr,
        })
        return res
      })
  }

  // 重设密码
  resetPwd (oldPassword, newPassword) {
    const key1 = 'hs'
    const key2 = 'club'
    const key3 = '33#44'
    oldPassword = BizSecurity.DES.encrypt(oldPassword, key1, key2, key3)
    newPassword = BizSecurity.DES.encrypt(newPassword, key1, key2, key3)
    const data = {
      oldPassword,
      newPassword,
    }
    return this.fetch.post('/updatePwd', data)
  }

  // 登出
  logout () {
    return hCore.storage
      .getData({ key: 'user' })
      .then(user => {
        user = JSON.parse(user)
        return this.saveUserBehaviorLog({
          actionId: 'logout',
          consumerId: user.operator_code || '',
          ipAddr: user.ip_addr || '',
        }).then(() => user)
      })
      .then(user => {
        if (this.casLoginEnabled) {
          hCore.storage.deleteData({ key: 'user' }).catch(() => {})
          hCore.storage.deleteData({ key: 'bizStorage' }).catch(() => {})
          window.location.href = this.casLogoutUrl + '?service=' + window.location.href
          return
        }
        return this.fetch.post('/logout', { ip_addr: user.ip_addr || '' })
          .then(async () => {
            const router = get(this.layoutWrap, '$root.$router')
            if (router) {
              router.replace('/login', () => { router.go(0) })
              return
            }
            hCore.navigate('/login', {}, { })
            await this.layoutWrap.$nextTick()
            window.location.reload()
          })
      })
      .catch(async e => {
        console.warn('*logout error*', e)
        hCore.storage.deleteData({ key: 'user' }).catch(() => {})
        hCore.storage.deleteData({ key: 'bizStorage' }).catch(() => {})
        if (this.casLoginEnabled) {
          window.location.href = this.casLogoutUrl + '?service=' + window.location.href
          return
        }
        const router = get(this.layoutWrap, '$root.$router')
        if (router) {
          router.replace('/login', () => { router.go(0) })
          return
        }
        hCore.navigate('/login', {}, { })
        await this.layoutWrap.$nextTick()
        window.location.reload()
        return Promise.reject(e)
      })
  }

  // IAR登出接口
  casLogout () {
    return this.fetch.post('/cas/user/logout')
  }

  // 获取数据字典，修改用户弹窗中使用
  getDict (lang = 'zh-CN') {
    // TODO 兼容非微服务方式
    const DICT_LIST = ['BIZ_CIDENTTYPE', 'SYS_USER_WORK_STATE', 'BIZ_MSG_TYPE']
    return Promise.all(
      DICT_LIST.map(name => {
        return this.fetch.get('/getDict', {
          data: {
            lang,
            dict_name: name,
          },
        })
      }),
    ).then(res => {
      const DICT_MAP = {}
      DICT_LIST.map((name, i) => {
        DICT_MAP[name] = res[i]
      })
      return DICT_MAP
    })
  }

  // 获取当前登录用户信息
  getCurrUser () {
    return this.fetch.post('/getCurrUser').then(res => {
      this.store.userName = res.user_name
      this.store.loginTime = res.last_login_time
      // res 存入 userInfo
      // userInfo 数据校验
      const userInfo = camelCaseObj(res)
      userInfo.filterMsgType = userInfo.filterMsgType || ''
      // 后台 getCurrUser 接口更新返回 env_id,env_name 有问题, 原操作员中心为利用 sessionStorage 保存
      userInfo.envId = window.sessionStorage.getItem('envId')
      userInfo.envName = window.sessionStorage.getItem('envName')
      this.store.userInfo = Object.freeze(userInfo)
      // 显示，隐藏租户逻辑判断
      const { userId, tenantId } = userInfo
      this.store.isShowTenant = this.store.isShowTenant && !(userId == 'admin' || tenantId == '')
    })
  }

  // 修改用户信息提交
  updateUserInfo (userInfo) {
    if (!userInfo) {
      throw new Error('updateUserInfo must has userInfo')
    }
    // 财富接口参数删除
    delete userInfo.msgType
    delete userInfo.orgUserIds
    delete userInfo.orgUserPaths
    delete userInfo.userFilters
    delete userInfo.tenantIdArr
    delete userInfo.childTenantIds
    userInfo = snakeCaseObj(userInfo)
    console.log('editUserInfo', userInfo)
    return this.fetch.post('/updateUserInfo', userInfo).then(res => {
      if (+res.return_code !== 0) {
        throw new BizApiError(res.return_info, res)
      }
      return res
    })
  }

  // 获取 子系统 及 侧边栏菜单
  getMenus (lang = 'zh-CN') {
    return (
      this.fetch
        .post('/getUserAuthMenus', { lang })
        // after-request-send 拦截器内 单条数据 会被返回为对象
        .then(res => {
          if (isPlainObject(res)) {
            return [res]
          }
          return res
        })
        .then(systemList => {
          // 数据 map 清空
          this.store.menuItemMap = {}
          this.store.bizMenuMap = {}

          this.store.bizMenuList = systemList
          systemList = systemList.map(bizSubSystem => {
            // TODO bizSubSystem 必要参数完整性校验
            const subSystem = {}
            subSystem.uuid = bizSubSystem.id
            subSystem.title = bizSubSystem.title || '/'
            subSystem.children = bizSubSystem.children || []
            subSystem.originData = Object.freeze(omit(bizSubSystem, ['children']))

            this.store.menuItemMap[subSystem.uuid] = subSystem

            subSystem.children = mapTree(
              // TODO menuItem 必要参数完整性校验
              bizSubSystem.children || [],
              (item, path) => {
                // item 为空时移除该节点, 统一处理操作员中心不同版本该字段为字符串
                if (item.is_hidden + '' == 'true') {
                  return null
                }
                const menuItem = {}
                // 根据 path 中 children的数量获取当前项层级
                const result = path.match(/children/g)
                const level = !result ? 0 : result.length
                // 后端接口未设置 iconfont 时默认设置 fontFamily 为 iconfont
                menuItem.icon = item.icon
                  ? `${item.icon} ${item.font_name || 'iconfont'} icon-${item.icon}`
                  : 'layout-iconfont h-layout-icon-smile'
                menuItem.uuid = item.id
                menuItem.title = item.title || '/'
                menuItem.url = item.url
                menuItem.isFavour = false
                menuItem.isCanRefresh = this.isCanRefresh
                menuItem.favourItemList = []
                // 菜单层级 >=1 并且没有 children 标题菜单项才可收藏
                menuItem.canFavour = level >= 1 && isEmpty(item.children)
                menuItem.canSelect = !!item.url
                menuItem.children = isEmpty(item.children) ? undefined : item.children
                menuItem.originData = Object.freeze(omit(item, ['children']))
                this.store.menuItemMap[menuItem.uuid] = menuItem
                this.store.bizMenuMap[menuItem.uuid] = menuItem.originData
                return menuItem
              },
              { keepNode: false },
            )

            return subSystem
          })

          // 是否插入示例
          const appendDemoSys = needDemo => {
            if (needDemo) {
              const demoSystem = initDemoSubSys(this.layoutWrap)
              mapTree(demoSystem, item => {
                this.store.menuItemMap[item.uuid] = item
              })
              return demoSystem
            }
            return []
          }
          this.store.systemList = appendDemoSys(this.needDemo).concat(systemList)
          console.log('systemList', this.store.systemList)
        })
        .catch(error => {
          // const { error_message } = error
          // if (error_message) {
          //   return console.error(error_message)
          // }
          return console.error(error)
        })
    )
  }

  // 获取收藏菜单
  getFavourMenuItemList () {
    return this.fetch
      .post('/getIndexInfo')
      .then(res => {
        return res.menu_list
      })
      .then(favourItemList => {
        console.log('*favourItemList source*', favourItemList)
        // 所有菜单项添加收藏列表
        Object.keys(this.store.menuItemMap).forEach(key => {
          this.store.menuItemMap[key].favourItemList = []
        })

        console.log('*bizMenuMap*', this.store.bizMenuMap)
        console.log('*menuItemMap*', this.store.menuItemMap)

        // 将收藏项同步到全部菜单 与 菜谱菜单
        const favourMenuItemList = favourItemList.map(item => {
          // 是否已经在菜谱菜单项收藏项中
          const hasMenuItem = (menuItemParent, menuItem) => {
            return menuItemParent.favourItemList.find(item => item.uuid == menuItem.uuid)
          }

          // 从子系统开始获取 uuid 路径
          const getParentUuidPath = (menuUuid, parentPath) => {
            const parentUuid = get(this.store.bizMenuMap, [menuUuid, 'parent_id'])
            if (!parentUuid) return parentPath
            parentPath.unshift(parentUuid)
            return getParentUuidPath(parentUuid, parentPath)
          }

          // console.log(getParentUuidPath(item.id, []));
          // 菜谱菜单项层级深度,在 systemList 第二层
          const getMenuItemParentUuid = menuItemUuid => {
            const path = getParentUuidPath(menuItemUuid, [])
            return get(path, ['1'])
          }

          const menuItem = get(this.store.menuItemMap, [item.id])
          const cookMenuUuid = getMenuItemParentUuid(item.id)
          const menuItemParent = get(this.store.menuItemMap, [cookMenuUuid])

          if (menuItem) {
            menuItem.isFavour = true
          }
          if (menuItem && menuItemParent && !hasMenuItem(menuItemParent, menuItem)) {
            menuItemParent.favourItemList.push(menuItem)
          }
          return menuItem
        })

        console.log('*favourMenuItemList*', favourMenuItemList)
        console.log('*favourMenuItemList after compact*', compact(favourMenuItemList))
        // fix: 获取收藏菜单的条目可能在菜单列表中不存在
        this.store.favourMenuItemList = compact(favourMenuItemList)
      })
  }

  // 锁屏
  lockScreen () {
    return this.fetch.post('/lock.json').then(res => {
      return res
    })
  }

  // 解锁屏幕
  unLockScreen (password) {
    const { operatorCode: userName, tenantId, kindCode } = this.store.loginInfo
    return this.reLogin(userName, password, tenantId, kindCode).then(res => {
      if (get(window, 'FRAME_CONFIG.API_IAR_ENABLED') && res.data.length === 1) {
        res = res.data[0]
      }
      if (res && +res.return_code !== 0) {
        throw new BizApiError(res.return_info, res)
      }
      return res
    })
  }

  // 重置密码
  resetPassword (data = { oldPassword: '', newPassword: '' }) {
    if (!(data.oldPassword && data.newPassword)) {
      throw new BizApiError('/updatePwd data is empty')
    }
    // TODO 重置密码加密
    // let { oldPassword, newPassword } = data
    // const key1 = 'hs'
    // const key2 = 'club'
    // const key3 = '33#44'
    // oldPassword = BizSecurity.DES.encrypt(oldPassword, key1, key2, key3)
    // newPassword = BizSecurity.DES.encrypt(newPassword, key1, key2, key3)
    const param = snakeCaseObj(data)
    return this.fetch.post('/updatePwd', param).then(res => {
      if (res && +res.return_code !== 0) {
        throw new BizApiError(res.return_info, res)
      }
      return res
    })
  }

  // 侧边栏添加收藏
  addFavoriteItem (param = { menu_code: '', has_children: false }) {
    // param {menu_code: menuItem.uuid, has_children: !!menuItem.children }
    return this.fetch.post('/insertUserMenuFavorite', param).then(res => {
      if (res && +res.return_code !== 0) {
        throw new BizApiError(res.return_info || 'insertUserMenuFavorite error', res)
      }
      return res
    })
  }

  // 侧边栏移除收藏
  delFavoriteItem (param = { menu_code: '', has_children: false }) {
    return this.fetch.post('/deleteByMenuCodeAndUserId', param).then(res => {
      if (res && +res.return_code !== 0) {
        throw new BizApiError(res.return_info || 'deleteByMenuCodeAndUserId error', res)
      }
      return res
    })
  }

  // 侧边栏收藏排序
  orderMenuFavourItemList (favourItemList) {
    const formatPostParam = favourItemList => {
      return favourItemList.map((item, index) => {
        return { menu_code: item.id, order_no: index + 1 }
      })
    }
    const param = formatPostParam(favourItemList)
    return this.fetch.post('/sortMenuFavoriteByUserId', param)
  }
  // 获取锁屏时间

  // 检查当前登录用户密码是否为初始化密码，是则必须修改密码方可进入系统
  checkDefaultPwd () {
    return this.fetch.get('/checkDefaultPwd').then(res => {
      return res.result == 'true'
    })
  }

  // 检查密码过期
  checkPwdExpired () {
    return this.fetch.get('/checkPwdExpired').then(res => {
      return res.result == 'true'
    })
  }

  // 检查密码过期 剩余天数
  getPwdExpiredDays () {
    return this.fetch.get('/expiredDays').then(res => res.result)
  }

  // 获取密码验证强度标准
  checkPwdStandard () {
    return this.fetch.get('/getCheckedPwdStandard').then(res => {
      return res
    })
  }

  // 获取系统配置参数
  getSystemParam (key) {
    return this.fetch.post('/getParamterById', { id: key }).then(res => {
      return res
    })
  }

  /**
   * 记录用户行为分析
   * @param params
   * @param params.appKey：任意
   * @param params.consumerId：用户id
   * @param params.ipAddr：ip
   * @param params.ipPort：端口
   * @param params.deviceName：浏览器名称
   * @param params.deviceVersion：浏览器版本
   * @param params.actionId 用户行为标识 login logout openmenu 打开菜单 altermenu 跳转其他菜单
   */
  saveUserBehaviorLog (params) {
    // 是否开启用户行为记录
    if (!this.isSaveUserBehavior) {
      return Promise.resolve()
    }
    const browser = getBrowerInfo()
    const defaultParams = {
      app_key: 'omc',
      consumer_id: '', // user.operator_code,
      ip_addr: '', // user.ipAddress,
      ip_port: window.location.port,
      device_name: browser.type,
      device_version: browser.version,
      resolution: window.outerWidth + '*' + window.outerHeight,
    }
    let data = defaultParams
    if (params && isPlainObject(params)) {
      data = Object.assign({}, defaultParams, snakeCaseObj(params))
    }
    return this.fetch
      .post('/saveUserBehaviorLog', data)
      .then(res => {
        return res
      })
      .catch(e => {
        console.error('saveUserBehaviorLog error', e)
        return Promise.reject(e)
      })
  }

  // 获取多租户列表
  getUserTenant () {
    return this.fetch.get('/getUserTenantInfo').then(tenantList => {
      if (isPlainObject(tenantList)) {
        tenantList = [tenantList]
      }
      // 多租户系统级管理员不需要显示切换租户
      // user_id == 'admin' 移入 getCurrUser 判断
      this.store.tenantList = tenantList.map(item => {
        return {
          text: item.tenant_name,
          code: item.tenant_id,
        }
      })
      return this.store.tenantList
    })
  }

  // 多租户切换提交
  submitTenant (tenantId) {
    if (!tenantId) {
      throw new Error('submitTenant must has tenantId')
    }
    const { userId, userName } = this.store.userInfo
    const { systemNo: kindCode, userToken } = this.store.loginInfo
    let tenantParam = {
      userId: userId,
      operatorCode: userId,
      userName: userName,
      userToken: userToken,
      kindCode: kindCode,
      tenantCode: tenantId,
    }
    tenantParam = snakeCaseObj(tenantParam)
    return this.fetch.post('/userTenantChange', tenantParam).then(res => {
      if (+res.return_code !== 0) {
        throw new BizApiError(res.return_info, res)
      }
      return res
    })
  }

  // 获取空间信息
  getUserSpace () {
    const { userId } = this.store.userInfo
    return this.fetch.post('/getSpaceTreeByUserId', { user_id: userId }).then(spaceList => {
      if (isPlainObject(spaceList)) {
        spaceList = [spaceList]
      }
      this.store.spaceList = spaceList
    })
  }

  // 切换空间
  submitSpace (spaceNode) {
    const { userId } = this.store.userInfo
    let param = {
      userId,
      envId: spaceNode.id,
      newEnvId: spaceNode.id,
      isChangeLogin: true,
    }
    param = snakeCaseObj(param)
    return this.fetch.post('/reLogin', param).then(res => {
      if (+res.return_code !== 0) {
        throw new BizApiError(res.return_info, res)
      }
      // 后台 getCurrUser 接口更新返回 env_id,env_name 缓存, 原操作员中心为利用 sessionStorage 保存
      hCore.storage.setData({ key: 'envId', value: spaceNode.id })
      hCore.storage.setData({ key: 'envName', value: spaceNode.title })
      return res
    })
  }

  // 切换显示语言
  changeLang (lang) {
    return this.fetch.post('/languageChange', { lang }).then(res => {
      if (+res.return_code !== 0) {
        throw new BizApiError(res.return_info, res)
      }
      return res
    })
  }

  // 获取默认属性设置
  getDefaultProps (layoutWrap) {
    // this.needDemo = layoutWrap.needDemo
    // this.isSaveUserBehavior = layoutWrap.isSaveUserBehavior
    // this.casLoginEnabled = layoutWrap.casLoginEnabled
    // this.casLoginUrl = layoutWrap.casLoginUrl
    // this.casLogoutUrl = layoutWrap.casLogoutUrl
    // ------------------------------------
    this.store.version = layoutWrap.version
    this.store.isShowEditUser = layoutWrap.isShowEditUser
    this.store.isShowResetPassword = layoutWrap.isShowResetPassword
    this.store.isCheckPwd = layoutWrap.isCheckPwd
    this.store.isLockScreen = layoutWrap.isLockScreen
    this.store.isShowSpace = layoutWrap.isShowSpace
    this.store.isShowTenant = layoutWrap.isShowTenant
    this.store.horizontalPopperMenu = layoutWrap.horizontalPopperMenu
  }

  // 获取 appName 模拟 , 正常应替换为接口获取，目前为写入语言包内
  getAppName () {
    // TODO appName 多国语言设置
    let appName = get(this.layoutWrap, 'appName')
    if (appName && typeof appName == 'string') {
      this.store.appName = appName
      return appName
    }
    if (!this.layoutWrap || !this.layoutWrap.$t) {
      this.store.appName = '/'
      return appName
    }
    appName = this.layoutWrap.$t('hui.frameLayout.appName')
    this.store.appName = appName
    return appName
  }

  // 获取验证码
  getValidateCode () {
    return this.fetch.get('/loginHasValidateCode').then(res => {
      return res
    })
  }

  // 刷新图片验证码
  getVerifyCode () {
    return this.fetch.get('/getVerifyCode').then(res => {
      return res
    })
  }

  // 获取租户列表
  getTenantList () {
    return this.fetch.get('/getTenantList').then(res => {
      return res
    })
  }
}
