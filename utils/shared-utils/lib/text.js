// firstUpperCase
export function firstUpperCase (str) {
  return str.toString()[0].toUpperCase() + str.toString().slice(1)
}

/**
   * @description 切割整数位
   * @date 2019-07-18
   * @param {String} value 金额数字
   * @param {Number} integerNum 整数位数
   */
export function cutNum (value, integerNum) {
  var arrNum = value.split('.')
  if (arrNum.length > 0) {
    var integerNumber = arrNum[0].substr(0, integerNum)
    if (arrNum.length > 1) {
      value = integerNumber + '.' + arrNum[1]
    } else {
      value = integerNumber
    }
  }
  return value
}
export function numtochinese (Num, suffixNumber) {
  for (var i = Num.length - 1; i >= 0; i--) {
    Num = Num.replace(',', '') // 替换tomoney()中的“,”
    Num = Num.replace(' ', '') // 替换tomoney()中的空格
  }
  Num = Num.replace('￥', '') // 替换掉可能出现的￥字符
  if (isNaN(Num)) {
    // 验证输入的字符是否为数字
    // alert("请检查小写金额是否正确");
    return
  }
  // ---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
  var part = String(Num).split('.')
  var newchar = ''
  // 小数点前进行转化
  for (i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 17) {
      //   alert("");
      return '位数过大，无法计算'
    } // 若数量超过拾亿单位，提示
    var tmpnewchar = ''
    var perchar = part[0].charAt(i)
    switch (perchar) {
      case '0':
        tmpnewchar = '零' + tmpnewchar
        break
      case '1':
        tmpnewchar = '壹' + tmpnewchar
        break
      case '2':
        tmpnewchar = '贰' + tmpnewchar
        break
      case '3':
        tmpnewchar = '叁' + tmpnewchar
        break
      case '4':
        tmpnewchar = '肆' + tmpnewchar
        break
      case '5':
        tmpnewchar = '伍' + tmpnewchar
        break
      case '6':
        tmpnewchar = '陆' + tmpnewchar
        break
      case '7':
        tmpnewchar = '柒' + tmpnewchar
        break
      case '8':
        tmpnewchar = '捌' + tmpnewchar
        break
      case '9':
        tmpnewchar = '玖' + tmpnewchar
        break
    }
    switch (part[0].length - i - 1) {
      case 0:
        tmpnewchar = tmpnewchar + '元'
        break
      case 1:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '拾' }
        break
      case 2:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '佰' }
        break
      case 3:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '仟' }
        break
      case 4:
        tmpnewchar = tmpnewchar + '万'
        break
      case 5:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '拾' }
        break
      case 6:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '佰' }
        break
      case 7:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '仟' }
        break
      case 8:
        tmpnewchar = tmpnewchar + '亿'
        break
      case 9:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '拾' }
        break
      case 10:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '百' }
        break
      case 11:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '仟' }
        break
      case 12:
        tmpnewchar = tmpnewchar + '兆'
        break
      case 13:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '拾' }
        break
      case 14:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '百' }
        break
      case 15:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '仟' }
        break
      case 16:
        if (perchar != 0) { tmpnewchar = tmpnewchar + '京' }
        break
      case 17:
        tmpnewchar = tmpnewchar + '拾'
        break
    }
    newchar = tmpnewchar + newchar
  }
  // 小数点之后进行转化
  if (Num.indexOf('.') != -1) {
    if (part[1].length > 2) {
      // alert("小数点之后只能保留两位,系统将自动截段");
      var tempNum = parseFloat(Num)
      Num = tempNum.toFixedSelf(suffixNumber)
      part = String(Num).split('.')
    }
    for (i = 0; i < part[1].length; i++) {
      tmpnewchar = ''
      perchar = part[1].charAt(i)
      switch (perchar) {
        case '0':
          tmpnewchar = '零' + tmpnewchar
          break
        case '1':
          tmpnewchar = '壹' + tmpnewchar
          break
        case '2':
          tmpnewchar = '贰' + tmpnewchar
          break
        case '3':
          tmpnewchar = '叁' + tmpnewchar
          break
        case '4':
          tmpnewchar = '肆' + tmpnewchar
          break
        case '5':
          tmpnewchar = '伍' + tmpnewchar
          break
        case '6':
          tmpnewchar = '陆' + tmpnewchar
          break
        case '7':
          tmpnewchar = '柒' + tmpnewchar
          break
        case '8':
          tmpnewchar = '捌' + tmpnewchar
          break
        case '9':
          tmpnewchar = '玖' + tmpnewchar
          break
      }
      if (i == 0) { tmpnewchar = tmpnewchar + '角' }
      if (i == 1) { tmpnewchar = tmpnewchar + '分' }
      newchar = newchar + tmpnewchar
    }
  }
  // 替换所有无用汉字
  while (newchar.search('零零') != -1) { newchar = newchar.replace('零零', '零') }
  newchar = newchar.replace('零亿', '亿')
  newchar = newchar.replace('亿万', '亿')
  newchar = newchar.replace('零万', '万')
  newchar = newchar.replace('零元', '元')
  newchar = newchar.replace('零角', '')
  newchar = newchar.replace('零分', '')

  newchar = newchar.replace('亿万', '亿')
  newchar = newchar.replace('兆亿', '兆')
  newchar = newchar.replace('零兆', '兆')
  newchar = newchar.replace('京兆', '京')

  if (newchar.charAt(newchar.length - 1) == '元' ||
      newchar.charAt(newchar.length - 1) == '角') { newchar = newchar + '整' }

  var digit = ['壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  while (newchar.length > 0) {
    if (digit.indexOf(newchar[0]) < 0) {
      newchar = newchar.substr(1)
    } else {
      break
    }
  }

  var firstChar = Num.substring(0, 1)
  if (firstChar == '-') {
    newchar = '负' + newchar
  }

  var lastChar = newchar.charAt(newchar.length - 1)
  if (lastChar == '零') {
    newchar = newchar.substring(0, newchar.length - 1)
    newchar = newchar + '整'
  }

  if (parseFloat(Num) == 0) {
    newchar = '零元整'
  }
  return newchar
}
/**
   * @description 金额转大写
   * @date 2019-07-18
   * @param {String} value 金额数字
   * @param {Number} integerNum 整数位数
   * @param {Number} suffixNum 小数位数
   * @param {Boolean} isround 事否四舍五入
   */
