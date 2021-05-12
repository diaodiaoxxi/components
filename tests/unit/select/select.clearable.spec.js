import { expect } from 'chai'
import { mount, createLocalVue } from '@vue/test-utils'
// import { promissedTick, sleep, get } from '../util'
import hui from '@/index'
import i18n from '@examples/locale'
import SelectDemo from '@examples/SelectDemos/src/dropdown.vue'
const localVue = createLocalVue()
localVue.use(hui, { i18n: (key, value) => i18n.t(key, value) })
global.requestAnimationFrame = cb => cb()
describe('Select 下拉弹窗相关属性', () => {
  const selectWrap = mount(SelectDemo, { localVue })

  it('demo创建成功', () => {
    expect(selectWrap.exists()).to.true
  })

  it('clearable-属性', async () => {
    const vm = selectWrap.vm
    const head = vm.$el.querySelector('.u-select-head')
    const icon = head.querySelector('i[name="clear"]')
    expect(icon).to.not.exist

    // vm = createTest(Select, { clearable: true, value: '123' }, true)
    // await promissedTick(vm)
    // head = vm.$el.querySelector('.u-select-head')
    // icon = head.querySelector('i[name="clear"]')
    // expect(vm.value).to.equal('123')
    // expect(icon).to.exist
    // triggerEvent(icon, 'click')
    // expect(vm.value).to.equal('')

    // vm = createTest(
    //   Select,
    //   { clearable: true, multiple: true, value: ['123', '456'] },
    //   true
    // )
    // await promissedTick(vm)
    // head = vm.$el.querySelector('.u-select-head')
    // icon = head.querySelector('i[name="clear"]')
    // expect(vm.value).to.eql(['123', '456'])
    // expect(icon).to.exist
    // triggerEvent(icon, 'click')
    // expect(vm.value).to.eql([])
  })
})
