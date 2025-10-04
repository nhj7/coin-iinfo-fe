import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import P0Home from './pages/p0-Home.vue' // P0Home 페이지 컴포넌트
import P9Contact from './pages/p9-Contact.vue' // P9Contact 페이지 컴포넌트

const routes = [
  { path: '/', name: 'Home', component: P0Home, props: { msg: 'Vite + Vue' } },
  { path: '/contact', name: 'Contact', component: P9Contact },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const pinia = createPinia()

const app = createApp(App)
app.config.globalProperties.$appName = 'coinfo'
app.use(pinia).use(router).mount('#app')
