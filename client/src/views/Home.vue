<template>
  <div class="content">
    <h1>Home</h1>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();

    // Redirection selon l'état d'authentification
    onMounted(() => {
      if (!authStore.isAuthenticated) {
        router.push('/login'); // Redirige vers la page de login si non connecté
      } else {
        router.push('/dashboard'); // Redirige vers le dashboard si authentifié
      }
    });

    return {
      isAuthenticated: authStore.isAuthenticated,
    };
  },
};
</script>

<style scoped>

</style>
