<style module="style" lang="scss" src="@hsfundPms/index.scss"></style>
<template>
  <div :class="style['page-content']">
    <TqSidebar v-if="pageType == 0" :class="style['pms-h-sidebar-wrapper']" :style="{left: isUcf?'8px':sidebar.opened ? '208px' : '68px',top: isUcf?'8px':'90px'}"></TqSidebar>
    <ThSidebar v-else-if="pageType == 2" :class="style['pms-h-sidebar-wrapper']" :style="{left: isUcf?'8px':sidebar.opened ? '208px' : '68px',top: isUcf?'8px':'90px'}" :pageId="pageId"></ThSidebar>
    <div :class="style['pms-content']">
      <grid-layout
        :layout.sync="layout"
        :col-num="24"
        :row-height="24"
        :is-draggable="draggable"
        :is-resizable="resizable"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[6, 0]"
        :use-css-transforms="true"
        :prevent-collision="false"
        @layout-created="layoutCreatedEvent"
        @layout-before-mount="layoutBeforeMountEvent"
        @layout-mounted="layoutMountedEvent"
        @layout-ready="layoutReadyEvent"
        @layout-updated="layoutUpdatedEvent"
      >
        <grid-item
          v-for="(item,index) in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :min-w="item.minW"
          :min-h="item.minH"
          :i="item.i"
          :key="item.i"
          :isDraggable="item.draggable"
          :isResizable="item.resizable"
          @resize="resize"
          @move="move"
          @resized="resized"
          @moved="moved"
        >
          <component
            v-bind:is="item.component_type"
            :width="item.width"
            :height="item.h*24-6"
            :parentPath="'/'+item.component_group"
            :column_list="item.column_list"
            :component_id="item.component_id"
            :component_title="item.component_title"
            :config_list="item.config_list"
            :showDel="showDel"
            :delComponent="delComponent"
            :page_id="pageId"
            :componentType="item.component_type"
            :pageType="pageType"
            :value="index"
          />
        </grid-item>
      </grid-layout>
    </div>
    <div
      :class="style[anchor-content]"
      draggable="true"
      @dragstart="dragstart($event)"
      @dragend="dragend"
      v-show="false"
      :style="{bottom:anchorBottom +'px',right:anchorRight +'px'}">
      <ul>
        <li
          v-for="(item,index) in anchorList"
          :key="index"
          ::class="{active:activeBtn == index}"
          @click="goAnchor('#pmsSection-'+index,index)"
        >{{item}}</li>
      </ul>
    </div>
      <h-msg-box
          :class="style['hsfundPms-msgBox']"
          v-model="cancelEditModal"
          :canDrag="false"
          :escClose=true
          :transfer="false"
          title="提示"
          width="300"
          @on-ok="cancelEdit">
          <span>您确定放弃未保存的编辑信息吗？</span>
      </h-msg-box>
      <h-msg-box
          :class="[style['all-component'],style['hsfundPms-msgBox']]"
          v-model="addComponentModal"
          :canDrag="false"
          :escClose=true
          :transfer="false"
          title="新增组件"
          @on-ok="ensureAdd"
          width="500">
          <div>
            <div :class="style['component-selected']">
              <span v-for="(item,index) in addComponentList" :key="index" :class="style['component-selected-option']">
                {{item.component_title}}
                <h-icon name="android-close" @on-click="cancelSelect(item.component_id)"></h-icon>
              </span>
            </div>
            <div :class="style['component-content']">
              <h-tabs :animated="false">
                <h-tab-pane v-for="(item,index) in allComponentTreeData" :label="item.dict_name" :key="index">
                  <div :class="style['component-menu']">
                    <ul>
                      <li v-for="(ite,index) in item.dict_list" :key="index" ::class="{[style.active]:activeIndex == index}">
                        {{ite.dict_name}}({{ite.component_list.length}})
                      </li>
                    </ul>

                  </div>
                  <div :class="style['component-list']">
                    <ul>
                      <li v-for="(ite,index) in item.dict_list" :key="index">
                        <p>{{ite.dict_name}}</p>
                        <h-checkbox-group v-model="selectList">
                          <h-checkbtn v-for="(componentOption,index) in ite.component_list" :value="componentOption.component_id" :label="componentOption.component_title" @on-click="checkComponent" :key="index">

                          </h-checkbtn>
                        </h-checkbox-group>
                      </li>
                    </ul>

                  </div>

                </h-tab-pane>
              </h-tabs>
            </div>
          </div>
      </h-msg-box>

      <div :class="style['edit-component-btn']" @mousedown.stop="move1" v-show="!editOpened" @click="editLayout">
      </div>
      <div id="edit-catainer" :class="style['edit-catainer']" v-show="editOpened"
      >
        <div :class="style['btn-text']" @click="addComponent">新增</div>
        <div :class="[style['btn-text'],{[style.btnDisabled]:!canSave}]" @click="savePage">确认</div>
        <div :class="style['cancel-component-btn']" @click="exit">
          <img src="@hsfundPms/assets/cancel_component_edit.png" alt="取消编辑">
        </div>
      </div>
      <!-- </div> -->
  </div>
  <!-- 此处注释勿删 -->
  <!-- <div :class="expand" @click.prevent.stop="expandSiderbar" v-if="!hsfundPmsSidebar.opened">
    <h-icon name="chevron-right" ></h-icon>
  </div>
  <div :class="shrink" @click.prevent.stop="expandSiderbar" v-if="hsfundPmsSidebar.opened">
    <h-icon name="chevron-left" ></h-icon>
  </div> -->
