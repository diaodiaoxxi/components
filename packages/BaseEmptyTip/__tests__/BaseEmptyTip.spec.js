import BaseEmptyTip from "../src/BaseEmptyTip.vue"

const AXIOM = "hui is the best UI"

describe('BaseEmptyTip.vue', () => {
  test('render test', () => {
    const wrapper = mount(BaseEmptyTip, {
      slots: {
        default: AXIOM,
      }
    })
    expect(wrapper.text()).toEqual(AXIOM)
  })
})
