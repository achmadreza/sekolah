import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import PembayaranForm from '../pages/PembayaranForm.vue';
import PembayaranResult from '../pages/PembayaranResult.vue';



const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: HomePage },
  { path: '/pembayaran', name: 'pembayaran', component: PembayaranForm },
  { path: '/resultpembayaran', name: 'resultpembayaran', component: PembayaranResult }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
