<template>
  <nav class="bg-blue-600 text-white p-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-lg font-bold">Sistem Pembayaran</h1>
      <ul class="flex gap-4">
        <li>
          <router-link to="/home" class="hover:underline">Home</router-link>
        </li>
        <li>
          <router-link to="/pembayaran" class="hover:underline">Pembayaran</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>
