<template>
  <Navbar />
  <div class= "app" id="app">
    <router-view></router-view>
  </div>
</template>


<script>
import Navbar from './components/Navbar.vue';

export default {
  components: {
    Navbar,
  },
};
</script>

<style>
.app {
  padding-top: 0px; /* Ajustez cette valeur en fonction de la hauteur de votre navbar */
}
</style>
