// TODO locale replace
import { t } from '@hui/locale'
// const t = function () {}
export default {
  methods: {
    // 可变参数，用方法t来替代this
    t (...args) {
      return t.apply(this, args)
    }
  }
}
