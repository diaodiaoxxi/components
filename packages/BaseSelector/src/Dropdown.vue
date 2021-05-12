<template>
  <div
    ref="selectdrop"
    :class="[className, prefixCls]"
    :style="styles"
    @click="onClick"
    @mousedown.stop="onMouseDown"
  >
    <slot></slot>
  </div>
</template>
<script>
import get from 'lodash/get'
import Popper from 'popper.js/dist/umd/popper.js'
import { PropTypes } from '@hui/shared-utils'
import SELECT_CONFIG from './config'
let transferIndex = 0
function transferIncrease () {
  transferIndex++
}
export default {
  name: 'Drop',
  props: {
    className: PropTypes.string,
    transfer: PropTypes.bool,
    widthAdaption: PropTypes.bool.def(false),
    adaptParentWidth: PropTypes.bool.def(true),
    dropWidth: PropTypes.sNumber,
    maxDropWidth: PropTypes.sNumber,
    autoPlacement: PropTypes.oneOfType([String, Object, Boolean]).def(false),
    placement: PropTypes.string.def('bottom-start')
  },
  inject: {
    SELECT_CONFIG: { default: () => SELECT_CONFIG }
  },
  data () {
    const { PREFIX } = this.SELECT_CONFIG
    const prefixCls = `${PREFIX || 'h'}-select-dropdown`
    return {
      prefixCls,
      popper: null,
      popperStatus: false,
      tIndex: this.handleGetIndex()
    }
  },
  computed: {
    styles () {
      const style = {
        transition: 'width 210ms'
      }
      return style
    }
  },
  methods: {
    onClick () {
      this.$emit('click', event)
    },
    onMouseDown () {
      // TS201903110540
      // prevent mousedown event from bubbling up and being caught by handlers on document
      // which were added in directive v-clickoutside
    },
    update () {
      if (this.popper) {
        this.$nextTick(() => {
          this.popper.scheduleUpdate()
        })
        return
      }

      this.$nextTick(() => {
        const _this = this
        const autoPlacement = this.autoPlacement
        const curPlacement = this.widthAdaption
          ? this.placement.indexOf('top') >= 0
            ? 'top-start'
            : 'bottom-start'
          : this.placement
        let boundariesElement = 'window'
        if (typeof autoPlacement !== 'boolean') {
          boundariesElement = autoPlacement || 'window'
        }
        // TODO 代码层级优化
        this.popper = new Popper(this.$parent.$refs.reference, this.$el, {
          placement: curPlacement,
          positionFixed: true, // Set this to true if you want popper to position it self in 'fixed' mode
          modifiers: {
            preventOverflow: {
              boundariesElement: boundariesElement,
              escapeWithReference: true // When escapeWithReference is set to true and reference is completely outside its boundaries, the popper will overflow (or completely leave) the boundaries in order to remain attached to the edge of the reference.
            },
            flip: { enabled: autoPlacement }, // Modifier used to flip the popper’s placement when it starts to overlap its reference element.
            computeStyle: {
              gpuAcceleration: false // If true, it uses the CSS 3D transformation to position the popper. Otherwise, it will use the top and left properties
            },
            applyVueStyle: {
              enabled: true,
              order: 900,
              gpuAcceleration: false,
              fn (data) {
                const { dropWidth, maxDropWidth, widthAdaption } = _this
                let {
                  instance: { popper: el },
                  offsets: {
                    popper: { width: cWidth },
                    reference: { width: pWidth }
                  },
                  styles
                } = data
                const setStyle = function (element, styles) {
                  Object.keys(styles).forEach(function (prop) {
                    var unit = ''
                    // add unit if the value is numeric and is one of the following
                    if (
                      [
                        'width',
                        'max-width',
                        'min-width',
                        'height',
                        'top',
                        'right',
                        'bottom',
                        'left'
                      ].indexOf(prop) !== -1
                    ) {
                      unit = 'px'
                    }
                    element.style[prop] = styles[prop] + unit
                  })
                }

                // this is a verb job becaue popper can't get the right width of reference in some case
                // especially when modify the scroll bar of reference
                const offsetWidth = get(
                  _this,
                  '$parent.$refs.reference.offsetWidth'
                )
                const parentWidth = get(_this, '$el.parentNode.offsetWidth')
                pWidth = offsetWidth || parentWidth || 0

                /**
                 * widthAdaption 优先级最高，（默认false），默认取 设置的dropWidth 或者 输入框自身宽度
                 * widthAdaption=true，受到maxDropWidth，dropWidth的限制
                 * 1. maxDropWidth 受 输入框自身宽度 限制，若设置maxDropWidth的值 小于 输入框自身宽度时，maxDropWidth取输入框自身宽度时 （即：maxDropWidth >= 输入框自身宽度）
                 * 2. dropWidth 为 自适应场景下的最小宽度，若 dropWidth > maxDropWidth， 下拉框宽度 为 maxDropWidth，自适应将失效
                 */
                if (!widthAdaption) {
                  styles.width = parseFloat(dropWidth) || pWidth
                  setStyle(el, styles)
                  return
                }

                /**
                 * widthAdaption=true自适应场景下 若未设置dropWidth min-width最小取值 输入框自身宽度(pWidth)
                 */

                if (widthAdaption) {
                  styles['min-width'] = pWidth
                }

                if (parseFloat(maxDropWidth) > 0) {
                  const maxWidth = Math.max(parseFloat(maxDropWidth), pWidth)
                  styles['max-width'] = maxWidth
                  styles['min-width'] = Math.min(maxWidth, pWidth)
                }

                if (parseFloat(dropWidth) > 0) {
                  const maxWidth = Math.max(parseFloat(maxDropWidth), pWidth)
                  styles['min-width'] = parseFloat(dropWidth)
                  if (parseFloat(maxDropWidth) > 0) {
                    styles['min-width'] = Math.min(maxWidth, dropWidth)
                  }
                }

                // styles.width = cWidth;
                setStyle(el, styles)
              }
            }
          },
          onCreate: () => {
            this.resetTransformOrigin()
            this.$nextTick(this.popper.update())
          },
          onUpdate: () => {
            this.resetTransformOrigin()
          }
        })
      })
      this.tIndex = this.handleGetIndex()
    },
    destroy () {
      if (!this.popper) {
        return
      }
      setTimeout(() => {
        if (this.popper && !this.popperStatus) {
          this.popper.destroy()
          this.popper = null
        }
        this.popperStatus = false
      }, 300)
    },
    resetTransformOrigin () {
      if (!this.popper) return
      const xPlacement = this.popper.popper.getAttribute('x-placement')
      const placementStart = xPlacement.split('-')[0]
      const placementEnd = xPlacement.split('-')[1]
      const leftOrRight = xPlacement === 'left' || xPlacement === 'right'
      if (!leftOrRight) {
        this.popper.popper.style.transformOrigin =
          placementStart === 'bottom' ||
          (placementStart !== 'top' && placementEnd === 'start')
            ? 'center top'
            : 'center bottom'
      }
    },
    handleGetIndex () {
      transferIncrease()
      return transferIndex
    }
  },
  created () {
    this.$on('on-update-popper', this.update)
    this.$on('on-destroy-popper', this.destroy)
  },
  beforeDestroy () {
    if (this.popper) {
      this.popper.destroy()
    }
  }
}
</script>
