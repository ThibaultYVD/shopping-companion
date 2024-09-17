<template>
    <div class="compte">
        <h1>Mon Compte</h1>

        <div v-if="loading">
            <p>Chargement des informations utilisateur...</p>
        </div>

        <div v-if="!loading && user">
            <section>
                <h2>Informations personnelles</h2>
                <p><strong>Nom :</strong> {{ user.first_name }} {{ user.last_name }}</p>
                <p><strong>Email :</strong> {{ user.email }}</p>
                <p><strong>Date de création :</strong> {{ formatDate(user.created_at) }}</p>
            </section>
        </div>

        <div v-if="error">
            <p>Erreur lors du chargement des données : {{ error }}</p>
        </div>
    </div>
</template>

<script>
import { instance as axios } from "../services/axios";

export default {
    name: "Compte",
    data() {
        return {
            token: localStorage.getItem('token'),  // Correction: Utilisation correcte de "token"
            user: null,
            loading: true,
            error: null
        };
    },
    methods: {
        async fetchUserData() {
            try {
                const response = await axios.get('/user/users/');
                this.user = response.data[0];
            } catch (err) {
                this.error = 'Impossible de charger les informations utilisateur.';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        formatDate(date) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            return new Date(date).toLocaleDateString('fr-FR', options);
        }
    },
    mounted() {
        this.fetchUserData();
    }
};
</script>

<style scoped>
.compte {
    padding: 20px;
    line-height: 1.6;
}

h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
}

h2 {
    font-size: 1.5rem;
    margin-top: 1.5rem;
}

p {
    margin-bottom: 0.5rem;
}
</style>