<template>
  <div class="home">
    <h1>Bienvenue sur le site</h1>
    <p>C'est la page d'accueil.</p>
    <!-- Ajoute ici le contenu spécifique à ta page d'accueil -->
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";

export default {
  name: "Home",
};
</script>

<style scoped>
.home {
  text-align: center;
  padding: 20px;
}
</style>