</template>

<script>
// import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'
import {
  getPage,
  savePage,
  listComponentPool
} from '@hsfundPms/api/apiConfig/pageConfig.js'
import TqSidebar from '@hsfundPms/components/public/TqSidebar'
import ThSidebar from '@hsfundPms/components/public/ThSidebar'
import { on } from '@hsfundPms/common/commonUtils'
import GridItem from '@hsfundPms/gridLayout/components/GridItem.vue'
import GridLayout from '@hsfundPms/gridLayout/components/GridLayout.vue'
export default {
  name: 'module',
  data () {
    return {
      layout: [],
      newLayout: [],
      componentsList: [],
      isShowAnchor: true,
      anchorList: [],
      activeBtn: 0,
      anchorBottom: 150,
      anchorRight: 8,
      mouseStartX: 0,
      mouseEndX: 0,
      mouseStartY: 0,
      mouseEndY: 0,
      responsive: 0,
      isShowSecuritySelect: true,
      asset_type: 2,
      pageId: 0,
      draggable: false,
      resizable: false,
      editOpened: false,
      showDel: false,
      cancelEditModal: false,
      addComponentModal: false,
      allComponentTreeData: [], // 新增组件弹窗内，渲染组件池布局的treeData数据
      allComponentList: [], // 组件池所有组件
      addComponentList: [], // 新增组件时，选中的组件
      addComponentLayout: [],
      selectList: [], // 选中的组件，为了渲染组件卡片
      activeIndex: 0,
      editContentBottom: 70,
      editContentRight: 30,
      pageType: 3, // 0--投前，1--投中，2--投后
      del_component_id: [],
      component_group: '',
      canSave: false,
      positionX: 150,
      positionY: 150,
      lastCompent: {}, // 最后一个组件
      lastRowCompentY: 0, // 最后一行组件的Y坐标
      lastRowCompentMaxHeight: 0, // 最后一行组件的最大高度

    }
  },
  props: {},
  components: {
    // fgSidebar,
    GridLayout,
    GridItem,
    TqSidebar,
    ThSidebar
  },
  mixins: [],
  computed: {
    ...mapGetters(['hsfundPmsSidebar', 'sidebar'])
  },
  watch: {},
  methods: {
    layoutCreatedEvent: function (newLayout) {
      // console.log("Created layout: ", newLayout)
    },
    layoutBeforeMountEvent: function (newLayout) {
      // console.log("beforeMount layout: ", newLayout)
    },
    layoutMountedEvent: function (newLayout) {
      // console.log("Mounted layout: ", newLayout)
    },
    layoutReadyEvent: function (newLayout) {
      // console.log("Ready layout: ", newLayout)
    },
    layoutUpdatedEvent: function (newLayout) {
      console.log('Updated layout: ', newLayout)
      this.layout = newLayout
      this.canSave = true
    },
    move: function (i, newX, newY) {
      // console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    resize: function (i, newH, newW, newHPx, newWPx) {
      // console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
    },
    moved: function (i, newX, newY) {
      // console.log("### MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    resized: function (i, newH, newW, newHPx, newWPx) {
      // console.log("### RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
      this.layout.forEach((item, index) => {
        if (i == index) {
          item.width = Number(newWPx)
          item.height = Number(newHPx)
        }
      })
      // console.log(this.layout)
    },
    expandSiderbar () {
      this.$store.dispatch('ToggleHsfundPmsSidebar')
    },
    handleResize () {
      this.$nextTick(() => {
        const appObj = document.getElementsByClassName('app-main')
        const appOffsetTop = appObj.length === 0 ? 0 : appObj[0].offsetTop
        const noticeObj = document.getElementsByClassName('h-notice-bar')
        const noticeClientHeight =
          noticeObj.length === 0 ? 0 : noticeObj[0].clientHeight
        this.responsive =
          window.innerHeight - appOffsetTop - noticeClientHeight - 8

        window.addEventListener('scroll', this.onScroll)
      })
    },
    goAnchor (selector, index) {
      this.activeBtn = index
      const total = this.layout[index].y * 24
      let distance =
        document.documentElement.scrollTop || document.body.scrollTop
      // 平滑滚动，时长500ms，每10ms一跳，共50跳
      let step = total / 50
      if (total > distance) {
        smoothDown()
      } else {
        const newTotal = distance - total
        step = newTotal / 50
        smoothUp()
      }
      function smoothDown () {
        if (distance < total) {
          distance += step
          document.body.scrollTop = distance
          document.documentElement.scrollTop = distance
          setTimeout(smoothDown, 10)
        } else {
          document.body.scrollTop = total
          document.documentElement.scrollTop = total
        }
      }
      function smoothUp () {
        if (distance > total) {
          distance -= step
          document.body.scrollTop = distance
          document.documentElement.scrollTop = distance
          setTimeout(smoothUp, 10)
        } else {
          document.body.scrollTop = total
          document.documentElement.scrollTop = total
        }
      }
    },

    onScroll () {
      const scrolled =
        document.documentElement.scrollTop || document.body.scrollTop
      this.layout.forEach((item, index) => {
        const y = item.y * 24
        const height = item.h
        if (scrolled >= y && scrolled < y + height) {
          this.activeBtn = index
        }
      })

      // domList.forEach
    },
    // 锚点拖放
    dragstart (ev) {
      this.mouseStartX = ev.clientX
      this.mouseStartY = ev.clientY
      console.log('拖动开始鼠标横坐标' + this.mouseStartX)
      console.log('拖动开始鼠标纵坐标' + this.mouseStartY)
    },
    dragend (ev) {
      this.mouseEndX = ev.clientX
      this.mouseEndY = ev.clientY

      this.anchorBottom =
        this.anchorBottom - (this.mouseEndY - this.mouseStartY)
      this.anchorRight = this.anchorRight - (this.mouseEndX - this.mouseStartX)
      // 限制锚点拖放区域
      if (this.anchorBottom < 0) {
        this.anchorBottom = 0
      }
      if (
        this.anchorBottom >
        window.innerHeight - 50 - ev.target.clientHeight - 2
      ) {
        this.anchorBottom =
          window.innerHeight - 50 - ev.target.clientHeight - 2
      }
      if (this.anchorRight < 8) {
        this.anchorRight = 8
      }
      if (this.anchorRight > window.innerWidth - ev.target.clientWidth - 2) {
        this.anchorRight = window.innerWidth - ev.target.clientWidth - 2
      }
    },
    dragend1 (ev) {
      this.mouseEndX = ev.clientX
      this.mouseEndY = ev.clientY
      console.log('拖动结束鼠标横坐标' + this.mouseEndX)
      console.log('拖动结束鼠标纵坐标' + this.mouseEndY)
      this.editContentBottom =
        this.editContentBottom - (this.mouseEndY - this.mouseStartY)
      this.editContentRight = this.editContentRight - (this.mouseEndX - this.mouseStartX)
      // 限制锚点拖放区域
      if (this.editContentBottom < 0) {
        this.editContentBottom = 0
      }
      if (
        this.editContentBottom >
        window.innerHeight - 50 - ev.target.clientHeight - 2
      ) {
        this.editContentBottom =
          window.innerHeight - 50 - ev.target.clientHeight - 2
      }
      if (this.editContentRight < 8) {
        this.editContentRight = 8
      }
      if (this.editContentRight > window.innerWidth - ev.target.clientWidth - 2) {
        this.editContentRight = window.innerWidth - ev.target.clientWidth - 2
      }
    },
    getComponentsList () {
      getPage({
        page_id: this.pageId
        // page_id: "202002"
      })
        .then(res => {
          if (res.data && res.data.error_no == 0) {
            this.componentsList = res.data.result.component_list ? res.data.result.component_list : []

            this.layout = this.filiterLayout(this.componentsList)
            this.pageType = Number(res.data.result.page_type)
            // console.log(this.pageType)
            this.anchorList = []
            this.componentsList.forEach((item, index) => {
              this.anchorList.push(item.component_title)
            })
            // console.log(this.anchorList)

            let subHeight = 0
            this.componentsList.forEach(item => {
              subHeight += item.height
            })
            if (subHeight < this.reponsive) {
              this.isShowAnchor = false
            }
            if (this.componentsList.length > 1) {
              // 强制设置页面最后一个组件高度不小于可用容器高度，为了最后一部分锚点可被激活
              if (
                this.componentsList[this.componentsList.length - 1].height <
                this.responsive
              ) {
                this.componentsList[
                  this.componentsList.length - 1
                ].height = this.responsive
              }
            }
          } else {
            this.componentsList = []
            this.$hMessage.error(this.hsfundPms.error_info)
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.$hMessage.error(this.hsfundPms.error_info)
        })
    },
    filiterLayout (data) {
      const arr = []
      let obj = {}
      data.forEach((item, index) => {
        obj = {}
        obj.x = item.component_left
        obj.y = item.component_top
        obj.w = item.component_width
        obj.h = item.component_height
        obj.minW = item.component_min_width ? item.component_min_width : 2
        obj.minH = item.component_min_height ? item.component_min_height : 2
        obj.i = index + ''
        obj.column_list = item.column_list ? item.column_list : []
        obj.component_group = item.component_group
        obj.component_id = item.component_id
        obj.component_title = item.component_title
        obj.component_type = item.component_type
        obj.config_list = item.config_list ? item.config_list : []
        obj.draggable = this.draggable ? item.draggable : false
        obj.resizable = this.resizable ? item.resizable : false
        arr.push(obj)
      })
      return arr
    },
    savePage () {
      if (!this.canSave) {
        return
      }
      // eslint-disable-next-line camelcase
      const component_properties = []
      this.layout.forEach(item => {
        const obj = {}
        obj.component_width = item.w
        obj.component_height = item.h
        obj.component_min_height = item.minH
        obj.component_min_width = item.minW
        obj.component_left = item.x
        obj.component_top = item.y
        obj.component_group = this.component_group
        obj.component_id = item.component_id
        obj.component_title = item.component_title
        obj.component_type = item.component_type
        obj.draggable = item.draggable
        obj.resizable = item.resizable
        // if (item.column_list.length > 0) {
        //   obj["column_list"] = item.column_list;
        // }
        // if (item.config_list.length > 0) {
        //   obj["config_list"] = item.config_list;
        // }
        component_properties.push(obj)
      })
      let params = {}
      if (component_properties.length == 0) {
        params = {
          page_id: this.pageId
        }
      } else {
        params = {
          page_id: this.pageId,
          component_properties: component_properties
        }
      }
      savePage(params)
        .then(res => {
          if (res.data && res.data.error_no == 0) {
            this.editOpened = !this.editOpened
            this.showDel = false
            this.draggable = false
            this.resizable = false
            this.getComponentsList(this.pageId)
            this.$hMessage.success('保存成功')
            this.canSave = false
            location.reload()
          } else {
            this.$hMessage.error('保存失败')
          }
        })
        // eslint-disable-next-line handle-callback-err
        .catch(err => {
          this.$hMessage.error('保存失败')
        })
    },
    editLayout () {
      this.editOpened = !this.editOpened
      this.showDel = true
      this.draggable = true
      this.resizable = true
      this.layout = this.filiterLayout(this.componentsList)
    },
    exit () {
      if (this.canSave) {
        this.cancelEditModal = true
      } else {
        this.cancelEdit()
      }
    },
    cancelEdit () {
      this.cancelEditModal = false
      this.editOpened = !this.editOpened
      this.showDel = false
      this.draggable = false
      this.resizable = false
      this.layout = this.filiterLayout(this.componentsList)
      this.allComponentTreeData = []
      this.selectList = []
      this.del_component_id = []
      this.canSave = false
    },
    saveLayout () {

    },
    addComponent () {
      // this.allComponentTreeData = []
      // this.selectList = []
      if (this.allComponentTreeData.length != 0) {
        this.addComponentListChange()
        this.addComponentModal = true
      } else {
        listComponentPool({
          page_id: this.pageId
        }).then(
          res => {
            if (res.data && res.data.error_no == 0) {
              // 渲染所需树结构数据
              this.allComponentTreeData = this.allComponentListFiliter(res.data.result.component_list, res.data.result.dict_dto_list)
              // 组件池原始全部组件列表
              this.allComponentList = res.data.result.component_list
              this.addComponentListChange()
              this.addComponentModal = true
            } else {
              this.allComponentTreeData = []
              this.allComponentList = []
              this.$hMessage.error(this.hsfundPms.error_info)
            }
          }
        )
          // eslint-disable-next-line handle-callback-err
          .catch(err => {
            this.allComponentTreeData = []
            this.allComponentList = []
            this.$hMessage.error(this.hsfundPms.error_info)
          })
      }
    },
    // 处理组件池数据为渲染所需树结构数据
    // eslint-disable-next-line camelcase
    allComponentListFiliter (component_list, dict_dto_list) {
      var result = []; var ret = {}
      function add (arr, data) {
        var obj = {
          dict_name: data.dict_name,
          id: data.id,
          parent_id: data.parent_id
        }
        ret[data.id] = obj
        arr.push(obj)
      }

      function addComponent (arr, data) {
        var obj = {
          column_list: data.column_list ? data.column_list : [],
          component_group: data.component_group,
          component_height: data.component_height,
          component_id: data.component_id,
          component_left: data.component_left,
          component_min_height: data.component_min_height,
          component_min_width: data.component_min_width,
          component_title: data.component_title,
          component_top: data.component_top,
          component_type: data.component_type,
          component_width: data.component_width,
          config_list: data.config_list ? data.config_list : [],
          dict_id: data.dict_id,
          draggable: data.draggable,
          resizable: data.resizable,
          select_flag: data.select_flag,
        }
        ret[data.id] = obj
        arr.push(obj)
      }
      dict_dto_list.forEach(x => {
        if (x.parent_id == 0) {
          add(result, x)
        }
      })
      dict_dto_list.forEach(x => {
        if (ret[x.parent_id]) {
          if (!(ret[x.parent_id]).dict_list) {
            (ret[x.parent_id]).dict_list = []
          }
          add(ret[x.parent_id].dict_list, x)
        }
      })

      component_list.forEach(x => {
        if (ret[x.dict_id]) {
          if (!(ret[x.dict_id]).component_list) {
            (ret[x.dict_id]).component_list = []
          }
          addComponent(ret[x.dict_id].component_list, x)
        }
        if (!this.del_component_id.includes(x.component_id)) {
          if (x.select_flag) {
            this.selectList.push(x.component_id)
          }
        }
      })
      return result
    },
    checkComponent (e, val) {
      if (this.selectList.length === 0) {
        this.$hMessage.warning('您还未选择组件')
      }
      this.addComponentListChange()
    },
    // checkbox改变选中状态
    addComponentListChange () {
      this.addComponentList = []
      this.selectList.forEach(item => {
        this.allComponentList.forEach(ite => {
          if (ite.component_id == item) {
            this.addComponentList.push(ite)
          }
        })
      })
    },
    // 取消选中组件
    cancelSelect (id) {
      // 取消选中组件卡片区域组件 下面checkbox联动
      this.selectList.forEach((item, index) => {
        if (item == id) {
          this.selectList.splice(index, 1)
        }
      })
      this.addComponentList.forEach((item, index) => {
        if (item.component_id == id) {
          this.addComponentList.splice(index, 1)
        }
      })
      if (this.selectList.length === 0) {
        this.$hMessage.warning('您还未选择组件')
      }
    },
    suan () {
      this.lastRowCompentY = Math.max.apply(Math, this.layout.map(item => {
        return item.y
      }))
      // 最后一行组件集合
      const lastRowCompentList = [] // 最后一行组件集合
      // eslint-disable-next-line no-unused-vars
      let lastRowWidthSum = 0
      this.layout.forEach(item => {
        if (item.y == this.lastRowCompentY) {
          lastRowWidthSum += item.w
          lastRowCompentList.push(item)
        }
      })
      this.lastRowCompentMaxHeight = Math.max.apply(Math, lastRowCompentList.map(item => {
        return item.h
      }))
      // 最后一个组件
      const lastCompentX = Math.max.apply(Math, lastRowCompentList.map(item => {
        return item.x
      }))
      lastRowCompentList.forEach(item => {
        if (item.x == lastCompentX) {
          this.lastCompent = item
        }
      })
    },
    ensureAdd () {
      this.addComponentModal = false
      this.addComponentList.forEach(item => {
        this.layout.forEach(ite => {
          if (ite.component_id == item.component_id) {
            item.component_height = ite.h
            item.component_width = ite.w
            item.component_left = ite.x
            item.component_top = ite.y
          }
        })
      })
      this.addComponentLayout = this.filiterLayout(this.addComponentList)
      // this.layout = []
      this.suan()
      this.addComponentLayout.forEach((item, index) => {
        if (item.x == null && item.y == null) {
          if ((item.w + this.lastCompent.w + this.lastCompent.x) > 24) {
            item.x = 0
            item.y = this.lastRowCompentY + this.lastRowCompentMaxHeight
          } else {
            item.x = this.lastCompent.w + this.lastCompent.x
            item.y = this.lastRowCompentY
          }
          this.layout.push(item)
          this.suan()
        }
        this.canSave = true
      })
    },
    // eslint-disable-next-line camelcase
    delComponent (component_id) {
      this.del_component_id.push(component_id)
      this.selectList.forEach((item, index) => {
        // eslint-disable-next-line camelcase
        if (item == component_id) {
          this.selectList.splice(index, 1)
        }
      })
      const delLayout = this.layout
      delLayout.forEach((item, index) => {
        // eslint-disable-next-line camelcase
        if (item.component_id == component_id) {
          delLayout.splice(index, 1)
        }
      })
      this.layout = delLayout
      this.canSave = true
    },
    move1 (e) {
      const odiv = e.target // 获取目标元素
      const odiv1 = document.getElementById('edit-catainer')
      // 算出鼠标相对元素的位置
      const disX = e.clientX - odiv.offsetLeft
      const disY = e.clientY - odiv.offsetTop
      document.onmousemove = (e) => { // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX
        let top = e.clientY - disY

        // //移动当前元素
        if (this.isUcf) {
          if (left < 8) {
            left = 8
          }
          if (left > window.innerWidth - 50) {
            left = window.innerWidth - 50
          }
          if (top < 8) {
            top = 8
          }
          if (top > window.innerHeight - 40) {
            top = window.innerHeight - 40
          }
        } else {
          if (left < 60) {
            left = 60
          }
          if (left > window.innerWidth - 50) {
            left = window.innerWidth - 50
          }
          if (top < 90) {
            top = 90
          }
          if (top > window.innerHeight - 40) {
            top = window.innerHeight - 40
          }
        }
        odiv.style.left = left + 'px'
        odiv.style.top = top + 'px'
        odiv1.style.left = left + 'px'
        if (top > window.innerHeight - 100) {
          odiv1.style.top = top - 100 + 'px'
        } else {
          odiv1.style.top = top + 'px'
        }

        // odiv.style.right = window.screen.availWidth - left + 'px';
        // odiv.style.bottom = window.screen.availHeight - top + 'px';
        // odiv1.style.right = window.screen.availWidth - left + 'px';
        // odiv1.style.bottom = window.screen.availHeight - top + 'px';
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
  created () {
    this.isUcf = window.LOCAL_CONFIG.isUcf
    // 解析当前页面信息
    const pageObj = {}
    const pageStr = this.$route.meta.menuArgs.menu_arg
    const pageArr = pageStr.split('&')
    // console.log(pageArr)
    pageArr.forEach(item => {
      const tmp = item.split('=')
      pageObj[tmp[0]] = tmp[1]
    })
    this.pageId = Number(pageObj.pageId)

    this.getComponentsList()

    const urlArr = location.href.split('/')
    if (this.isUcf) {
      this.component_group = urlArr[urlArr.length - 1].split('?')[0]
    } else {
      this.component_group = urlArr[urlArr.length - 1]
    }
  },
  mounted () {
    this.handleResize()
    on(window, 'resize', this.handleResize)
  },
  updated () {},
  activated () {
    this.handleResize()
    on(window, 'resize', this.handleResize)
  },
  deactivated () {
    this.handleResize()
    on(window, 'resize', this.handleResize)
  },
  destroyed () {
    this.handleResize()
    on(window, 'resize', this.handleResize)
  }
}
</script>
