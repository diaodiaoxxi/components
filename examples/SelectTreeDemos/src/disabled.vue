<template>
  <div class="tree-demo" style="width: 500px;">
    <h-button @click="checkedKeys = setcheckedKeys">setvalue-checkedKeys</h-button>
    <h-button @click="selectedKeys = setselectedKeys">setvalue-selectedKeys</h-button>
    <br />
    <h-input v-model="value" placeholder="请输入..." style="width: 300px"></h-input>

    <p>disabled</p>
    <u-tree :treeData="treeData" disabled @on-right-click="rightClick" @on-double-click="dbClick"></u-tree>
    <p>showCheckbox && :selectable="false" && multiple</p>
    <p>树节点 disabled、selectable、disableCheckbox</p>
    <h-button @click="nodeCheck">nodeCheck外部调用</h-button>
    <u-tree ref="tree"  defaultExpandAll showCheckbox v-model="checkedKeys" :treeData="treeData1" :selectable="false" @on-check="check"  @on-right-click="rightClick" @on-double-click="dbClick"></u-tree>
  </div>
</template>

<script>
var treeData = [
  {
    title: "title-0-0",
    id: "0-0",
    children: [
      {
        title: "title-0-0-0",
        id: "0-0-0",
        children: [
          { title: "title-0-0-0-0", id: "0-0-0-0" },
          { title: "title-0-0-0-1", id: "0-0-0-1" },
          { title: "title-0-0-0-2", id: "0-0-0-2" }
        ]
      },
      {
        title: "title-0-0-1",
        id: "0-0-1",
        children: [
          { title: "title-0-0-1-0", id: "0-0-1-0" },
          { title: "title-0-0-1-1", id: "0-0-1-1" },
          {
            title: "title-0-0-1-2",
            id: "0-0-1-2",
            children: [
              { title: "title-0-0-1-2-0", id: "0-0-1-2-0" },
              { title: "title-0-0-1-2-1", id: "0-0-1-2-1" },
              { title: "title-0-0-1-2-2", id: "0-0-1-2-2" }
            ]
          }
        ]
      },
      {
        title: "title-0-0-2",
        id: "0-0-2"
      }
    ]
  },
  {
    title: "title-0-1",
    id: "0-1",
    children: [
      { title: "title-0-1-0-0", id: "0-1-0-0" },
      { title: "title-0-1-0-1", id: "0-1-0-1" },
      { title: "title-0-1-0-2", id: "0-1-0-2" }
    ]
  },
  {
    title: "title-0-2",
    id: "0-2"
  }
];
var treeData1 = [
  {
    title: "title-0-0",
    id: "0-0",
    children: [],
    levels: 1
  }
];
function newChildren(obj) {
  let num = 5
  if (obj.levels <= 2) num = obj.levels
  return Array(num)
    .fill("")
    .map((item, index) => {
      return {
        title: `${obj.title}-${index}`,
        id: `${obj.id}-${index}`,
        levels: obj.levels + 1,
        selectable: (index == 4) ? true : false,
        disabled: (index == 3) ? true : false,
        disableCheckbox: index == 2 ? true : false,
        children: []
      };
    });
}
xunhuan(treeData1);
function xunhuan(element) {
  element.forEach(item => {
    item.children = newChildren(item);
    if (item.levels <= 2) xunhuan(item.children);
  });
}
console.log("treeData1----->", treeData1);

export default {
  data() {
    return {
      value: "",
      treeData: treeData,
      treeData1: treeData1,
      checkedKeys: []
    };
  },
  methods: {
    rightClick({node, event}) {
      console.log('rightClick----->', node, event)
    },
    dbClick({node, event}) {
      console.log('dbClick----->', node, event)
    },
    check(checkedKeys, eventObj) {
      console.log('check----->', checkedKeys, eventObj)
    },
    nodeCheck() {
      this.checkedKeys = ['0-0-0-0-3']
      // this.$refs.tree.nodeCheck(true, '0-0-0-0-2')
    }
  }
};
</script>

<style lang="scss">
.tree-demo{
  &>p{
    font-weight: 600;
    font-size: 14px;
    margin-top: 20px;
  }
}
</style>