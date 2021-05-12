<script>
import TreeNode from './TreeNode'
export default {
  components: { TreeNode },
  props: {
    source: {
      type: Object,
      default () {
        return {}
      }
    },
    index: {
      type: Number,
    }
  },
  methods: {
    renderTreeNode (props) {
      const treeNodeProps = {
        props: {
          ...props,
          item: props,
        },
        key: props.key
      }
      return <TreeNode {...treeNodeProps}></TreeNode>
    },
  },
  render () {
    // console.log('======node render=======')
    return this.renderTreeNode(Object.assign(this.source, { filterIndex: this.index }))
    // return this.renderTreeNode({ ...this.source, filterIndex: this.index })
  },
  watch: {
  }
}
</script>

<style>
</style>
