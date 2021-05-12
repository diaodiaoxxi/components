import Schema from 'async-validator'
const descriptor = {
  uuid: { required: true },
  title: { required: true },
  url: { required: true },
}

// warn 覆盖
Schema.warn = function (type, errors) {
  if (
    process.env.NODE_ENV !== 'production' &&
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    console !== 'undefined' &&
    console.warn
  ) {
    if (
      errors.every(function (e) {
        return typeof e === 'string'
      })
    ) {
      console.warn('[hui] 导航框架', errors)
    }
  }
}
const validator = new Schema(descriptor)

// 校验 tabInfo
export const validateTabInfo = (tabInfo, options, cb) => {
  validator.validate(tabInfo, (errors, fields) => {
    if (errors) {

    }
  })
}
