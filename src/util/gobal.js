// 引入组件
import filePdf from '../component/filePdf.vue'
import showImg from '../component/showImg.vue'
export default (Vue) => {
    // 注册组件
    // 使用Vue.component()注册组件时，全局id自动作为组件的名称
    // 也就是说，此时第一参数为组件的名称
    Vue.component('file-pdf', filePdf)
    Vue.component('show-img',showImg)
  }
