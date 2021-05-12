// 小角标
const dot = 'dot'

function directiveConfig (binding, defaults = {}) {
  return Object.assign(
    defaults,
    binding.modifiers,
    {
      value: binding.arg,
    },
    binding.value || {},
  )
}

function directive (el, binding) {
  const config = directiveConfig(binding, {
    icon: false,
    left: false,
    inner: false,
  })
  if (config.inner) el.classList.add('badge-inner')
  if (config.icon) el.classList.add('badge-icon')
  if (config.left) el.classList.add('badge-left')
  if (config.value == 'dot') el.classList.add('badge-dot')

  if (config.value == 'dot') {
    el.dataset.badge = ''
  } else if (config.value >= 100) {
    el.dataset.badge = '99+'
  } else {
    el.dataset.badge = config.value
  }
  el.classList.add('badge')
}

export default {
  bind: directive,
  inserted: directive,
  updated: directive,
  componentUpdated: directive,
  unbind: el => {
    el.removeAttribute('data-badge')
    el.classList.remove('badge')
  },
}
// import Vue from 'vue';
// Vue.directive('drag',function(){
//   var oDiv=this.el;
//   oDiv.onmousedown=function(ev){
//       var disX=ev.clientX-oDiv.offsetLeft;
//       var disY=ev.clientY-oDiv.offsetTop;

//       document.onmousemove=function(ev){
//           var l=ev.clientX-disX;
//           var t=ev.clientY-disY;
//           oDiv.style.left=l+'px';
//           oDiv.style.top=t+'px';
//       };
//       document.onmouseup=function(){
//           document.onmousemove=null;
//           document.onmouseup=null;
//       };
//   };
// });
