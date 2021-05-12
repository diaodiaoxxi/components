import { expect } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import hui from '@/index'
import i18n from '@examples/locale'
import Select from '@examples/SelectDemos/src/multiple.vue'
const localVue = createLocalVue()
localVue.use(hui, { i18n: (key, value) => i18n.t(key, value) })
global.requestAnimationFrame = cb => cb()
document.createRange = () => { return {} }
describe('Select 多选相关场景属性', () => {
  const selectWrap = mount(Select, { localVue })

  it('demo创建成功', () => {
    expect(selectWrap.exists()).to.true
  })

  it('select 默认显示', async () => {
    const autoSelect = selectWrap.find({ ref: 'default' })
    const reference = autoSelect.find({ ref: 'reference' })
    const value = autoSelect.vm.value
    const tags = reference.findAll('.u-select-tag')
    // 选中项
    const sOptions = autoSelect.findAll('.u-select-item.u-select-item-selected')
    // 标签数量 等于 选中项数量
    expect(tags.length).to.equal(value.length)
    expect(tags.length).to.equal(sOptions.length)
    value.map((value, i) => {
      const tagText = tags.at(i).text()
      const optionText = sOptions.at(i).text()
      // 选中项 包含 tag显示值
      expect(optionText).be.contains(tagText)
      // 选中项 包含 select value 值
      expect(optionText).be.contains(value)
    })
  })

  it('多选(选项连续展示)', async () => {
    const autoSelect = selectWrap.find({ ref: 'textType' })
    const reference = autoSelect.find({ ref: 'reference' })
    const value = autoSelect.vm.value
    const textTag = reference.find('.u-select-text-tags')
    const tagText = textTag.text()
    const sOptions = autoSelect.findAll('.u-select-item.u-select-item-selected')
    const tags = tagText.split(',')
    // 标签数量 等于 选中项数量
    expect(tags.length).to.equal(value.length)
    expect(tags.length).to.equal(sOptions.length)
    value.map((value, i) => {
      const optionText = sOptions.at(i).text()
      // 选中项 包含 tag显示值
      expect(optionText).be.contains(tags[i].trim())
      // 选中项 包含 select value 值
      expect(optionText).be.contains(value)
    })
  })

  it('maxTagCount:多选标签显示数量', async () => {
    const autoSelect = selectWrap.find({ ref: 'maxTagCount' })
    const reference = autoSelect.find({ ref: 'reference' })
    const value = autoSelect.vm.value
    const tags = reference.findAll('.u-select-tag:not(.is-more)')
    const moreTag = reference.find('.u-select-tag.is-more')
    const moreTagContent = moreTag.text()
    const moreTagNum = parseInt(moreTagContent.replace(/[^\d]/g, ''))
    const sOptions = autoSelect.findAll('.u-select-item.u-select-item-selected')
    // 标签数量 + 更多标签数字 等于 选中项数量
    expect(tags.length + moreTagNum).to.equal(value.length)
    expect(tags.length + moreTagNum).to.equal(sOptions.length)
    // hover 更多标签显示 额外标签, mouseenter mocha 不支持 改为 click
    moreTag.trigger('click')
    await autoSelect.vm.$nextTick()
    const poptip = selectWrap.find({ name: 'Poptip' })
    // const popper = selectWrap.find({ ref: 'popper' })
    expect(poptip.exists()).to.true
    // expect(popper.exists()).to.true
    // const popTags = poptip.findAll('.u-select-tag:not(.is-more)')
    // console.log(popTags.length)
  })
})
