<!-- src/views/Dashboard.vue -->
<template>
    <div class="background">
        <div class="lists">
            <h1>Mes listes</h1>
            <div v-if="lists.length > 0" class="lists-container">
                <div v-for="list in displayedLists" :key="list.list_id" class="list-card">
                    <h3>{{ list.list_name }}</h3>
                    <p>Nombre d'éléments: {{ list.item_count }}</p>
                    <button @click="goToListPage(list.list_id)" class="list-button">Voir la liste</button>
                </div>
            </div>
            <div v-else>
                <p>Chargement des données ...</p>
            </div>
        </div>
    </div>
</template>

<script>
import { instance as axios } from '../services/axios';
import { useRouter } from 'vue-router';

export default {
    name: 'Dashboard',
    data() {
        return {
            groups: [],
            displayedGroups: [],
            lists: [], // Liste des listes
            displayedLists: [] // Listes affichées
        };
    },
    mounted() {
        this.getGroups();
        this.getLists(); // Ajout pour récupérer les listes
    },
    methods: {
        async getLists() {
            try {
                // Remplacez cette URL par l'URL correcte pour récupérer les listes
                const response = await axios.get('/user/lists');
                this.lists = response.data.map(list => ({
                    ...list,
                    item_count: Math.floor(Math.random() * 20) // Nombre d'éléments
                }));
                this.displayedLists = this.lists.slice(0, 9);
            } catch (error) {
                console.error('Error fetching lists:', error);
            }
        },
        goToListPage(listId) {
            const router = useRouter();
            router.push(`/list/${listId}`);
        }
    }
};
</script>

<style scoped>
.background {
    height: 100vh;
    margin: 0;
    background-color: white;
}

.dashboard {
    display: flex;
    padding-top: 50px;
    /* Espacement entre les colonnes */
}

.groups h1 {
    margin-top: 20px;
    padding-left: 8rem;
}

.lists h1 {
    margin-top: 20px;
    padding-left: 3rem;
}

.groups,
.lists {
    width: 50%;
}

.groups-container,
.lists-container {
    width: 100%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.group-card,
.list-card {
    background: white;
    padding: 1rem;
    margin: 1rem;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.30) 0px 0px 10px 0px;
    border: solid 2px #2C7C45;

}

.group-card h3,
.list-card h3 {
    margin: 0 0 0.5rem 0;
    font-weight: bold;
}

.group-card p,
.list-card p {
    margin: 0.2rem 0;
}

.group-button,
.list-button {
    width: 100%;
    padding: 5px;
    background-color: white;
    border: solid 2px #2C7C45;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 10px;
    font-size: 15px;
    font-weight: 400;
}

.group-button:hover,
.list-button:hover {
    background: #2C7C45;
    color: white;
}
</style>