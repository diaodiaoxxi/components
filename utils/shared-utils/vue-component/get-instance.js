// Find components upward
export function findComponentUpward (context, componentName) {
  let componentNames = []
  if (typeof componentName === 'string') {
    componentNames = [componentName]
  }
  if (Array.isArray(componentName)) {
    componentNames = componentName
  }

  let parent = context.$parent
  let name = parent.$options.name
  while (parent && (!name || componentNames.indexOf(name) < 0)) {
    parent = parent.$parent
    if (parent) name = parent.$options.name
  }
  return parent
}

export const findComponentParent = findComponentUpward

// Find component downward
export function findComponentDownward (context, componentName) {
  const childrens = context.$children
  let children = null

  if (childrens.length) {
    for (const child of childrens) {
      const name = child.$options.name
      if (name === componentName) {
        children = child
        break
      } else {
        children = findComponentDownward(child, componentName)
        if (children) break
      }
    }
  }
  return children
}

// 查找子组件
export const findComponentChildren = findComponentDownward

// Find components downward
export function findComponentsDownward (context, componentName) {
  let componentNames = []
  if (typeof componentName === 'string') {
    componentNames = [componentName]
  }
  if (Array.isArray(componentName)) {
    componentNames = componentName
  }
  return context.$children.reduce((components, child) => {
    if (componentNames.includes(child.$options.name)) components.push(child)
    const foundChilds = findComponentsDownward(child, componentName)
    return components.concat(foundChilds)
  }, [])
}

// 查找所有子组件
export const findComponentsChildren = findComponentsDownward

// Find components upward
export function findComponentsUpward (context, componentName) {
  const parents = []
  const parent = context.$parent
  if (parent) {
    if (parent.$options.name === componentName) parents.push(parent)
    return parents.concat(findComponentsUpward(parent, componentName))
  } else {
    return []
  }
}

// Find brothers components
export function findBrothersComponents (context, componentName, exceptMe = true) {
  const res = context.$parent.$children.filter(item => {
    return item.$options.name === componentName
  })
  const index = res.findIndex(item => item._uid === context._uid)
  if (exceptMe) res.splice(index, 1)
  return res
}
