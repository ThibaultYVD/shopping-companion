<!-- src/components/Navbar.vue -->
<template>
  <nav class="navbar">
    <ul>
      <li><router-link to="/">Accueil</router-link></li>
      <li v-if="!isAuthenticated"><router-link to="/login">Se connecter</router-link></li>
      <li v-if="isAuthenticated"><router-link to="/dashboard">Dashboard</router-link></li>
      <li v-if="isAuthenticated"><a href="#" @click="logout">Se déconnecter</a></li>
    </ul>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    const logout = () => {
      authStore.clearToken();
      router.push('/');
    };

    const isAuthenticated = computed(() => authStore.isAuthenticated);

    return {
      isAuthenticated,
      logout,
    };
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  background-color: #333;
  padding: 1rem;
}

.navbar ul {
  list-style: none;
  display: flex;
  gap: 1rem;
}

.navbar a {
  color: white;
  text-decoration: none;
}

.navbar a:hover {
  text-decoration: underline;
}
</style>
