const version = require('../../package.json').version

class HuiBizDevHook {
  constructor (opts) {
    if (!window) return
    window.__hui_biz_layout_dev_hook__ = {
      version,
    }
    this._dev_hook = window.__hui_biz_dev_hook__
  }
}

export default function (opts) {
  if (!(this instanceof HuiBizDevHook)) {
    return new HuiBizDevHook(opts)
  }
}