export function changeTipsVal (value, integerNum, suffixNum, isround) {
  value = String(value).replace(/[^0-9.-]/g, '')
  value = cutNum(value, integerNum)
  if (value.split('.')[1] && value.split('.')[1].length > 2) {
    if (isround && isround == true) {
      value = parseFloat(value).toFixedSelf(suffixNum)
    } else {
      var suf = value.split('.')[1].substr(0, suffixNum)
      value = value.split('.')[0] + '.' + suf
    }
  }
  return numtochinese(value + '', suffixNum)
}
/**
   * @description 数字千分位分割
   * @date 2019-07-18
   * @param {String} num 金额数字
   */
export function divideNum (num) {
  let revalue = ''
  const array = String(num).split('.')
  const pointStr = array[1] ? '.' + array[1] : ''
  array[0] = array[0].replace(/-/g, '')
  if (array[0].length > 3) {
    while (array[0].length > 3) {
      revalue = ',' + array[0].substring(array[0].length - 3, array[0].length) + revalue
      array[0] = array[0].substring(0, array[0].length - 3)
    }
  }
  return num >= 0 ? array[0] + revalue + pointStr : '-' + array[0] + revalue + pointStr
}
/**
   * @description 金额转大写调用外部方法，只提供处理后金额
   * @date 2019-08-21
   * @param {String} value 金额数字
   * @param {Number} integerNum 整数位数
   * @param {Number} suffixNum 小数位数
   * @param {Boolean} isround 事否四舍五入
   */
export function changeTipsNum (value, integerNum, suffixNum, isround) {
  value = String(value).replace(/[^0-9.-]/g, '')
  value = cutNum(value, integerNum)
  if (value.split('.')[1] && value.split('.')[1].length > 2) {
    if (isround && isround == true) {
      value = parseFloat(value).toFixedSelf(suffixNum)
    } else {
      var suf = value.split('.')[1].substr(0, suffixNum)
      value = value.split('.')[0] + '.' + suf
    }
  }
  return value
}

/**
 * @decription 字符串的toFixed实现
 */
export function toFixedForString (str, num) {
  if (num < 1) return str
  if (/[^\d.-]/.test(str)) return str

  let decimal = str.replace(/^[\d-]+\.?/, '')
  decimal = decimal.padEnd(num, 0)

  return str.replace(/(\.\d+)?$/, '.' + decimal)
}

/**
 * @description 科学计数法转为string
 * @param {string, number} param
 */
export function scientificNotationToString (param) {
  const strParam = String(param)
  const flag = /e/.test(strParam)
  if (!flag) return String(param)

  // 指数符号 true: 正，false: 负
  let sysbol = true
  if (/e-/.test(strParam)) {
    sysbol = false
  }
  // 指数
  const index = Number(strParam.match(/\d+$/)[0])
  // 基数
  const basis = strParam.match(/^[\d.]+/)[0].replace(/\./, '')

  if (sysbol) {
    return basis.padEnd(index + 1, 0)
  } else {
    return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
  }
}
