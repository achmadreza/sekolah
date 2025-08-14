<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'; // pastikan hurufnya sama persis
export default {
  name: 'App',
  components: {
    Navbar
  }
};
</script>
