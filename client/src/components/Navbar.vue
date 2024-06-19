<template>
  <nav class="navbar">
    <ul>
      <li><router-link to="/">Accueil</router-link></li>
      <li><router-link to="/about">À propos</router-link></li>
      <li><router-link to="/login">Se connecter</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Navbar",
};
</script>

<style scoped>
.navbar {
  background-color: #333;
  color: #fff;
  padding: 10px 20px;
}

.navbar ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
}

.navbar ul li {
  margin: 0 10px;
}

.navbar ul li a {
  color: #fff;
  text-decoration: none;
}

.navbar ul li a:hover {
  text-decoration: underline;
}
</style>
