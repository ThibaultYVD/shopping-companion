// src/stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    setToken(token) {
      this.token = token;
      localStorage.setItem('token', token);
      this.syncTokenAcrossTabs(token);
    },
    clearToken() {
      this.token = null;
      localStorage.removeItem('token');
      this.syncTokenAcrossTabs(null);
    },
    syncTokenAcrossTabs(token) {
      window.localStorage.setItem('sync-token', JSON.stringify({ token, time: Date.now() }));
    },
    validateToken() {
      if (this.token) {
        const decoded = jwt_decode(this.token);
        if (decoded.exp * 10000 < Date.now()) {
          this.clearToken();
        }
      }
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});

window.addEventListener('storage', (event) => {
  if (event.key === 'sync-token') {
    const { token } = JSON.parse(event.newValue);
    const authStore = useAuthStore();
    if (token) {
      authStore.setToken(token);
    } else {
      authStore.clearToken();
    }
  }
});