import Vue from 'vue'
import VueRouter from 'vue-router'
import fileImage from '../views/pc/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: "/index", 
    name: fileImage,
    component: fileImage,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
