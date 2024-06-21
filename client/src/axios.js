import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:20241/',
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

export default instance;
