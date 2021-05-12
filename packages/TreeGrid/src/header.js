export default {
  name: 'TableRenderHeader',
  functional: true,
  props: {
    render: Function,
    column: Object,
    index: Number
  },
  render: (h, ctx) => {
    // 问题在于找不到自定义表头的 span-cell 类
    const vNode = ctx.props.render(h, {
      column: ctx.props.column,
      index: ctx.props.index
    })

    vNode.data = vNode.data || {}

    if (vNode.data.class) {
      vNode.data.class = `${vNode.data.class} span-cell`
    } else {
      vNode.data.class = 'span-cell'
    }

    return vNode
  }
}
