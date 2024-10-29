import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'

Vue.use(VueRouter)

const router = new VueRouter({
  routes
})

// 重置路由
export const resetRouter = () => {
  router.matcher = new VueRouter({
    routes
  })
}
export default router
