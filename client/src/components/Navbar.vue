<template>
  <nav class="navbar" aria-label="Barre de navigation principale">
    <div class="nav-links" v-if="!isMobile">
      <ul>
        <li v-if="!isAuthenticated" tabindex="0"><router-link to="/login" aria-label="Se connecter">Se connecter</router-link></li>
        <li v-if="!isAuthenticated" tabindex="0"><router-link to="/register" aria-label="S'inscrire">S'inscrire</router-link></li>
        <li v-if="isAuthenticated" tabindex="0"><router-link to="/home" aria-label="Accueil"><i class="fa-solid fa-house" aria-hidden="true"></i></router-link></li>
      </ul>
      <ul>
        <li v-if="isAuthenticated" tabindex="0"><router-link to="/account" aria-label="Mon compte"><i class="fa-solid fa-user" aria-hidden="true"></i></router-link></li>
        <li v-if="isAuthenticated" tabindex="0"><a href="#" @click.prevent="logout" aria-label="Se déconnecter"><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i></a></li>
      </ul>
    </div>

    <div class="burger-menu" v-if="isMobile" ref="burgerMenu" aria-label="Menu mobile">
      <button class="burger" @click="toggleBurger" :aria-expanded="menuOpen" aria-label="Ouvrir le menu" tabindex="0">
        ☰
      </button>
      <div class="dropdown-menu" v-if="menuOpen" aria-label="Menu déroulant" tabindex="0">
        <ul>
          <li v-if="!isAuthenticated" tabindex="0"><router-link to="/login" aria-label="Se connecter">Se connecter</router-link></li>
          <li v-if="!isAuthenticated" tabindex="0"><router-link to="/register" aria-label="S'inscrire">S'inscrire</router-link></li>
          <li v-if="isAuthenticated" tabindex="0"><router-link to="/home" aria-label="Tableau de bord"><i class="fa-solid fa-house" aria-hidden="true"></i> Tableau de bord</router-link></li>
          <li v-if="isAuthenticated" tabindex="0"><router-link to="/account" aria-label="Mon compte"><i class="fa-solid fa-user" aria-hidden="true"></i> Mon compte</router-link></li>
          <li v-if="isAuthenticated" tabindex="0"><a href="#" @click.prevent="logout" aria-label="Se déconnecter"><i class="fa-solid fa-right-from-bracket" aria-hidden="true"></i> Se déconnecter</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>


<script>
import { mapState } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      menuOpen: false,
      isMobile: window.innerWidth <= 768,
    };
  },
  computed: {
    ...mapState(useAuthStore, ['isAuthenticated']),
  },
  methods: {
    toggleBurger() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    logout() {
      const authStore = useAuthStore();
      authStore.clearToken();
      const router = useRouter();
      window.location.href = "https://shopping-companion.site/login";
    },
    handleResize() {
      this.isMobile = window.innerWidth <= 768;
    },
    handleClickOutside(event) {
      const burgerMenu = this.$refs.burgerMenu;

      if (burgerMenu && !burgerMenu.contains(event.target)) {
        this.closeMenu();
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>

<style scoped>
.navbar {
  background-color: #2C7C45;
  padding: 10px;
  box-shadow: inset rgba(0, 0, 0, 0.48) 0px 30px 50px -30px;
  z-index: 1000;
}

i {
  font-size: 25px;
}

.nav-links {
  padding-left: 10px;
  padding-right: 50px;
  display: flex;
  justify-content: space-between;
}

.nav-links ul,
.burger-menu .dropdown-menu ul {
  list-style: none;
  display: flex;
  gap: 2rem;
}

.nav-links ul li a,
.burger-menu .dropdown-menu ul li a {
  color: #F5F0F6;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
}

.nav-links ul li a:hover,
.burger-menu .dropdown-menu ul li a:hover {
  text-decoration: underline;
}

.burger {
  font-size: 1.8rem;
  background: none;
  border: none;
  color: #F5F0F6;
  cursor: pointer;
}

.burger-menu .dropdown-menu {
  background-color: #2C7C45;
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.48) 0px 30px 50px -30px;
  z-index: 1000;
}

.burger-menu .dropdown-menu ul {
  flex-direction: column;
  gap: 1rem;
}

.burger-menu .dropdown-menu ul li {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
}

@media (min-width: 769px) {
  .burger-menu {
    display: none;
  }
}
</style>