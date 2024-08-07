<!-- src/components/Navbar.vue -->
<template>
  <nav class="navbar">
    <button class="burger" @click="toggleMenu">
      ☰
    </button>
    <ul :class="{ open: menuOpen }">
      <li><router-link to="/">Accueil</router-link></li>
      <li v-if="!isAuthenticated"><router-link to="/login">Se connecter</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/dashboard">Dashboard</router-link></li>
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2C7C45;
  padding: 1rem;
  box-shadow: inset rgba(0, 0, 0, 0.48) 0px 30px 50px -30px;
}

.burger {
  display: none;
  font-size: 1.5rem;
  background: none;
  border: none;
  color: #F5F0F6;
  cursor: pointer;
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 1rem;
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
    gap: 5px;
    position: absolute;
    top: 60px;
    left: 0;
    width: 20%;
    background-color: #F5F0F6;
    padding: 1rem;
    color:black;
  }

  .navbar ul.open {
    display: flex;
  }

  .navbar a {
  color: black;
  text-decoration: none;
}


  .navbar li {
    margin: 0.5rem 0;
  }
}
</style>
