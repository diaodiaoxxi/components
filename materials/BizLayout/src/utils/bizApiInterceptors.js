import { get, isPlainObject, isJSONStr, isFunction, camelCaseObj, defaults } from './index'
import logger from './logger'
const console = logger('bizApiInterceptors')

/**
 * 操作员中心接口统一拦截器
 * 整理自 hui 1.0 hui-pro/src/frame/api/api.js
 * @param {object} opts  相关配置项
 * @param {object} opts.handleMap 拦截器处理的逻辑 true 时开启，
 * @function beforeRequest 操作员中心统一请求前拦截处理
 * @function afterRequest 操作员中心统一请求前拦截处理
 */
class BizApiInterceptors {
  constructor (opts) {
    opts = defaults(opts, {
      app: {}, // hui core app
      APP: get(window, ['FRAME_CONFIG', 'APP'], []),
      API_HOME: get(window, ['FRAME_CONFIG', 'API_HOME'], '/'), // 请求前拼装的统一请求头
      IS_MICRO_SERVER: get(window, ['LOCAL_CONFIG', 'IS_MICRO_SERVER'], false) + '',
      CAS_LOGIN_ENABLED: get(window, 'FRAME_CONFIG.CAS_LOGIN_ENABLED', false),
      errorWhiteList: ['/logout', '/unlock.json'], // errorWhiteList 中的接口不走统一错误拦截提示
      errorWhitePageList: ['/login'], // 也秒 url 处于 errorWhitePageList 中的接口不走统一错误拦截提示
      RELOGIN_URL: get(window, ['FRAME_CONFIG', 'RELOGIN_URL'], null), // iframe 下重新登录跳转第三方
      reloginDialog: 'dialog', // 登录失效弹窗 'none' ：登录失效后直接跳转登录页， 'dialog' : 显示普通弹窗 'lockScreen': 显示锁屏
      reloginCallback: undefined, // 重新登录回调
      handleMap: {
        crsf: true, // 是否处理 crsf 请求头
        casLogin: true, // 是否处理单点登录
        microServerParam: true, // 兼容微服务方式，操作员中心以外的接口参数转为驼峰
        bizRequest: true, // 统一拼装 API_HOME 头， axios data 转为 formData ，会调用 next 中断后续代码逻辑
        bizResponse: true, // 操作状态码对应提示 操作员中心接口返回值处理 , 会调用 next 中断后续代码逻辑
      },
    })
    Object.assign(this, opts)
    this.bizCodeMap = {
      9004: { text: '您已被踢出,请先登录', i18n: 'm.i.fetchMsg.kickOut', reLogin: true },
      9005: { text: '您已在别地方登录,请先登录', i18n: 'm.i.fetchMsg.occupied', reLogin: true },
      9006: { text: '页面已经失效,请先登录', i18n: 'm.i.fetchMsg.pageTimeOut', reLogin: true },
      9007: { text: '会话已失效,请重新登录', i18n: 'm.i.fetchMsg.sessionTimeOut', reLogin: true },
      9008: { text: '对不起,您缺少访问权限', i18n: 'm.i.fetchMsg.unAuthorized' },
      9011: { text: '验证码出错', i18n: 'm.i.fetchMsg.verifyCode' },
      9021: { text: '锁屏状态不能操作，请先解锁', i18n: 'm.i.fetchMsg.lockScreenStatus' },
      401: { text: '会话已失效,请重新登录', i18n: 'm.i.fetchMsg.sessionTimeOut', reLogin: true },
      undefined: { text: '接口请求错误', i18n: 'm.i.fetchMsg.error' },
    }
    // fix 避免失效弹窗重复出现
    this.isErrorTipExist = false
    if (this.reloginDialog == 'none') {
      this.app.middleware('before-route-change', (to, from, next) => {
        console.log(this.app)
        next()
      })
    }
    console.warn('*constructor options*', this, opts)
  }

  // 操作员中心统一请求前拦截处理
  beforeRequest (...args) {
    let config = {}
    let next = () => {}
    if (args.length === 1 && isPlainObject(args[0])) {
      const opts = args[0]
      config = opts.config
      next = opts.next
    }
    if (args.length === 2) {
      config = args[0]
      next = args[1]
    }
    console.warn('*before request args*', args, config, next)
    this.crsfRequest({ config, next })
    this.casLoginRequest({ config, next })
    this.microServerRequest({ config, next })
    this.bizRequest({ config, next })
  }

  // 操作员中心统一 ajax 请求后处理
  afterRequest (...args) {
    let error = {}
    let response = {}
    let next = () => {}
    if (args.length === 1 && isPlainObject(args[0])) {
      const opts = args[0]
      error = opts.error
      response = opts.response
      next = opts.next
    }
    if (args.length === 3) {
      error = args[0]
      response = args[1]
      next = args[2]
    }
    if (error) {
      this.casLoginResponse({ response: error, next })
      this.bizResponseData({ response: error, next })
      this.bizResponseError({ error, next })
      return next()
    }
    this.crsfResponse({ response, next })
    this.casLoginResponse({ response, next })
    this.bizResponseData({ response, next })
    this.bizResponseError({ response, next })
    console.log('*response*', response)
  }

