import Vue from 'vue'
import debounce from 'lodash/debounce'
import merge from 'lodash/merge'
import PopupManager from './popup-manager'
import Popper from 'popper.js/dist/umd/popper'
import PropTypes from '@hui/shared-utils/vue-types'
const PopperJS = Vue.prototype.$isServer ? function () {} : Popper
const stop = e => e.stopPropagation()

/**
 * @param {HTMLElement} [reference=$refs.reference] - The reference element used to position the popper.
 * @param {HTMLElement} [popper=$refs.popper] - The HTML element used as popper, or a configuration used to generate the popper.
 * @param {String} [placement=button] - Placement of the popper accepted values: top(-start, -end), right(-start, -end), bottom(-start, -end), left(-start, -end)
 * @param {Number} [offset=0] - Amount of pixels the popper will be shifted (can be negative).
 * @param {Boolean} [visible=false] Visibility of the popup element.
 * @param {Boolean} [visible-arrow=false] Visibility of the arrow, no style.
 */
export default {
  props: {
    reference: {},
    popper: {},
    transformOrigin: PropTypes.oneOfType([Boolean, String]).def(true),
    placement: PropTypes.string.def('bottom'),
    boundariesPadding: PropTypes.number.def(5),
    offset: PropTypes.number.def(0),
    value: Boolean,
    visibleArrow: Boolean,
    arrowOffset: PropTypes.number.def(35),
    transfer: PropTypes.oneOfType([Boolean, String]).def(true), // 等同于 appendToBody, 为 string 时,作为样式添加到  popperElm
    appendToBody: PropTypes.bool.def(false),
    autoPlacement: PropTypes.bool.def(false),
    escapeWithReference: PropTypes.bool.def(false),
    boundariesElement: PropTypes.any.def('viewport'),
    popperOptions: PropTypes.object.def({
      modifiers: {
        computeStyle: {
          // If true, it uses the CSS 3D transformation to position the popper. Otherwise, it will use the top and left properties
          gpuAcceleration: true
        }
      }
    }),
    zIndex: PropTypes.sNumber.def(600),
  },

  data () {
    return {
      showPopper: false,
      isUpdated: false,
      currentPlacement: ''
    }
  },

  computed: {
    visible () {
      return this.showPopper && this.isUpdated
    }
  },

  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.showPopper = val
        this.$emit('input', val)
      }
    },

    showPopper (val) {
      this.toggleShowPopper(val)
    }
  },
  methods: {
    toggleShowPopper: debounce(
      function (val) {
        if (this.disabled) return
        val ? this.updatePopper() : this.destroyPopper()
        this.$emit('input', val)
      },
      300,
      { leading: true }
    ),

    createPopper () {
      if (this.$isServer) return
      this.currentPlacement = this.currentPlacement || this.placement
      if (
        !/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)
      ) {
        return
      }

      const options = merge(this.popperOptions, {
        modifiers: {
          preventOverflow: {
            boundariesElement: this.boundariesElement,
            // When escapeWithReference is set to true and reference is completely outside its boundaries, the popper will overflow (or completely leave) the boundaries in order to remain attached to the edge of the reference.
            escapeWithReference: this.escapeWithReferencez
          },
          flip: { enabled: this.autoPlacement }
        }
      })
      const popper = (this.popperElm =
        this.popperElm || this.popper || this.$refs.popper)
      let reference = (this.referenceElm =
        this.referenceElm || this.reference || this.$refs.reference)

      if (!reference && this.$slots.reference && this.$slots.reference[0]) {
        reference = this.referenceElm = this.$slots.reference[0].elm
      }

      if (!popper || !reference) return
      if (this.visibleArrow) this.appendArrow(popper)
      if (this.appendToBody || this.transfer) {
        // TODO 替代 transfer-dom
        const defaultNode = document.body
        this.popperElm.classList.toggle('v-transfer-dom')
        this.popperElm.dataset.transfer = 'true'
        this.popperElm.dataset.huiComponent = this.$options?.name + '-' + this._uid
        if (typeof this.transfer == 'string') {
          this.popperElm.classList.toggle(this.transfer)
        }
        defaultNode.appendChild(this.popperElm)
      }
      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy()
      }

      options.placement = this.currentPlacement
      options.offset = this.offset
      options.arrowOffset = this.arrowOffset
      options.onCreate = () => {
        this.$emit('created', this)
        this.resetTransformOrigin()
        this.$nextTick(this.updatePopper)
      }
      this.popperJS = new PopperJS(reference, popper, options)
      if (typeof options.onUpdate === 'function') {
        this.popperJS.onUpdate(options.onUpdate)
      }
      PopupManager.zIndex = this.zIndex
      this.popperJS.popper.style.zIndex = PopupManager.nextZIndex()
      this.popperElm.addEventListener('click', stop)
    },

    updatePopper () {
      const popperJS = this.popperJS
      if (popperJS) {
        popperJS.scheduleUpdate()
        this.isUpdated = true
        if (popperJS.popper) {
          popperJS.popper.style.zIndex = PopupManager.nextZIndex()
        }
        return
      }
      this.createPopper()
    },

    doDestroy (forceDestroy) {
      /* istanbul ignore if */
      if (!this.popperJS || (this.showPopper && !forceDestroy)) return
      this.popperJS.destroy()
      this.popperJS = null
    },

    destroyPopper () {
      if (this.popperJS) {
        this.resetTransformOrigin()
      }
    },

    resetTransformOrigin () {
      if (!this.transformOrigin) return
      const placementMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left'
      }
      const placement = this.popperJS.popper
        .getAttribute('x-placement')
        .split('-')[0]
      const origin = placementMap[placement]
      this.popperJS.popper.style.transformOrigin =
        typeof this.transformOrigin === 'string'
          ? this.transformOrigin
          : ['top', 'bottom'].indexOf(placement) > -1
            ? `center ${origin}`
            : `${origin} center`
    },

    appendArrow (element) {
      let hash
      if (this.appended) {
        return
      }

      this.appended = true

      for (const item in element.attributes) {
        if (/^_v-/.test(element.attributes[item].name)) {
          hash = element.attributes[item].name
          break
        }
      }

      const arrow = document.createElement('div')

      if (hash) {
        arrow.setAttribute(hash, '')
      }
      arrow.setAttribute('x-arrow', '')
      arrow.className = 'popper__arrow'
      element.appendChild(arrow)
    }
  },

  beforeDestroy () {
    this.doDestroy(true)
    if (this.popperElm && this.popperElm.parentNode === document.body) {
      this.popperElm.removeEventListener('click', stop)
      document.body.removeChild(this.popperElm)
    }
  },

  // call destroy in keep-alive mode
  deactivated () {
    this.$options.beforeDestroy[0].call(this)
  },
}
