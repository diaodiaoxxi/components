
const isStringFormat = {
  format (value) {
    if (Object.prototype.toString.call(value) === '[object String]') {
      console.warn('[hui] isString 传递的值已经是String类型~')
      return value
    }
    return value.join(',')
  },
  parse (value) {
    if (Object.prototype.toString.call(value) === '[object Array]') {
      console.warn('[hui] isString 传递的值已经是Array类型~')
      return value
    }
    const parseValue = value === '' ? [] : value.split(',')
    return parseValue
  }
}

const formatFactory = {
  isString: isStringFormat
}

export { isStringFormat }
export default formatFactory
