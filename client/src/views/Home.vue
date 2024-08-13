<!-- src/views/Home.vue -->
<template>
  <div class="content">
    <h1>Home</h1>
    
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  setup() {
    const authStore = useAuthStore();

    return {
      isAuthenticated: authStore.isAuthenticated,
    };
  },
};
</script>

<style scoped>
.content{
  padding-top: 70px;
}

</style>
