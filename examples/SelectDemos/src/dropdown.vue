<template>
  <div>
    <h3>
      autoPlacement自适应,值可以为scrollParent, window, viewport , DOM
      element,默认为true,默认边界为window窗口
    </h3>
    <div>
      <u-select-2
        ref="autoPlacement"
        v-model="mode228"
        :autoPlacement="autoPlacement"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
      <h-switch v-model="autoPlacement"></h-switch>
      <span v-text="`autoPlacement:${autoPlacement}`"></span>
    </div>
    <h3>placement弹出方向</h3>
    <div>
      <u-select-2 ref="placementDefault" v-model="mode228" placeholder="默认向下">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>

      <u-select-2
        ref="placementDown"
        v-model="mode227"
        placement="bottom"
        placeholder="弹框向下"
        :autoPlacement="false"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>

      <u-select-2
        ref="placementUp"
        v-model="mode229"
        placement="top"
        placeholder="弹框向上"
        :autoPlacement="false"
      >
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
    </div>
    <h3>
      widthAdaption
      下拉框的宽度是否随着内容自适应，以select设置的宽度为最小宽度，最大宽度取输入框宽度与maxDropWidth的最大值
    </h3>
    <div>
      <u-select-2 ref="widthAdaption" v-model="mode228" :widthAdaption="true">
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
      <span v-text="`widthAdaption:${true}`"></span>
    </div>

    <h3>
      maxDropWidth 下拉框随着内容自适应时设置的最大宽度, 或设置 dropWidth 时,
      实际值会取输入框宽度与maxDropWidth的最大值
    </h3>
    <div>
      <u-select-2
        ref="maxDropWidth"
        v-model="mode228"
        :widthAdaption="true"
        maxDropWidth="240"
      >
        <u-option value="123">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</u-option>
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
      <span v-text="`widthAdaption:${true}`"></span> |
      <span v-text="`maxDropWidth:${240}`"></span>
    </div>
    <h3>
      dropWidth 设置下拉框的宽度,不设置时下拉框的宽度等于输入框宽度
    </h3>
    <div>
      <u-select-2
        ref="dropWidth"
        v-model="mode228"
        :widthAdaption="true"
        :dropWidth="600"
      >
        <u-option value="123">AAAAAAAAAAAAAAAAAAAAAA</u-option>
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
      <span v-text="`widthAdaption:${true}`"></span> |
      <span v-text="`dropWidth:${600}`"></span>
    </div>
    <div>
      <u-select-2
        ref="dropWidthAndMax"
        v-model="mode228"
        :widthAdaption="true"
        :dropWidth="600"
        maxDropWidth="240"
      >
        <u-option value="123">AAAAAAAAAAAAAAAAAAAAAA</u-option>
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
      <span v-text="`widthAdaption:${true}`"></span> |
      <span v-text="`dropWidth:${600}`"></span> |
      <span v-text="`maxDropWidth:${240}`"></span>
    </div>

    <h3>
      是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table
      列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果
    </h3>
    <div>
      <u-select-2 ref="transfer" v-model="mode228" transfer>
        <u-option value="123">AAAAAAAAAAAAAAAAAAAAAA</u-option>
        <u-option
          v-for="item in cityList"
          :value="item.value"
          :key="item.value"
        >
          {{ item.label }}
        </u-option>
      </u-select-2>
      <span v-text="`transfer:${true}`"></span>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      mode227: '',
      mode228: '',
      mode229: '',
      autoPlacement: true,
      cityList: [
        {
          value: 'beijing',
          label: '北京市'
        },
        {
          value: 'shanghai',
          label: '上海市'
        },
        {
          value: 'shenzhen',
          label: '深圳市'
        },
        {
          value: 'hangzhou',
          label: '杭州市'
        },
        {
          value: 'nanjing',
          label: '南京市'
        },
        {
          value: 'chongqing',
          label: '重庆市'
        }
      ]
    }
  }
}
</script>
<style>
.u-select-2 {
  width: 200px;
}
</style>
