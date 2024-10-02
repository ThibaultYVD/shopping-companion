<!-- src/views/register.vue -->
<template>
  <div class="background" id="wrapper">
    <div class="register-container">
      <div class="title-container">
        <h2>Inscription</h2>
      </div>
      <form @submit.prevent="register">
        <input v-model="first_name" type="text" placeholder="Nom" />
        <input v-model="last_name" type="text" placeholder="Prénom" />
        <input v-model="email" type="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Mot de passe" />
        <input v-model="verify_password" type="password" placeholder="Confirmer le mot de passe" />
        <button type="submit">S'inscrire</button>

        <div class="login-container">
          <p>Déjà inscrit ? <router-link to="/login">Se connecter</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { auth_api as axios } from '../services/axios';

export default {
  setup() {
    const first_name = ref('');
    const last_name = ref('');
    const email = ref('');
    const password = ref('');
    const verify_password = ref('');
    const router = useRouter();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const register = async () => {
      if (password.value !== verify_password.value) {
        alert('Les mots de passe ne correspondent pas.');
        return;
      }

      if (!emailRegex.test(email.value)) {
        alert('Adresse email invalide.');
        return;
      }

      try {
        await axios.post('/api/auth/signup', {
          first_name: first_name.value,
          last_name: last_name.value,
          email: email.value,
          password: password.value
        });
        alert('Votre compte a été créé, veuillez vous connecter.');
        router.push('/login');
      } catch (error) {
        console.error(error);
        if (error.response && error.response.status) {
          if (error.response.status === 404) {
            alert('Utilisateur inconnu');
          } else if (error.response.status === 403) {
            alert('Mot de passe invalide');
          } else {
            alert('Erreur inconnue');
          }
        } else {
          alert('Erreur lors de la connexion au serveur');
        }
      }
    };

    return { first_name, last_name, email, password, verify_password, register };
  }
};
</script>

<style scoped>
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-height: 100svh;
  margin: 0;
  background-color: #2C7C45;
}

.register-container {
  background-color: #F5F0F6;
  border-radius: 30px;
  box-shadow: rgba(0, 0, 0, 0.50) 0px 0px 37px 0px;
  text-align: center;
  width: 30%;
}

.title-container {
  display: flex;
  justify-content: center;
}

.register-container h2 {
  margin-top: 20px;
  margin-bottom: 20px;
  color: #333;
  border-bottom: #2C7C45 solid 3px;
  font-size: 25px;
}

.register-container input {
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: lightgrey;
  font-family: Inter;

}

.register-container input::placeholder {
  font-size: 15px;
  font-family: Inter;
}

.register-container input:focus {
  outline: none;
  border-bottom: 3px solid #2C7C45;
  background-color: #F5F0F6;

}

.register-container button {
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

.register-container button:hover {
  background-color: #2C7C45;
  color: #F5F0F6;
}

.register-container a {
  color: #2C7C45;
  text-decoration: none;
  display: block;
  margin-top: 10px;
}

.register-container a:hover {
  text-decoration: underline;
}

.login-container {
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 0 0 30px 30px;
  margin-top: 20px;
}


.login-container p {
  font-size: 16px;
  font-weight: 200;
}

@media (max-width: 1824px) {

}


@media (max-width: 1400px) {
  .register-container {
    width: 40%;
  }

}

@media (max-width: 1080px) {
  .register-container {
    width: 60%;
  }
}

@media (max-width: 768px) {
  .register-container {
    background-color: #F5F0F6;
    border-radius: 30px;
    text-align: center;

    width: 85%;
  }

 

  .register-container button {
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
