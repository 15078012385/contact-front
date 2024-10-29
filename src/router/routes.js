import Layout from '@/layout'

export const routes = [
  {
    path: '/login', component: () => import('@/views/login/index'), hidden: true
  },
  {
    path: '/404', component: () => import('@/views/404'), hidden: true
  },
  {
    path: '/', component: Layout, redirect: '/dashboard', children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: 'dashboard', icon: 'dashboard'}
    }, {
      path: '/change_password', component: () => import('@/views/change_password'), hidden: true
    },]
  },
  // 前端路由表直接粘贴到这里！！
  {
    path: '/generator_page',
    component: Layout,
    redirect: '/tb_contact',
    children: [{
      path: '/tb_contact',
      name: '/tb_contact',
      component: () => import('@/views/tb_contact'),
      meta: { title: '通讯录管理', icon: 'el-icon-eleme' }
    }]
  },
  {path: '*', redirect: '/404', hidden: true}]
