<!-- src/views/Login.vue -->
<template>
  <div class="background" id="wrapper">
    <div class="login-container">
      <h2>Se connecter</h2>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email">
        <input v-model="password" type="password" placeholder="Mot de passe">
        <button type="submit">Se connecter</button>
        <a href="#">Mot de passe oublié ?</a>
        <div class="register-container">
          <p>Pas encore inscrit ? <a href="#">S'inscrire</a></p>
        </div>
      </form>
    </div>
  </div>

</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { instance as axios } from '../axios';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();
    const authStore = useAuthStore();

    const login = async () => {
      try {
        const response = await axios.post('/auth/signin', {
          email: email.value,
          password: password.value
        });

        const token = response.data.token;
        authStore.setToken(token);

        console.log(authStore)

        // Rediriger vers la page Dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error(error);
        if (error.response.status === 404) {
          alert('Utilisateur inconnu');
        } else if (error.response.status === 403) {
          alert('Mot de passe invalide');
        } else {
          alert('Erreur inconnue');
        }
      }
    };

    return { email, password, login };
  }
};
</script>

<style scoped>
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #2C7C45;
  font-family: Arial, sans-serif;
}

.login-container {
  background-color: #f5f5f5;
  padding: 20px 40px;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.login-container h2 {
  margin-bottom: 20px;
  color: #333;
}

.login-container input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-container button {
  width: 100%;
  padding: 10px;
  background-color: #2C7C45;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.login-container button:hover {
  background-color: #27663a;
}

.login-container a {
  color: #2C7C45;
  text-decoration: none;
  display: block;
  margin-top: 10px;
}

.login-container a:hover {
  text-decoration: underline;
}

.register-container {
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 0 0 15px 15px;
  margin-top: 20px;
}
</style>
