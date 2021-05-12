import isEmpty from 'lodash/isEmpty'
import isPlainObject from 'lodash/isPlainObject'
import isFunction from 'lodash/isFunction'
import isEqual from 'lodash/isEqual'
import get from 'lodash/get'
import mapKeys from 'lodash/mapKeys'
import defaults from 'lodash/defaults'
import cloneDeep from 'lodash/cloneDeep'
import omit from 'lodash/omit'
import compact from 'lodash/compact'
import camelCase from 'lodash/camelCase'
import snakeCase from 'lodash/snakeCase'
import kebabCase from 'lodash/kebabCase'
import qs from 'qs'

const huiQs = {
  stringify: qs.stringify,
  parse: function (str, options) {
    return qs.parse(str, defaults(options, {
      decoder: qsDecoder
    }))
  }
}

export {
  isEmpty,
  isPlainObject,
  isFunction,
  isEqual,
  get,
  mapKeys,
  defaults,
  cloneDeep,
  omit,
  compact,
  camelCase,
  snakeCase,
  kebabCase,
  huiQs as qs
}

// 解决 qs 不默认解析 boolean 与 number
export function qsDecoder (value) {
  // if (/^(\d+|\d*\.\d+)$/.test(value)) {
  //   return parseFloat(value)
  // }

  const keywords = {
    true: true,
    false: false,
    null: null,
    undefined: undefined,
  }
  if (value in keywords) {
    return keywords[value]
  }

  return value
}

export function noop () {}
export function firstUpperCase (str) {
  return str.toString()[0].toUpperCase() + str.toString().slice(1)
}

/**
 * 遍历操作 有children 的树形 object 对象 tree[]
 * @param {array} arr childrenObj []
 * @param {fun} cb
 * @param {bool} keepNode 设置为 false 时，在 cb返回后移除该节点
 * @info {object} tree {id:'',title:'',children:[]}
 */
export function mapTree (arr, cb = noop, options = { keepNode: true }) {
  if (!Array.isArray(arr)) {
    throw new Error('param must be array')
  }
  const getPath = (path, i) => {
    return path === '' ? `${i}` : `${path}.children.${i}`
  }
  const format = (mutiMenuList = [], path = '', cb) => {
    if (!Array.isArray(mutiMenuList)) {
      return mutiMenuList
    }
    const list = mutiMenuList.map((item, i) => {
      if (options.keepNode) {
        cb(item, getPath(path, i))
      }
      if (item.children) {
        item.children = format(item.children, getPath(path, i), cb)
      }
      if (!options.keepNode) {
        const itemCache = cb(item, getPath(path, i))
        return itemCache
      }
      return item
    })
    if (options.keepNode) {
      return list
    }
    return list.filter(item => !!item)
  }
  return format(arr, '', cb)
}

/*
 * 获取IE浏览器版本
 */
export function getIeVersion () {
  const IEMode = document.documentMode
  const rMsie = /(msie\s|trident.*rv:)([\w.]+)/
  const ma = window.navigator.userAgent.toLowerCase()
  const match = rMsie.exec(ma)
  try {
    return match[2]
  } catch (e) {
    return IEMode
  }
}

/*
 * 获取oper浏览器版本
 */
function getOperaVersion (userAgent) {
  try {
    if (window.opera) {
      return userAgent.match(/opera.([\d.]+)/)[1]
    } else if (userAgent.indexOf('opr') > 0) {
      return userAgent.match(/opr\/([\d.]+)/)[1]
    }
  } catch (e) {
    return 0
  }
}

/*
 * 判断是否为360浏览器
 */
function validate360 (option, value) {
  const mimeTypes = window.navigator.mimeTypes
  for (const mt in mimeTypes) {
    if (mimeTypes[mt][option] == value) {
      return true
    }
  }
  return false
}

/**
 * 获取浏览器信息
 * @returns browerInfo 浏览器信息
 * @info browerInfo.type 浏览器类型
 * @info browerInfo.version 浏览器版本
 * @info browerInfo.platform 浏览器正在运行的操作系统平台
 */