  /* -Interceptor------------------------------------------------------------ */
  // 统一添加请求前缀， 非 get 请求 data 转为 FormData
  bizRequest ({ config, next }) {
    if (!this.handleMap.bizRequest) return
    const { API_HOME, qs } = this
    config.url = API_HOME + config.url
    if (config.method == 'get') {
      return next()
    }
    config.data = qs.stringify(config.data) // 对象转查询字符串
    next()
  }

  getErrorMsg (code) {
    return get(this.bizCodeMap, [+code])
    // TODO i18n
    // const { i18n } = this
    // const i18nKey = get(this.bizCodeMap,[+code,'text'])
    // return i18n.t(i18nKey)
  }

  // errorWhiteList 中的接口不走统一错误拦截提示
  checkErrowWhiteList (url) {
    const { errorWhiteList } = this
    return errorWhiteList.some(wUrl => url.includes(wUrl))
  }

  // checkErrowWhitePageList 页面处于 checkErrowWhitePageList 中的页面时不走统一错误拦截提示
  checkErrowWhitePageList (url) {
    const { errorWhitePageList, app } = this
    const path = get(app, 'root.$route.path')
    console.warn('checkErrowWhitePageList', app, path)
    return errorWhitePageList.some(wUrl => path == wUrl)
  }

  // 跳转登录页
  gotoLoginPage () {
    // 重新登录回调
    if (this.reloginCallback && isFunction(this.reloginCallback)) {
      this.reloginCallback()
      return
    }
    // iframe 下重新登录跳转第三方
    if (this.RELOGIN_URL) {
      window.top.location.href = window.top.location.origin + this.RELOGIN_URL
      return
    }
    const router = get(this, 'app.root.$router')
    console.log('*router*', router, router.mode, router.base)
    if (router) {
      router.replace('/login', () => {
        router.go(0)
      })
      return
    }
    this.app.middleware('after-route-change', (to, from, next) => {
      if (to.path === '/login') {
        window.location.reload() // 刷新页面
      }
      next()
    })
    this.app.navigate('/login')
  }

  bizResponseError ({ error, next }) {
    if (!this.handleMap.bizResponse) return
    if (!error) return
    if (get(error, 'config') && this.checkErrowWhiteList(error.config.url)) return next()
    if (get(error, 'config') && this.checkErrowWhitePageList(error.config.url)) return next()
    const code = get(error, ['data', 'return_code']) || get(error, 'error_code', 401)
    const errorMsg = this.getErrorMsg(code)
    console.warn('*biz error*', error, errorMsg, this)
    const needRelogin = get(errorMsg, 'reLogin', false)
    const errorInfo = get(error, ['data', 'error_info']) || errorMsg.text
    const bizLayout = document.querySelector('[data-hui-layout="hui-biz-frame-layout"]')
    const isInBizLayout = !!bizLayout // 是否在操作员中心外框组件下
    if (!needRelogin && errorInfo) {
      // TODO i18n
      this.hui.hMessage.info({
        content: errorInfo,
        duration: 3,
      })
      return
    }
    if (isInBizLayout && this.reloginDialog == 'none') {
      this.gotoLoginPage()
      return
    }
    // 登录失效后显示锁屏弹窗
    if (isInBizLayout && this.reloginDialog == 'lockScreen') {
      return
    }

    // 重新登录失效弹窗
    if (this.isErrorTipExist) {
      return
    }
    this.app.storage.deleteData({ key: 'user' })
    this.hui.hMsgBox.confirm({
      title: '提示', // TODO i18n
      content: errorMsg.text,
      onOk: () => {
        this.gotoLoginPage()
      },
      onCancel: () => {
        this.isErrorTipExist = false
      },
    })
    this.isErrorTipExist = true
  }

  // 操作员中心接口返回值处理
  bizResponseData ({ response, next }) {
    if (!this.handleMap.bizResponse) return
    // fix: sysconfig API_IAR_ENABLED 忘关 T2 协议重复包裹 data
    // fix: unlock.json 解锁  API_IAR_ENABLED = true 老协议处理
    let data = null
    const isUnlock = new RegExp('/unlock.json(\\\\?\\S*)?$', 'i').test(response.config.url)
    data = get(response, 'data.data')
    if (data && Array.isArray(data) && !isUnlock) {
      response.data = data
    }
    // 接口返回单个数组时拍平为对象,  response = { data: [{ ... }] } => response = {}
    data = get(response, 'data')
    if (Array.isArray(data) && data.length === 1) {
      response.data = response.data[0]
    }
    // json string 类型 data 处理
    data = get(response, 'data')
    if (data && typeof data === 'string' && isJSONStr(data)) {
      response.data = JSON.parse(response.data)
    }
    return next()
  }

