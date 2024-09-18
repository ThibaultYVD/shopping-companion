<template>
    <div class="background">
        <Spacing />
        <div class="main-container">

        </div>
        <Spacing />
    </div>
</template>

<script>
import { instance as axios } from "../services/axios";
import Spacing from '@/components/Spacing.vue'
import TitleSeparator from '@/components/TitleSeparator.vue'

export default {
    name: "Course généré",
    data() {
        return {
            generated_list: [{}]
        };
    },
    components: {
        Spacing,
        TitleSeparator

    },
    methods: {
        async fetchData() {
            try {
                const response = await axios.get(`/dijkstra/${this.listId}`);
                this.generated_list = response.data;
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
    },
    mounted() {
        this.listId = this.$route.params.listId;
        this.fetchData();
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