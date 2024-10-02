<template>
  <nav class="navbar">
    <div class="nav-links" v-if="!isMobile">
      <ul>
        <li v-if="!isAuthenticated"><router-link to="/login">Se connecter</router-link></li>
        <li v-if="!isAuthenticated"><router-link to="/register">S'inscrire</router-link></li>
        <li v-if="isAuthenticated"><router-link to="/home"><i class="fa-solid fa-house"></i></router-link></li>
      </ul>
      <ul>
        <li v-if="isAuthenticated"><router-link to="/account"><i class="fa-solid fa-user"></i></router-link></li>
        <li v-if="isAuthenticated"><a href="#" @click.prevent="logout"><i
              class="fa-solid fa-right-from-bracket"></i></a></li>
      </ul>
    </div>

    <div class="burger-menu" v-if="isMobile" ref="burgerMenu">
      <button class="burger" @click="toggleBurger" aria-expanded="menuOpen" aria-label="Ouvrir le menu">
        ☰
      </button>
      <div class="dropdown-menu" v-if="menuOpen">
        <ul>
          <li v-if="!isAuthenticated"><router-link to="/login">Se connecter</router-link></li>
          <li v-if="!isAuthenticated"><router-link to="/register">S'inscrire</router-link></li>
          <li v-if="isAuthenticated"><router-link to="/home"><i class="fa-solid fa-house"></i> Tableau de
              bord</router-link></li>
          <li v-if="isAuthenticated"><router-link to="/account"><i class="fa-solid fa-user"></i> Mon compte</router-link></li>
          <li v-if="isAuthenticated"><a href="#" @click.prevent="logout"><i class="fa-solid fa-right-from-bracket"></i>
              Se déconnecter</a></li>
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