  // from biz 1.0
  // 防crsf攻击标识 20190717 add by zhouzx
  crsfRequest ({ config, next }) {
    if (!this.handleMap.crsf) return
    const crsf = window.localStorage.getItem('csrfcheck')
    if (crsf && crsf != '') {
      config.headers.csrfcheck = crsf
    }
  }

  // 获取IAR返回的防crsf攻击标识 20190717 add by zhouzx
  crsfResponse ({ response, next }) {
    if (!this.handleMap.crsf) return
    const crsf = response.headers.csrfcheck
    if (crsf && crsf != '') {
      window.localStorage.setItem('csrfcheck', crsf)
    }
  }

  // 如果是IAR单点登录，请求头里面需要携带ssoName(IAR的V1.2.6&V1.1.63及其以上支持读取头)
  casLoginRequest ({ config, next }) {
    if (!config.headers) {
      config.headers = {}
    }
    if (!this.handleMap.casLogin) return
    // 如果是IAR单点登录，请求头里面需要携带ssoName,to(登录成功重定向地址)
    const casLoginEnabled = get(window, 'FRAME_CONFIG.CAS_LOGIN_ENABLED', false)
    const casSsoName = get(window, 'FRAME_CONFIG.CAS_SSO_NAME', '')
    const casLoginUrl = get(window, 'FRAME_CONFIG.CAS_LOGIN_URL', '/login')
    // const isUrlLowercase = window.FRAME_CONFIG.isUrlLowercase
    if (casLoginEnabled) {
      config.headers.ssoName = casSsoName + ''
      config.headers.to = casLoginUrl
    }
    return config
  }

  // 当302的地址是cas服务器且不是登出请求,跳转到cas登录页
  casLoginResponse ({ response, next }) {
    if (!this.handleMap.casLogin) return
    // 如果是IAR单点登录，请求头里面需要携带ssoName,to(登录成功重定向地址)
    const casLoginEnabled = get(window, 'FRAME_CONFIG.CAS_LOGIN_ENABLED', false)
    const casLoginUrl = get(window, 'FRAME_CONFIG.CAS_LOGIN_URL', '/login')
    const casLogoutUrl = get(window, 'FRAME_CONFIG.CAS_LOGOUT_URL', '/login')

    const url = get(response, ['config', 'url'], '')
    const query = response.config.url.split('?')[1] || ''
    if (!url.includes('cas') || !casLoginEnabled) return
    // 单点登录退出
    if (url.includes('logout')) {
      window.location.href = casLogoutUrl + '?service=' + window.location.href
      next()
      return
    }
    // 单点登录
    window.location.href = casLoginUrl + '?' + query
    next()
  }

  // 兼容微服务方式，参数转为驼峰
  microServerRequest ({ config, next }) {
    if (!this.handleMap.microServerParam) return
    const IS_MICRO_SERVER = this.IS_MICRO_SERVER
    const data = get(config, 'data')
    const url = get(config, 'url', '')

    // 操作员中心接口 参数不转驼峰
    const camelCaseWhiteList = [
      '/cas/user/logout',
      '/getSecurityKey',
      '/unlock.json',
      '/submitLogin',
      '/updatePwd',
      '/lock.json',
      '/insertUserMenuFavorite',
      '/deleteByMenuCodeAndUserId',
      '/getCurrUserInfo',
      '/updateUserInfo',
      '/checkUserNameOrPwd.json',
      '/getCheckCode',
      '/logout',
      '/checkDefaultPwd',
      '/checkPwdExpired',
      '/expiredDays',
      '/getUserInfo',
      '/getSubsystem',
      '/getUserAuthMenus',
      '/dragAndDropMenu',
      '/getCustomGroupConfigListByPage',
      '/getCurrUser',
      '/getIndexInfo',
      '/getParamterById',
      '/getTenantList',
      '/getUserTenantInfo', // 获取租户信息
      '/saveUserBehaviorLog', // 记录用户行为分析
      '/getInboxNoReadMsgList',
      '/getInboxMsgListByPage',
      '/updateIsReadSataus',
      '/userTenantChange',
      '/getSpaceTreeByUserId',
    ]
    const checkBizUrl = function (url) {
      const regExpList = camelCaseWhiteList.map(url => new RegExp(`${url}(\\\\?\\S*)?$`, 'i'))
      return regExpList.some(re => re.test(url))
    }
    if (IS_MICRO_SERVER == 'true' && data) {
      if (checkBizUrl(url)) {
        return next()
      }
      config.data = camelCaseObj(data)
    }
  }

  // TODO 原 isToken 免登陆
}

export default function (opts) {
  if (!(this instanceof BizApiInterceptors)) {
    return new BizApiInterceptors(opts)
  }
}
