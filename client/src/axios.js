import axios from 'axios';
/*
const instance = axios.create({
  baseURL: import.meta.env.VUE_APP_DATA_API,
});
*/

const instance = axios.create({
    baseURL: "https://vscode.thibault-yvard.fr/proxy/20241",
  });

const auth_api = axios.create({
  baseURL: import.meta.env.VUE_APP_AUTH_API,
});

instance.interceptors.response.use(response => {
  return response;
}, error => {
  // Vider le stockage local puis redirection pour se reconnecter
  if (error.response && error.response.status === 401) {
    clearLocalStorage();
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

function clearLocalStorage() {
  localStorage.clear();
}

export { instance, auth_api };