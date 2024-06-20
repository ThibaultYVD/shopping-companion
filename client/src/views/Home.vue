<template>
  <div class="home">
    <h1>Bienvenue sur notre site</h1>
    <p>C'est la page d'accueil.</p>
    <div v-if="isAuthenticated">
      <p>Contenu réservé aux utilisateurs connectés.</p>
    </div>
  </div>
</template>

<script>
import Navbar from './../components/Navbar.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  components: {
    Navbar
  },
  computed: {
    ...mapGetters(['isAuthenticated'])
  },
  mounted() {
    // Effectuer des actions si nécessaire lors du montage du composant
  }
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}
</style>
