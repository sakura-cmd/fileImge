import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import '../config/index'
import axios from 'axios'
// 导入global.js
import global from './util/gobal'
// 使用全局组件
Vue.use(global)
// 绑定原型
Vue.prototype.$https = axios

Vue.use(ElementUI)
// 引入样式
import './assets/bobalStyle.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')