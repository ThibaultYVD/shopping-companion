<!-- src/views/Login.vue -->
<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="email" placeholder="Email">
      <input v-model="password" type="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const authStore = useAuthStore();

    const login = async () => {
      try {
        const response = await axios.post('http://localhost:20242/api/auth/signin', {
          email: email.value,
          password: password.value
        });

        const token = response.data.token;
        authStore.setToken(token);

        // Rediriger vers la page Dashboard
        router.push('/dashboard');
      } catch (error) {
        alert('Invalid credentials');
      }
    };

    return { email, password, login };
  }
};
</script>