import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.DATA_API,
});

const auth_api = axios.create({
    baseURL: process.env.AUTH_API,
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

export default {instance, auth_api};
