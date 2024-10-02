import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';


const instance = axios.create({
  baseURL: "localhost:20241",
  timeout: 60000
});

const auth_api = axios.create({
  baseURL: "localhost:20242",
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.clearToken();
      router.push('/login');
      alert('Session expirée, veuillez vous reconnecter.');
    }

    else return Promise.reject(error);
  }
);

export { instance, auth_api };