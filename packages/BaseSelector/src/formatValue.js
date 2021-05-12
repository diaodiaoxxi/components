
import {
  cloneDeep,
  isEmpty,
  isObject,
  isArray,
  get,
} from '@hui/shared-utils'
/**
 * parse 为入参 value 解析
 * format 为出参 value 格式化
 */
const defaultFormatMethods = () => ({
  // 双向绑定输入‘0’转化为空字符串，输出空值转化为‘0’
  zeroToNull: {
    format (val, isMultiple) {
      if (isMultiple) {
        console.warn('[hui] zeroToNull 只支持 select 单选')
        return val
      }
      if (typeof val != 'number' && isEmpty(val)) {
        return '0'
      }
      return get(val, 'value') || '0'
    },
    parse (parseInfo) {
      let { value, isMultiple, optionInfos } = parseInfo
      if (isMultiple) {
        console.warn('[hui] zeroToNull 只支持 select 单选')
      }
      if (String(value) == '0') {
        value = ''
      }
      return optionInfos.find(o => o.value === value)
    }
  },
  labelInValue: {
    format (val) {
      return val
    },
    parse (parseInfo) {
      const { value: val, isMultiple, optionInfos, valueKey } = parseInfo
      if (!isMultiple && !isObject(val)) {
        console.error(
          '[hui] 单选 labelInValue parse value 必须为对象且指定 valueKey'
        )
        return val
      }
      if (isMultiple && !isArray(val)) {
        console.error(
          '[hui] 多选 labelInValue parse value 必须为数组且指定 valueKey'
        )
        return val
      }

      if (isMultiple) {
        const valList = val.map(o => get(o, valueKey))
        return optionInfos.filter(o => valList.includes(o.value))
      }
      return optionInfos.find(o => o.value == get(val, valueKey))
    }
  },
  isString: {
    format (val, isMultiple) {
      if (!isMultiple) {
        console.warn('[hui] isString 只支持 select 多选')
        return val
      }
      return val.map(o => o.value).join(',')
    },
    parse (parseInfo) {
      const { value, isMultiple, optionInfos } = parseInfo
      if (!isMultiple) {
        console.warn('[hui] isString 只支持 select 多选')
        return []
      }
      if (typeof value !== 'string') {
        console.warn('[hui] isString 只支持 select string 类型 value')
        return []
      }
      if (isEmpty(value)) {
        return []
      }
      const optionsSelected = value.split(',')
      // return optionsSelected
      return optionInfos.filter(o => optionsSelected.includes(o.value))
    }
  },
  default: {
    format (val, isMultiple) {
      if (!isMultiple && isObject(val)) {
        return get(val, 'value') || ''
      }
      if (isMultiple) {
        return val.map(o => o.value)
      }
      return val
    },
    parse (parseInfo) {
      const { value, isMultiple, optionInfos } = parseInfo
      if (isEmpty(value) && typeof value != 'number') {
        if (isMultiple) {
          return []
        }
        return {}
      }
      if (isMultiple) {
        return optionInfos.filter(o => value.includes(o.value))
      }
      return optionInfos.find(o => o.value === value)
    }
  }
})

// 遍历默认 value 装换
const defaultMethods = defaultFormatMethods()
const methodNameList = Object.keys(defaultMethods).filter(
  name => name != 'default'
)

/**
 * 获取 select value 解析方法
 * @param {*} selectProps
 * @param {*} defaultFormatName
 */
function _getFormat (selectProps, defaultFormatName) {
  if (defaultFormatName && methodNameList.includes(defaultFormatName)) {
    return defaultFormatName
  }
  const openMethods = methodNameList.filter(name => {
    return get(selectProps, name)
  })
  if (openMethods.length == 0) {
    return 'default'
  }
  if (openMethods.length > 1) {
    console.warn(`select 属性 ${methodNameList} 只能存在一项`)
    return 'default'
  }
  return openMethods[0]
}

// 设置select value
function _setValue (val, objVal) {
  // this.$emit('on-change', val, objVal)
  this.$emit('on-change', val, { objVal })
  if (this.validateStatus.includes('selected')) {
    this.dispatch('FormItem', 'on-form-change', val)
  }
}

// 设置select multiInfo or singleInfo
function _setInfo (val) {
  if (this.multiple) {
    this.multiInfo.currentOptions = val
    return
  }
  this.singleInfo.currentOption = val
}

/**
 * 根据initOptions 设置Select value , singleInfo.currentOption, multipleInfo.currentOptions
 * @param {options|option} initOptions
 * @param {string} defaultFormatName [labelInValue, zeroToNull, isString]
 */
function setValue (initOptions, defaultFormatName) {
  const selectProps = this.$props
  const isMultiple = this.multiple
  const methodName = _getFormat(selectProps, defaultFormatName)
  // console.log('methodName', methodName)
  const formatFn = get(defaultMethods, [methodName, 'format'])

  const val = formatFn(initOptions, isMultiple)
  // on-change 添加第二个参数返回整个option 对象值 参考label-in-value
  const objFormatFn = get(defaultMethods, ['labelInValue', 'format'])
  const objVal = objFormatFn(initOptions, isMultiple)
  _setInfo.call(this, initOptions)
  _setValue.call(this, val, cloneDeep(objVal))
  return val
}

/**
 * 根据 initValue , 初始化赋值Select value ,singleInfo.currentOption, multipleInfo.currentOptions
 * @param {*} initValue
 * @param {*} parseMethod
 */
function getValue (initValue, parseMethod) {
  // console.log('===== getValue =====')
  this.$nextTick(() => {
    const selectProps = this.$props
    const isMultiple = this.multiple
    const valueKey = this.valueKey
    const labelKey = this.labelKey
    // TODO 兼容 flatData 大数据,tree,table body
    const optionInfos = this.flatData.map(item => {
      return {
        ...item,
        value: get(item, valueKey),
        label: get(item, labelKey)
      }
    })
    const parseInfo = {
      value: initValue || this.value,
      isMultiple,
      valueKey,
      optionInfos
    }
    const methodName = _getFormat(selectProps, parseMethod)
    const parseFn = get(defaultMethods, [methodName, 'parse'])
    const optionsSelected = parseFn(parseInfo)
    if (isEmpty(this.flatData) || isEmpty(optionsSelected)) {
      _setInfo.call(this, isMultiple ? [] : {})
      return
    }
    const formatOptionInfo = item => {
      // const data = isObject(item.data) ? item.data : {}
      return {
        // node对象需要过滤不必要的节点属性，在selector对singleInfo.currentOption节点做了深监听
        // tag disabled标志
        disabled: item.disabled,
        value: item.value,
        label: item.label
      }
    }
    if (isMultiple) {
      const optionsInfo = []
      optionsSelected.map(item => {
        // if (item.disabled) return
        const optionInfo = formatOptionInfo(item)
        optionsInfo.push(optionInfo)
      })
      _setInfo.call(this, optionsInfo)
      return
    }
    const optionInfo = formatOptionInfo(optionsSelected)
    _setInfo.call(this, optionInfo)
  })
}

export default {
  methods: {
    setValue: setValue,
    getValue: getValue,
    _setValue: _setValue,
    changeFormatMethods () {
      defaultMethods.default = {
        format (optionInfo, isMultiple) {
        },
        parse (parseInfo) {
          return parseInfo.optionInfos
        }
      }
    }
  }
}
