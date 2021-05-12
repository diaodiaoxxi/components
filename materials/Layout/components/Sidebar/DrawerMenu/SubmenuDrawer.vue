<script>
import SMenuItem from './MenuItem'
export default {
  name: 'SidebarSubmenuDrawer',
  components: { SMenuItem },
  props: {
    defaultActive: String,
    data: Object,
  },
  methods: {
    handleMouseenter (e) {},
    handleMouseleave (e) {},
    handleItemClick (item) {
      this.$emit('clickItem', item)
    }
  },
  render () {
    if (!this.data) {
      return <div></div>
    }
    const children = this.data.children || []
    return (
      <div
        class="h-layout-sidebar-drawer"
        on-mouseenter={this.handleMouseenter}
        on-mouseleave={this.handleMouseleave}
      >
        <div class="h-layout-sidebar-drawer-wrap">
          <div class="h-layout-sidebar-drawer-title">{this.data.title}</div>
          <div class="h-layout-sidebar-drawer-body">
            <h-layout-menu defaultActive={this.defaultActive}>
              {children.map(item => {
                return (
                  <s-menu-item
                    isSubmenu={true}
                    data={item}
                    onClickItem={item => { this.handleItemClick(item) }}
                  ></s-menu-item>
                )
              })}
            </h-layout-menu>
          </div>
        </div>
      </div>
    )
  }
}
</script>
