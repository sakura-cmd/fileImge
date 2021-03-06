import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/index.vue'
import fileImage from '../views/file/upload.vue'
import thouMoney from '../views/Money/thouMoney.vue'
import htmlodf from '../views/htmlPdf/htmlPdf.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    redirect: '/index'
  },
  {
    path: "/index",
    name: Index,
    component: Index,
  },
  {
    path: "/fileUpload",
    name: fileImage,
    component: fileImage,
  },
  {
    path: "/thouMoney",
    name: thouMoney,
    component: thouMoney,
  },
  {
    path: "/htmlodf",
    name: htmlodf,
    component: htmlodf,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router