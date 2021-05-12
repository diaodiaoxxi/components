import { expect } from 'chai'
import Select from '@packages/Select'
import { createTest, triggerEvent } from '../util'
global.requestAnimationFrame = cb => cb()
describe('Select 组件基础属性', () => {
  let vm
  it('基础创建', () => {
    vm = createTest(Select, true)
    const placeholder = vm.$el.querySelector('.u-select-head').textContent
    expect(vm.$el.className).to.include('u-select')
    expect(placeholder).to.include('请选择')
    vm.toggleMenu(true)
    expect(vm.visible).to.true
    vm.toggleMenu(false)
    expect(vm.visible).to.false
  })

  it('disabled-属性', () => {
    vm = createTest(Select, { disabled: true }, true)
    const head = vm.$el.querySelector('.u-select-head')
    expect(vm.$el.className).to.include('u-select')
    expect(vm.$el.className).to.include('u-select-disabled')
    triggerEvent(head, 'click')
    expect(vm.visible).to.false
  })

  it('readonly-属性', () => {
    vm = createTest(Select, { readonly: true }, true)
    const head = vm.$el.querySelector('.u-select-head')
    expect(vm.$el.className).to.include('u-select')
    expect(vm.$el.className).to.include('u-select-readonly')
    triggerEvent(head, 'click')
    expect(vm.visible).to.false
  })

  it('size-属性', () => {
    const size = ['default', 'small', 'large']
    size.forEach(s => {
      vm = createTest(Select, { size: s }, true)
      expect(vm.$el.className).to.include(`u-select-${s}`)
    })
  })

  it('align-属性', () => {
    const align = ['left', 'right', 'center']
    align.forEach(s => {
      vm = createTest(Select, { align: s }, true)
      expect(vm.$el.className).to.include(`u-select-${s}`)
    })
  })

  it('isArrow-属性', () => {
    vm = createTest(Select, { isArrow: false }, false)
    const head = vm.$el.querySelector('.u-select-head')
    const icon = head.querySelector('i[name="arrow"]')
    expect(icon).to.not.exist
  })

  it('placeholder-属性', () => {
    vm = createTest(Select, { placeholder: 'test' }, true)
    const placeholder = vm.$el.querySelector('.u-select-head').textContent
    expect(vm.$el.className).to.include('u-select')
    expect(placeholder).to.include('test')
  })
})
