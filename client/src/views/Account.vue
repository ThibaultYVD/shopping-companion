<template>
    <div class="background">
        <Spacing />
        <div class="main-container">
            <div class="group-container">
                <TitleSeparator title="Mon compte" :buttons="actionsButtons" />
            </div>
            <div class="compte">
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
        </div>
        <Spacing />
    </div>
</template>

<script>
import { instance as axios } from "../services/axios";
import Spacing from '@/components/Spacing.vue'
import TitleSeparator from '@/components/TitleSeparator.vue'
import { useAuthStore } from '../stores/auth';

export default {
    name: "Compte",
    data() {
        return {
            token: localStorage.getItem('token'), 
            user: null,
            loading: true,
            error: null,
            actionsButtons: [
                { label: "Supprimer mon compte", action: this.deleteAccount }
            ],
        };
    },
    components: {
        Spacing,
        TitleSeparator

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
        },
        async deleteAccount() {
            try {
                const isConfirmed = confirm("Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.");
                if (isConfirmed) {
                    await axios.delete(`/user/users/`);
                    const authStore = useAuthStore();
                    authStore.clearToken();
                    window.location.href = "http://localhost:5173/";
                }

            } catch (error) {
                console.error(error);
            }
        }
    },
    mounted() {
        this.fetchUserData();
    }
};
</script>

<style scoped>
.background {
    margin: 0;
    background-color: white;
    display: flex;
}

.main-container {
    width: 70%;
}

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
}

p {
    margin-bottom: 0.5rem;
}


@media (max-width:1444px) {
    .main-container {
        width: 80%;
    }
}

@media (max-width:1244px) {
    .main-container {
        width: 90%;
    }
}

@media (max-width: 768px) {
    .main-container {
        width: 100%;
    }
}
</style>