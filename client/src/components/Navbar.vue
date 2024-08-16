<!-- src/components/Navbar.vue -->
<template>
  <nav class="navbar">
    <button class="burger" @click="toggleMenu">
      ☰
    </button>
    <ul :class="{ open: menuOpen }">
      <li v-if="!isAuthenticated"><router-link to="/">Accueil</router-link></li>
      <li v-if="!isAuthenticated"><router-link to="/login">Se connecter</router-link></li>
      <li v-if="!isAuthenticated"><router-link to="/register">S'inscrire</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/dashboard">Tableau de bord</router-link></li>
      <li v-if="isAuthenticated"><a href="#" @click="logout">Se déconnecter</a></li>
    </ul>
  </nav>
</template>

<script>
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const menuOpen = ref(false);

    const logout = () => {
      authStore.clearToken();
      router.push('/');
    };

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value;
    };

    const isAuthenticated = computed(() => authStore.isAuthenticated);

    return {
      isAuthenticated,
      logout,
      menuOpen,
      toggleMenu,
    };
  },
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2C7C45;
  padding: 1rem;
  box-shadow: inset rgba(0, 0, 0, 0.48) 0px 30px 50px -30px;
  z-index: 1000;
}

.burger {
  display: none;
  font-size: 1.8rem;
  background: none;
  border: none;
  color: #F5F0F6;
  cursor: pointer;
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 2rem;
}

.navbar a {
  color: #F5F0F6;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500
}

.navbar a:hover {
  text-decoration: underline;
}

/* Styles pour petits écrans */
@media (max-width: 768px) {
  .burger {
    display: block;
  }

  .navbar ul {
    display: none;
    flex-direction: column;
    gap: 0;
    position: absolute;
    top: 60px;
    left: 0px;
    width: 40%;
    background-color: #F5F0F6;
    padding: 1rem;
    color: black;
    border-radius: 0 20px 20px 0px;
    z-index: 1;
    transition: left 0.5s ease;
    box-shadow: rgba(0, 0, 0, 0.50) 0px 0px 37px 0px;
  }

  .navbar ul.open {
    display: flex;
  }

  .navbar a {
    display:block;
    color: black;
    text-decoration: none;
    width: 100%;
    margin-left: 4px;

  }


  .navbar li {
    margin: 0.4rem 0;
    border-left: #2C7C45 3px solid;
  }
}
</style>
