<script lang="jsx">
import CONFIG from '@materials/Layout/components/config'
import PropTypes from '@hui/shared-utils/vue-types'
import { getSlots } from '@hui/shared-utils'
import { cloneElement } from '@hui/shared-utils'

export default {
  name: 'TopbarMenuItem',
  props: {
    icon: PropTypes.string.def(undefined),
    title: PropTypes.string.def(undefined),
  },
  inject: {
    CONFIG: { default: () => CONFIG },
  },
  data () {
    this.prefix = 'h-layout-head' || this.CONFIG.PREFIX
    this.drawerPrefix = `${this.prefix}-user-drawer`
    return {}
  },
  render () {
    const slots = getSlots(this)
    const icon = slots.icon
      ? cloneElement(slots.icon, {
        class: `${this.drawerPrefix}-item-icon`
      })
      : <i class={`${this.drawerPrefix}-item-icon ${this.icon}`}></i>
    const title =
      slots.title
        ? cloneElement(slots.title, {
          class: `${this.drawerPrefix}-item-title`
        })
        : <span class={`${this.drawerPrefix}-item-title`}>{this.title}</span>
    return (
      <div class={`${this.drawerPrefix}-item`}>
        {[icon, title, slots.default, this.$slots.append]}
      </div>
    )
  }
}
</script>
