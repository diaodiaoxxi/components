<template>
  <div class="tree-demo" style="width: 500px; margin-bottom: 50px;">

    <h-button @click="autoPlacement = !autoPlacement">autoPlacement: {{autoPlacement}}</h-button>

    <u-select v-model="value" :autoPlacement="autoPlacement" labelKey="title" dropWidth="200" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>

    <p>autoPlacement={{autoPlacement}} && placement="top"</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" placement="top" dropWidth="300" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="[]"></u-select-tree>
    </u-select>
    <p>autoPlacement={{autoPlacement}} && placement="top-start"</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" placement="top-start" dropWidth="300" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>
    <p>autoPlacement={{autoPlacement}} && placement="top-end"</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" placement="top-end" dropWidth="300" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>
    <p>autoPlacement={{autoPlacement}} && placement="bottom"</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" placement="bottom" dropWidth="300" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>
    <p>autoPlacement={{autoPlacement}} && placement="bottom-start"</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" placement="bottom-start" dropWidth="300" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>
    <p>autoPlacement={{autoPlacement}} && placement="bottom-end"</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" placement="bottom-end" dropWidth="300" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>

    <p>transfer</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" transfer labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>
    <p>=============== transfer =============</p>
    <p>autoPlacement={{autoPlacement}} && placement="top"</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" transfer placement="top" dropWidth="300" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>
    <p>autoPlacement={{autoPlacement}} && placement="top-start"</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" transfer placement="top-start" dropWidth="300" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>
    <p>autoPlacement={{autoPlacement}} && placement="top-end"</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" transfer placement="top-end" dropWidth="300" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>
    <p>autoPlacement={{autoPlacement}} && placement="bottom"</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" transfer placement="bottom" dropWidth="300" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>
    <p>autoPlacement={{autoPlacement}} && placement="bottom-start"</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" transfer placement="bottom-start" dropWidth="300" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>
    <p>autoPlacement={{autoPlacement}} && placement="bottom-end"</p>
    <u-select v-model="value" :autoPlacement="autoPlacement" transfer placement="bottom-end" dropWidth="300" labelKey="title" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>

    <u-select v-model="value" :autoPlacement="autoPlacement" labelKey="title" dropWidth="200" valueKey="id">
      <u-select-tree defaultExpandAll :treeData="treeData2"></u-select-tree>
    </u-select>

  </div>
</template>

<script>
var treeData2 = [
  {
    title: 'title-0-0',
    id: '0-0',
    children: [
      {
        title: 'title-0-0-0',
        id: '0-0-0',
        children: []
      },
      {
        title: 'title-0-0-1',
        id: '0-0-1',
        children: [
          {
            title: 'title-0-0-1-0-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            id: '0-0-1-0',
            leaf: true
          },
          {
            title: 'title-0-0-1-1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            id: '0-0-1-1'
          },
          {
            title: 'title-0-0-1-2-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            id: '0-0-1-2'
          }
        ]
      },
      {
        title: 'title-0-0-2',
        id: '0-0-2',
        leaf: true
      }
    ]
  }
]
export default {
  data () {
    return {
      value: '',
      treeData2,
      autoPlacement: true,
      // expandedKeys: ['0-0-1', '0-0-0-2']
    }
  },
  methods: {
    autoloadData (item, callback) {
      let text = ''
      const arr = new Array(item.level).fill('x')
      arr.forEach(v => (text = text + v))
      setTimeout(() => {
        let data = [
          {
            title: 'autoLoad-children' + item.id + text,
            id: item.id + '0',
            loading: false,
            children: []
          },
          {
            title: 'autoLoad-children' + +item.id,
            id: item.id + '1',
            loading: false,
            children: [],
            leaf: true
          }
        ]
        item.level > 4 && (data = [])
        callback(data)
      }, 1000)
    },
    autoloadData1 (item, callback) {
      let text = ''
      // console.log(item);
      const arr = new Array(item.level).fill('x')
      arr.forEach(v => (text = text + v))
      // console.log("text---->", arr, text);
      // for(let i = 0; i<1000; i++){

      // }
      const data = new Array(10).fill('').map((v, index) => {
        return {
          title: 'autoLoad-children' + item.id + '-' + index,
          id: item.id + '-' + index,
          loading: false,
          children: [],
          leaf: !(index >= 0 && index < 500)
        }
      })
      setTimeout(() => {
        callback(data)
      }, 1000)
    },
    load (value, eventObj) {
      console.log('value, eventObj----->', value, eventObj)
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
