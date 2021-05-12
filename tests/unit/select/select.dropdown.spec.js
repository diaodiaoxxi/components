import { expect } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
import { promissedTick, sleep, get } from '../util'
import hui from '@/index'
import i18n from '@examples/locale'
import Select from '@examples/SelectDemos/src/dropdown.vue'
const localVue = createLocalVue()
localVue.use(hui, { i18n: (key, value) => i18n.t(key, value) })
global.requestAnimationFrame = cb => cb()
describe('Select 下拉弹窗相关属性', () => {
  const selectWrap = mount(Select, { localVue })

  it('demo创建成功', () => {
    expect(selectWrap.exists()).to.true
  })

  it('autoPlacement 属性(自适应需要手动测验)', async () => {
    const autoSelect = selectWrap.find({ ref: 'autoPlacement' })
    const reference = autoSelect.find({ ref: 'reference' })
    const dropdown = autoSelect.find({ ref: 'dropdown' })
    expect(autoSelect.exists()).to.true
    reference.trigger('click')
    await autoSelect.vm.$nextTick()
    expect(dropdown.isVisible()).to.true
    expect(dropdown.vm.placement).to.equal('bottom-start')
  })

  it('placement="bottom"', async () => {
    const autoSelect = selectWrap.find({ ref: 'placementDown' })
    const reference = autoSelect.find({ ref: 'reference' })
    const dropdown = autoSelect.find({ ref: 'dropdown' })
    expect(autoSelect.exists()).to.true
    reference.trigger('click')
    await autoSelect.vm.$nextTick()
    expect(dropdown.isVisible()).to.true
    expect(dropdown.vm.placement).to.equal('bottom')
  })

  it('placement="top"', async () => {
    const autoSelect = selectWrap.find({ ref: 'placementUp' })
    const reference = autoSelect.find({ ref: 'reference' })
    const dropdown = autoSelect.find({ ref: 'dropdown' })
    expect(autoSelect.exists()).to.true
    reference.trigger('click')
    await promissedTick(autoSelect.vm)
    expect(dropdown.isVisible()).to.true
    expect(dropdown.vm.placement).to.equal('top')
  })

  it('maxDropWidth=240', async () => {
    const autoSelect = selectWrap.find({ ref: 'maxDropWidth' })
    const reference = autoSelect.find({ ref: 'reference' })
    const dropdown = autoSelect.find({ ref: 'dropdown' })
    expect(autoSelect.exists()).to.true
    reference.trigger('click')
    await promissedTick(autoSelect.vm)
    expect(dropdown.isVisible()).to.true
    // 等待 popper update 宽度计算
    await sleep(300)
    const style = window.getComputedStyle(dropdown.vm.$el)
    const maxWidth = get(style, 'max-width')
    expect(maxWidth).to.equal(240 + 'px')
  })

  it('dropWidth=600', async () => {
    const autoSelect = selectWrap.find({ ref: 'dropWidth' })
    const reference = autoSelect.find({ ref: 'reference' })
    const dropdown = autoSelect.find({ ref: 'dropdown' })
    expect(autoSelect.exists()).to.true
    reference.trigger('click')
    await promissedTick(autoSelect.vm)
    expect(dropdown.isVisible()).to.true
    // 等待 popper update 宽度计算
    await sleep(300)
    const style = window.getComputedStyle(dropdown.vm.$el)
    const width = get(style, 'min-width')
    expect(width).to.equal(600 + 'px')
  })

  it('dropWidth=600 && maxDropWidth=240', async () => {
    const autoSelect = selectWrap.find({ ref: 'dropWidthAndMax' })
    const reference = autoSelect.find({ ref: 'reference' })
    const dropdown = autoSelect.find({ ref: 'dropdown' })
    expect(autoSelect.exists()).to.true
    reference.trigger('click')
    await promissedTick(autoSelect.vm)
    expect(dropdown.isVisible()).to.true
    // 等待 popper update 宽度计算
    await sleep(300)
    const style = window.getComputedStyle(dropdown.vm.$el)
    const width = get(style, 'max-width')
    expect(width).to.equal(240 + 'px')
  })

  it('transfer=true', async () => {
    const autoSelect = selectWrap.find({ ref: 'transfer' })
    const reference = autoSelect.find({ ref: 'reference' })
    const dropdown = autoSelect.find({ ref: 'dropdown' })
    expect(autoSelect.exists()).to.true
    reference.trigger('click')
    await promissedTick(autoSelect.vm)
    expect(dropdown.isVisible()).to.true
    expect(autoSelect.vm.$el.contains(dropdown.vm.$el)).to.false
    expect(document.body.contains(dropdown.vm.$el)).to.true
    const $dropdown = dropdown.vm.$el
    expect($dropdown.dataset.transfer).to.equal('true')
    expect(dropdown.classes()).to.contain('u-select-dropdown-transfer')
  })
})
