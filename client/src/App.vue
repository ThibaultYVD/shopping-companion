<template>
  <div id="app">
    <Navbar />
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
@font-face {
    font-family: Inter;
    src: url('~@/assets/fonts/Inter_19pt-Black.ttf');
}
</style>
