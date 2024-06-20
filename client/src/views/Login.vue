<template>
  <div class="login">
    <h1>Connexion</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">Se connecter</button>
      <p v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapMutations } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: null
    };
  },
  methods: {
    ...mapMutations(['setToken']),
    async handleSubmit() {
      try {
        const response = await axios.post('http://localhost:20241/auth/signin', {
          email: this.email,
          password: this.password
        });

        const token = response.data.token;
        this.setToken(token);

        // Réinitialiser le formulaire après soumission
        this.email = '';
        this.password = '';
        this.error = null;

        // Rediriger l'utilisateur
        this.$router.push('/');
      } catch (error) {
        this.error = 'Échec de la connexion. Veuillez vérifier vos identifiants.';
        console.error('Erreur:', error);
      }
    }
  }
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  background-color: #333;
  color: #fff;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #555;
}

p {
  color: red;
  margin-top: 10px;
}
</style>