export function getBrowerInfo () {
  const userAgent = window.navigator.userAgent.toLowerCase()
  let browserType = ''
  let browserVersion = ''
  var platform = navigator.platform // 浏览器正在运行的操作系统平台，包括Win16(windows3.x)
  if (userAgent.match(/msie/) != null || userAgent.match(/trident/) != null) {
    // 浏览器类型-IE
    browserType = 'IE'
    browserVersion = getIeVersion()
  } else if (window.opera || userAgent.indexOf('opr') > 0) {
    // 欧朋
    browserType = '欧朋'
    browserVersion = getOperaVersion(userAgent)
  } else if (userAgent.indexOf('ubrowser') > 0) {
    // UC
    browserType = 'UC'
    browserVersion = userAgent.match(/ubrowser\/([\d.]+)/)[1]
  } else if (userAgent.indexOf('bidubrowser') > 0) {
    // 百度
    browserType = '百度'
    browserVersion = userAgent.match(/bidubrowser\/([\d.]+)/)[1]
  } else if (userAgent.indexOf('metasr') > 0 || userAgent.indexOf('se 2.x') > 0) {
    // 搜狗
    browserType = '搜狗'
    // browserVersion =  userAgent.match(/metasr\/([\d.]+)/)[1]
  } else if (userAgent.indexOf('tencenttraveler') > 0) {
    // QQ
    browserType = 'QQ'
    browserVersion = userAgent.match(/tencenttraveler\/([\d.]+)/)[1]
  } else if (userAgent.indexOf('qqbrowser') > 0) {
    // QQ
    browserType = 'QQ'
    browserVersion = userAgent.match(/qqbrowser\/([\d.]+)/)[1]
  } else if (userAgent.indexOf('maxthon') > 0) {
    // 遨游
    browserType = '遨游'
    browserVersion = userAgent.match(/maxthon\/([\d.]+)/)[1]
  } else if (userAgent.indexOf('firefox') > 0) {
    // 火狐
    browserType = '火狐'
    browserVersion = userAgent.match(/firefox\/([\d.]+)/)[1]
  } else if (userAgent.indexOf('edge') > 0) {
    // edge
    browserType = 'Edge'
    browserVersion = userAgent.match(/edge\/([\d.]+)/)[1]
  } else if (userAgent.indexOf('chrome') > 0) {
    // 谷歌/360
    if (validate360('type', 'application/x360mmplugin')) {
      browserType = '360'
      // browserVersion =  userAgent.match(/chrome\/([\d.]+)/)[1]
    } else {
      browserType = '谷歌'
      browserVersion = userAgent.match(/chrome\/([\d.]+)/)[1]
    }
  } else if (userAgent.indexOf('Safari') > -1) {
    // 苹果
    browserType = 'Safari'
    browserVersion = userAgent.match(/version\/([\d.]+)/)[1]
  }

  return {
    type: browserType,
    version: browserVersion,
    platform,
  }
}

/**
 * 对象key转驼峰
 * @param {object} obj
 */
export function camelCaseObj (obj) {
  if (!isPlainObject(obj)) {
    throw new Error('camelCaseObj param must be plain object!')
  }
  return mapKeys(obj, (value, key) => {
    return camelCase(key)
  })
}

/**
 * 对象key转下划线
 * @param {object} obj
 */
export function snakeCaseObj (obj) {
  if (!isPlainObject(obj)) {
    throw new Error('camelCaseObj param must be plain object!')
  }
  return mapKeys(obj, (value, key) => {
    return snakeCase(key)
  })
}

/*
 * 判断是否是json格式
 */
export function isJSONStr (str) {
  if (typeof str === 'string') {
    try {
      var obj = JSON.parse(str)
      if (typeof obj === 'object' && obj) {
        return true
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }
}

export const isIE = (function () {
  const userAgent = window.navigator.userAgent.toLowerCase()
  const isIE = userAgent.match(/msie/) != null || userAgent.match(/trident/) != null
  return isIE
})()
