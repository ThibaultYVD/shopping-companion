<template>
    <div class="background">
        <Spacing />
        <div class="main-container">
            <div class="center-container">
                <!-- Bouton initial pour commencer -->
                <div class="start" v-if="!stepStarted">
                    <button @click="startProcess" class="start-button">Je suis sur place.</button>
                </div>

                <!-- Afficher chaque rayon avec une liste de produits à cliquer, exclure les rayons avec "start" -->
                <div class="current-shelf-container" v-if="stepStarted" v-for="(item, index) in filteredShelves"
                    :key="index" v-show="currentStep === index && !isProcessFinished">
                    <!-- Rayon actuel -->
                    <div class="current-shelf" v-if="item.nextShelf">
                        <h1>{{ item.nextShelf.shelf_name }}</h1>

                        <!-- Liste des produits avec interaction par clic -->
                        <div class="products-list" v-if="item.nextShelf && item.nextShelf.products.length">
                            <h3>Produits à récupérer</h3>
                            <p v-for="(product, productIndex) in item.nextShelf.products" :key="productIndex"
                                @click="toggleProductChecked(index, productIndex)"
                                :class="{ 'checked-product': productChecks[index][productIndex] }">
                                {{ product.product_name }} x {{ product.quantity }}
                            </p>
                        </div>

                        <!-- Bouton pour passer au rayon suivant, disponible seulement quand tous les produits sont cochés -->
                        <button @click="nextStep" :disabled="!allProductsChecked(index)" class="next-button">
                            Prochain rayon
                        </button>
                    </div>
                </div>

                <!-- Message de fin lorsque tous les rayons sont complétés -->
                <div class="finished" v-if="stepStarted && isProcessFinished">
                    <h1>Félicitations, vous avez récupéré tous les produits !</h1>
                    <p>Dirigez-vous maintenant vers les caisses.</p>
                    <button @click="goToHome">Retourner à l'accueil</button>
                </div>
            </div>
        </div>
        <Spacing />
    </div>
</template>

<script>
import { instance as axios } from "../services/axios";
import Spacing from '@/components/Spacing.vue'
import { useRouter } from 'vue-router';

export default {
    name: "CourseGénéré",
    data() {
        return {
            generated_list: [],
            stepStarted: false,
            currentStep: 0,
            productChecks: [],
            isProcessFinished: false
        };
    },
    components: {
        Spacing
    },
    computed: {
        filteredShelves() {
            return this.generated_list.filter(item => item.nextShelf);
        }
    },
    methods: {
        async fetchData() {
            try {
                const response = await axios.get(`/dijkstra/${this.listId}`);
                this.generated_list = response.data;

                this.productChecks = this.filteredShelves.map(item =>
                    item.nextShelf && item.nextShelf.products ? Array(item.nextShelf.products.length).fill(false) : []
                );
            } catch (err) {
                this.error = 'Impossible de charger les informations utilisateur.';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },

        startProcess() {
            this.stepStarted = true;
        },

        toggleProductChecked(stepIndex, productIndex) {
            this.productChecks[stepIndex][productIndex] = !this.productChecks[stepIndex][productIndex];
        },

        allProductsChecked(stepIndex) {
            return this.productChecks[stepIndex].every(checked => checked);
        },

        nextStep() {
            if (this.currentStep != this.filteredShelves.length - 1) {
                this.currentStep++;
            } else {
                this.isProcessFinished = true;
            }
        },
        goToHome(){
            this.$router.push('/dashboard');
        }
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
    background-color: #2C7C45;
    display: flex;
    min-height: 100vh;
}

.main-container {
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.center-container {
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
    width: 100%;
    border-radius: 30px;
    box-sizing: border-box;
}

.start {
    box-shadow: #0000004d 0px 0px 10px 0px;
    border-radius: 10px;
    background-color: white;
}

.start button {
    font-size: 30px;
    font-weight: bold;
}

.start-button,
.next-button {
    padding: 10px 20px;
    background-color: white;
    border: solid 2px #2C7C45;
    border-radius: 5px;
    cursor: pointer;
}

.start-button:hover,
.next-button:hover {
    background-color: #0056b3;
}

.start-button:disabled,
.next-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
}

.current-shelf-container {
    width: 80%;
    padding: 10px;
    box-shadow: #0000004d 0px 0px 10px 0px;
    border-radius: 10px;
    background-color: white;
}

.current-shelf {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.current-shelf h1 {
    border-bottom: 2px solid #2C7C45;
}

.products-list h3 {
    margin-bottom: 10px;
}

.products-list p {
    margin-bottom: 15px;
    padding: 5px;
    font-size: 20px;
    box-shadow: #0000004d 0px 0px 10px 0px;
    border-radius: 10px;
    cursor: pointer;
    background-color: #f9f9f9;
}

.products-list p:hover {
    background-color: #e0e0e0;
}

.checked-product {
    text-decoration: line-through;
    font-style: italic;
    color: gray;
    background-color: #aaaaaa;
}

.start {
    box-shadow: rgba(0, 0, 0, 0.50) 0px 0px 37px 0px;
    border-radius: 10px;
    background-color: white;
}

.finished {
    width: 80%;
    box-shadow: rgba(0, 0, 0, 0.50) 0px 0px 10px 0px;
    border-radius: 10px;
    background-color: white;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 10px;
}

.finished h1 {
    line-height: normal;
}

.finished p {
   font-size: 20px;
}

.finished button {
    font-size: 30px;
    font-weight: bold;
    background-color: white;
    border: solid 2px #2C7C45;
    border-radius: 5px;
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
