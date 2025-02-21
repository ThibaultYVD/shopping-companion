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

    onMounted(() => {
      if (!authStore.isAuthenticated) {
        router.push('/login');
      } else {
        router.push('/home');
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
