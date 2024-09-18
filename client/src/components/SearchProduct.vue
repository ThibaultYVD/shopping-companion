<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <button @click="$emit('close')" class="close-button">&times;</button>
            <h2>Recherche de Produits</h2>

            <input v-model="searchQuery" @input="searchProducts" placeholder="Rechercher un produit..."
                class="search-input" />

            <div v-if="products.length > 0">
                <ul class="product-list">
                    <li v-for="product in products" :key="product.product_id" class="product-item">
                        <span>{{ product.product_name }}</span>
                        <span>{{ product.shelf_name }}</span>
                        <span>Prix/u : {{ product.price }}€</span>
                        <button @click="addProductToList(product)" class="add-button">Ajouter</button>
                    </li>
                </ul>
            </div>
            <div v-else-if="searchQuery.length >= 3">
                <p>Aucun produit trouvé.</p>
            </div>
        </div>
    </div>
</template>

<script>
import { instance as axios } from '../services/axios';

export default {
    data() {
        return {
            searchQuery: '',
            products: [],
        };
    },
    mounted() {
        this.listId = this.$route.params.listId;
    },
    methods: {
        async searchProducts() {
            try {
                const response = await axios.get(`/user/products/search/${this.listId}`, {
                    params: { query: this.searchQuery }
                });
                this.products = response.data;
            } catch (error) {
                console.error('Erreur lors de la recherche de produits:', error);
            }
        },
        async addProductToList(product) {
            try {
                await axios.post(`/user/products/${this.listId}/${product.product_id}`);
                this.$emit('product-added', product);
                this.$emit('close');
            } catch (error) {
                console.error('Erreur lors de l\'ajout du produit à la liste:', error);
            }
        }
    }
};
</script>

<style scoped>
.open-modal-button {
    background-color: #2C7C45;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    border-radius: 10px;
    padding: 20px;
    width: 80%;
    max-width: 500px;
    position: relative;
}

.close-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 24px;
    cursor: pointer;
}

.search-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.product-list {
    list-style-type: none;
    padding: 0;
}

.product-item {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.add-button {
    background-color: #2C7C45;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
}
</style>