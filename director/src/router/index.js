import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Machine from '../views/Machine.vue'
import Sequence from '../views/Sequence.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/machine/:id',
    name: 'machine',
    component: Machine
  },
  {
    path: '/machine/:id/:seq',
    name: 'sequence',
    component: Sequence
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
