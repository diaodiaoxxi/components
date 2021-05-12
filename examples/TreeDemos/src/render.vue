<template>
  <div class="tree-demo" style="width: 500px;">
    <p>:render="renderContent"</p>
    <u-tree :treeData="treeData" :expandLevel="1" showCheckbox :render="renderContent"></u-tree>
    <p>:renderIcon="renderIcon"</p>
    <u-tree :treeData="treeData" :expandLevel="1" showCheckbox titleMaxWidth="40" :renderIcon="renderIcon"></u-tree>
    <p>:renderMenu="renderContent" </p>
    <u-tree :treeData="treeData" style="height: 300px;" :expandLevel="1"  showCheckbox :renderMenu="renderContent" ></u-tree>
    <p>:renderMenu="renderContent" && titleMaxWidth="600" </p>
    <u-tree :treeData="treeData" :expandLevel="1" showCheckbox titleMaxWidth="600"  :renderMenu="renderContent" ></u-tree>
    <p>:renderMenu="renderContent" && titleMaxWidth="600" && blockNode </p>
    <u-tree :treeData="treeData" :expandLevel="1" showCheckbox titleMaxWidth="600" blockNode :renderMenu="renderContent" ></u-tree>
    <p>:renderMenu="renderContent" && titleMaxWidth="600" && blockDirectory </p>
    <u-tree :treeData="treeData" :expandLevel="1" showCheckbox titleMaxWidth="600" blockDirectory  :selectable="false" :renderMenu="renderContent" ></u-tree>
    <p>:renderMenu="renderContent" && titleMaxWidth="600" && blockDirectory && 单选 </p>
    <u-tree :treeData="treeData" :expandLevel="1" titleMaxWidth="600" blockDirectory :renderMenu="renderContent" ></u-tree>
    <p>renderTextTips</p>
    <div>renderTextTips === function && disabled</div>
    <u-tree :treeData="treeData" showTitle disabled :expandLevel="1" showCheckbox :renderTextTips="renderTextTips"></u-tree>
    <div>renderTextTips === function</div>
    <u-tree :treeData="treeData" showTitle disabled :expandLevel="1" showCheckbox :renderTextTips="renderTextTips"></u-tree>
     <div>renderTextTips === array</div>
    <u-tree :treeData="treeData" showTitle :expandLevel="1" showCheckbox :renderTextTips="['id', 'title']"></u-tree>
    <div>renderTextTips === array = []</div>
    <u-tree :treeData="treeData" showTitle :expandLevel="1" showCheckbox :renderTextTips="[]"></u-tree>
    <div>renderTextTips === array = ['id', 'ti3333tle']</div>
    <u-tree :treeData="treeData" showTitle :expandLevel="1" showCheckbox :renderTextTips="['id', 'ti3333tle']"></u-tree>
     <div>renderTextTips === string</div>
    <u-tree :treeData="treeData" showTitle :expandLevel="1" showCheckbox renderTextTips="id"></u-tree>
    <div>renderTextTips === string</div>
    <u-tree :treeData="treeData" showTitle :expandLevel="1" showCheckbox renderTextTips="i44444d"></u-tree>

  </div>
</template>

<script>
var treeData = [
  {
    title: 'title-0-0',
    id: '0-0',
    children: [
      {
        title: 'title-0-0-0title-0-0-0title-0-0-0title-0-0-0title-0-0-0title-0-0-0title-0-0-0title-0-0-0title-0-0-0title-0-0-0title-0-0-00title-0-0-0title-0-0-0title-0-0-0title-0-0-0title-0-0-0',
        id: '0-0-0',
        disabled: true,
        children: [
          { title: 'title-0-0-0-0', id: '0-0-0-0' },
          { title: 'title-0-0-0-1', id: '0-0-0-1' },
          { title: 'title-0-0-0-2', id: '0-0-0-2' }
        ]
      },
      {
        title: 'title-0-0-1',
        id: '0-0-1',
        children: [
          { title: 'title-0-0-1-0', id: '0-0-1-0' },
          { title: 'title-0-0-1-1', id: '0-0-1-1' },
          {
            title: 'title-0-0-1-2',
            id: '0-0-1-2',
            children: [
              { title: 'title-0-0-1-2-0', id: '0-0-1-2-0' },
              { title: 'title-0-0-1-2-1', id: '0-0-1-2-1' },
              { title: 'title-0-0-1-2-2', id: '0-0-1-2-2' }
            ]
          }
        ]
      },
      {
        title: 'title-0-0-2',
        id: '0-0-2'
      }
    ]
  },
  {
    title: 'title-0-1',
    id: '0-1',
    children: [
      { title: 'title-0-1-0-0', id: '0-1-0-0' },
      { title: 'title-0-1-0-1', id: '0-1-0-1' },
      { title: 'title-0-1-0-2', id: '0-1-0-2' }
    ]
  },
  {
    title: 'title-0-2',
    id: '0-2'
  }
]

export default {
  data () {
    return {
      value: '',
      treeData: treeData,
    }
  },
  methods: {
    renderContent (h, { root, node, data }) {
      // console.log(root, node, data)
      return h(
        'span',
        {
          style: {
            display: 'inline-block',
            width: '100%'
          },
          on: {
            click: () => {
              console.log(111111)
            }
          }
        },
        [
          h('span', [
            h('h-icon', {
              props: {
                name: 'ios-paper-outline'
              },
              style: {
                marginRight: '8px'
              }
            }),
            h('span', data.title)
          ]),
          h('span', {
            style: {
              display: 'inline-block',
              float: 'right',
              marginRight: '32px'
            }
          })
        ]
      )
    },
    renderTextTips (item) {
      // return 'title--------->'+ item.title + /n+  item.id
      return `title------->${item.title} \/n id---------->${item.is}`
    },
    renderIcon (h, { root, node, data }) {
      if (data.level === 1 || data.level === 2) {
        return h('span', [h('h-icon', { props: { name: 'folder' }, style: { marginRight: '8px' } }), ])
      } else {
        return h('span', [h('h-icon', { props: { name: 'ios-paper-outline' }, style: { marginRight: '8px' } })])
      }
    }
  }
}
</script>

<style lang="scss">
// .tree-demo-title{
//   font-weight: 600;
//   font-size: 14px;
//   margin-top: 20px;
// }
.tree-demo{
  &>p{
    font-weight: 600;
    font-size: 14px;
    margin-top: 20px;
  }
}
</style>
