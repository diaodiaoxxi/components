<template>
  <div class="tree-demo" style="width: 500px;">
    <h-button @click="checkedKeys = setcheckedKeys">setvalue-checkedKeys</h-button>
    <h-button @click="selectedKeys = setselectedKeys">setvalue-selectedKeys</h-button>
    <br />
    <h-input v-model="value" placeholder="请输入..." style="width: 300px"></h-input>

    <!-- <u-tree ref="tree" :treeData="treeData1"></u-tree> -->

    <!-- <u-tree ref="tree" virtual :expandLevel="2" :filterValue="value" treeNodeFilter :filterNodeMethod="filterNodeMethod" :treeData="treeData1" showCheckbox></u-tree> -->
    <!-- <u-tree :treeData="treeData" multiple v-model="checkedKeys" :expandedKeys.sync="expandedKeys" :selectedKeys.sync="selectedKeys" ></u-tree> -->
    <!-- <u-tree :treeData="treeData1" multiple v-model="checkedKeys" defaultExpandAll :selectedKeys.sync="selectedKeys" ></u-tree> -->
    <!-- <u-tree :treeData="treeData1" multiple showCheckbox defaultExpandAll :selectedKeys.sync="selectedKeys" ></u-tree> -->
    <!-- <u-tree :treeData="treeData1" multiple defaultExpandAll :selectedKeys.sync="selectedKeys" ></u-tree> -->
    <!-- <u-tree :treeData="treeData1" multiple defaultExpandAll blockNode v-model="checkedKeys" showCheckbox ></u-tree> -->

    <!-- <u-tree :treeData="treeData4" :filterValue="value" treeNodeFilter blockNode showCheckbox :renderMenu="renderContent" :renderIcon="renderIcon" > </u-tree> -->
    <!-- <u-tree :treeData="treeData1" defaultExpandAll blockNode showCheckbox isBoxRight :renderMenu="renderContent"></u-tree> -->
    <!-- <u-tree :treeData="treeData1" defaultExpandAll v-model="checkedKeys" blockNode showCheckbox :selectable="false" checkStrictly :renderMenu="renderContent"></u-tree> -->
    <!-- <u-tree :treeData="treeData1" defaultExpandAll v-model="checkedKeys" blockNode showCheckbox :selectable="false" :renderMenu="renderContent"></u-tree> -->
   
    <!-- <u-tree :treeData="treeData2" virtual :filterValue="value" :filterNodeMethod="filterNodeMethod"  showCheckbox :expandLevel="2" :renderMenu="renderContent" titleMaxWidth="150" :load-data="autoloadData1" blockNode ></u-tree> -->

    <!-- <u-tree :treeData="treeData2" :filterValue="value" treeNodeFilter :filterNodeMethod="filterNodeMethod"  showCheckbox checkStrictly :expandLevel="2"  :load-data="autoloadData" blockNode ></u-tree> -->
    <!-- renderTextTips -->

    <p>常规/基本</p>
    <u-tree :treeData="treeData1"></u-tree>
    <p>multiple</p>
    <u-tree multiple :treeData="treeData1"></u-tree>
    <p>multiple && :selectedKeys.sync="selectedKeys"</p>
    <u-tree :treeData="treeData1" multiple :selectedKeys.sync="selectedKeys" ></u-tree>
    


    <!-- <div>multiple</div>
    <u-tree multiple :treeData="treeData1"></u-tree>
    <div>multiple && :selectedKeys.sync="selectedKeys"  </div>
    <u-tree :treeData="treeData1" multiple :selectedKeys.sync="selectedKeys" ></u-tree>
    <div>showCheckbox</div>
    <u-tree :treeData="treeData1" showCheckbox ></u-tree>
    <div>showCheckbox && v-model="checkedKeys" </div>
    <u-tree :treeData="treeData1" showCheckbox  v-model="checkedKeys" ></u-tree>
    <div>:expandedKeys.sync="expandedKeys"</div>
    <u-tree :treeData="treeData1" :expandedKeys.sync="expandedKeys"></u-tree>
     <div> defaultExpandAll && :expandedKeys.sync="expandedKeys"</div>
    <u-tree :treeData="treeData1" defaultExpandAll :expandedKeys.sync="expandedKeys"></u-tree> -->
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
  let num = 3
  if (obj.levels <= 2) num = obj.levels
  return Array(num)
    .fill("")
    .map((item, index) => {
      return {
        title: `${obj.title}-${index}`,
        id: `${obj.id}-${index}`,
        levels: obj.levels + 1,
        // selectable: (index == 1) ? true : false,
        // disabled: (index == 1) ? true : false,
        // disableCheckbox: index == 2 ? true : false,
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

var treeData4 = [
  {
    expand: true,
    checked: false,
    title: "parent 1",
    id: "0",
    searchTxt: "",
    children: [
      {
        title: "parent 1-0",
        id: "0-0",
        expand: false,
        children: [
          {
            expand: true,
            checked: true,
            disabled: true,
            title: "leaf",
            id: "0-0-0",
            disableCheckbox: true
          },
          {
            title: "leaf",
            id: "0-0-1"
          }
        ]
      },
      {
        title: "parent 1-1",
        expand: true,
        checked: true,
        id: "0-1",
        children: [
          {
            title: '<span style="color: red">leaf</span>',
            id: "0-1-0"
          },
          {
            title: "leaf2",
            id: "0-1-1"
          }
        ]
      }
    ]
  }
];

var treeData2 = [
  {
    title: "title-0-0",
    id: "0-0",
    children: [
      {
        title: "title-0-0-0",
        id: "0-0-0",
        children: []
      },
      {
        title: "title-0-0-1",
        id: "0-0-1",
        children: [
          {
            title: "title-0-0-1-0-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            id: "0-0-1-0",
            leaf: true
          },
          {
            title: "title-0-0-1-1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            id: "0-0-1-1"
          },
          {
            title: "title-0-0-1-2-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
            id: "0-0-1-2"
          }
        ]
      },
      {
        title: "title-0-0-2",
        id: "0-0-2",
        leaf: true
      }
    ]
  }
];
var treeData3 = [
  {
    title: "title-0-0",
    id: "0-0",
    children: [],
    levels: 1
  }
];

export default {
  data() {
    return {
      value: "",
      treeData: treeData,
      treeData1: treeData1,
      treeData3,
      treeData2,
      treeData4,
      checkedKeys: ["0-0-0", "0-0-1-1", "0-0-1-2"],
      selectedKeys: ["0-0", "0-0-1-2", "0-0-1-1"],
      setcheckedKeys: ["0-0-1-1", "0-0-1-2"],
      setselectedKeys: ["0-0-1-1", "0-0-1-2"],
      expandedKeys: ["0-0-1", "0-0-0-2", "0-0-1-2"]
      // expandedKeys: ['0-0-1', '0-0-0-2']
    };
  },
  methods: {
    check(value) {
      // console.log('check----->', value)
    },
    autoloadData(item, callback) {
      let text = "";
      console.log(item);
      let arr = new Array(item.level).fill("x");
      arr.forEach(v => (text = text + v));
      console.log("text---->", arr, text);
      setTimeout(() => {
        const data = [
          {
            title: "autoLoad-children" + item.id + text,
            id: item.id + "0",
            loading: false,
            children: []
          },
          {
            title: "autoLoad-children" + +item.id,
            id: item.id + "1",
            loading: false,
            children: [],
            leaf: true
          }
        ];
        callback(data);
        // callback([])
        // return data
      }, 1000);
    },
    autoloadData1(item, callback) {
      let text = "";
      // console.log(item);
      let arr = new Array(item.level).fill("x");
      arr.forEach(v => (text = text + v));
      // console.log("text---->", arr, text);
      // for(let i = 0; i<1000; i++){

      // }
      let data = new Array(10).fill('').map((v, index) => {
        return {
          title: "autoLoad-children" + item.id + '-' + index,
          id: item.id + '-' + index,
          loading: false,
          children: [],
          leaf: !(index>=0 && index < 500)
        }
      })
      setTimeout(() => {
        callback(data);
      }, 1000);
    },
    renderContent(h, { root, node, data }) {
      // console.log(root, node, data)
      return h(
        "span",
        {
          style: {
            display: "inline-block",
            width: "100%"
          },
          on: {
            click: () => {
              console.log(111111);
            }
          }
        },
        [
          h("span", [
            h("h-icon", {
              props: {
                name: "ios-paper-outline"
              },
              style: {
                marginRight: "8px"
              }
            }),
            h("span", data.title)
          ]),
          h("span", {
            style: {
              display: "inline-block",
              float: "right",
              marginRight: "32px"
            }
          })
        ]
      );
    },
    renderTextTips(item) {
      // return 'title--------->'+ item.title + /n+  item.id
      return `title------->${item.title} \/n id---------->${item.is}`;
    },
    filterNodeMethod({ value, data, node }) {
      // console.log(value, data, node)
      if (value === "") return;
      // console.log(data.title.includes(value))
      if (node.title.includes(value)) return true;
      return false;
    },
    renderIcon(h, { root, node, data }) {
      if (data.level === 1) {
        return  h("span", [ h("h-icon", { props: { name: "folder" }, style: { marginRight: "8px" } }), ])
      } else{
        return h('span', [ h('h-icon', { props: { name: 'ios-paper-outline' }, style: { marginRight: '8px' } }) ])
      }
      
    }
  }
};
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