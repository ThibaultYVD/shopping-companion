<!-- src/views/Login.vue -->
<template>
  <div class="background" id="wrapper">
    <div class="login-container">
      <div class="title-container">
        <h2>Connexion</h2>
      </div>
      <form @submit.prevent="login">
        <input v-model="email" type="email" placeholder="Email">
        <input v-model="password" type="password" placeholder="Mot de passe">
        <button type="submit">S'identifier</button>
        <a href="#">Mot de passe oublié ?</a>
        <div class="register-container">
          <p>Pas encore inscrit ? <router-link to="/register">S'inscrire</router-link></p>
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
}

.login-container {
  background-color: #F5F0F6;
  border-radius: 30px;
  box-shadow: rgba(0, 0, 0, 0.50) 0px 0px 37px 0px;
  text-align: center;
}

.title-container {
  display: flex;
  justify-content: center;
}

.login-container h2 {
  margin-top: 20px;
  margin-bottom: 20px;
  color: #333;
  border-bottom: #2C7C45 solid 3px;
  font-size: 25px;
}

.login-container input {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: lightgrey;
  
}

.login-container input::placeholder {
 font-size: 15px;
  font-family: Inter;
}

.login-container input:focus {
  outline: none;
  border-bottom: 3px solid #2C7C45;
  background-color: #F5F0F6;

}

.login-container button {
  width: 50%;
  padding: 10px;
  background-color: #F5F0F6;
  border: solid 3px #2C7C45;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 18px;
  font-weight: 400;
  font-family: Arial, Helvetica, sans-serif;
}

.login-container button:hover {
  background-color: #2C7C45;
  color: #F5F0F6;
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
  border-radius: 0 0 30px 30px;
  margin-top: 20px;
}


.register-container p {
  font-size: 16px;
  font-weight: 200;
}



@media (max-width: 768px) {
  .login-container {
  background-color: #F5F0F6;
  border-radius: 30px;
  text-align: center;

  width: 85%;
}

.login-container button {
  width: 50%;
  padding: 10px;
  background-color: #F5F0F6;
  border: solid 3px #2C7C45;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 400;
  font-family: Arial, Helvetica, sans-serif;
}
}
</style>
