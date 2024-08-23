<template>
    <div class="background">
        <div class="main-container">
            <div class="list">
                <h1>{{ list.list_name }}</h1>

                <div v-if="isGroupCreator" class="admin-buttons">
                    <button @click="editList" class="edit-button">Modifier le nom de la liste</button>
                    <button @click="deleteList" class="delete-button">Supprimer la liste</button>
                </div>
            </div>

            <div class="products">
                <h1>Produits de la liste</h1>
                <div v-if="products.length > 0" class="products-container">
                    <div v-for="product in products" :key="product.product_id" class="product-card">
                        <h3>{{ product.product_name }}</h3>
                        <p>Qté: {{ product.quantity }}</p>
                        <p>Prix: {{ product.price }}</p>
                    </div>
                </div>
                <div v-else>
                    <p>Aucun produit dans cette liste pour l'instant.</p>
                </div>
            </div>


            <div v-if="isEditing" class="edit-modal">
                <div class="modal-content">
                    <h2>Modifier le nom de la liste</h2>
                    <input v-model="newListName" placeholder="Nouveau nom de la liste" />
                    <input v-model="newShoppingDate" placeholder="Nouvelle date de course" />
                    <button @click="saveListName">Enregistrer</button>
                    <button @click="cancelEdit">Annuler</button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { instance as axios } from '../services/axios';
import { useRouter } from 'vue-router';

export default {
    name: 'List',
    data() {
        return {
            list: {},
            products: [],
            userId: null,
            isEditing: false,
            newListName: '',
            newShoppingDate: '',
            invitation_code: null
        };
    },
    computed: {

        isGroupCreator() {
            return this.userId === this.list.user_id;
        },
        isGroupMember() {
            return this.userId !== this.list.user_id;
        }

    },
    mounted() {
        this.groupId = this.$route.params.groupId;
        this.listId = this.$route.params.listId;
        this.getUserIdFromToken();
        this.getList(this.groupId, this.listId);
        this.getProducts(this.listId);

    },
    methods: {
        getUserIdFromToken() {
            const token = localStorage.getItem('token');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                this.userId = payload.id;
            }
        },
        async getList(groupId, listId) {
            try {
                const response = await axios.get(`/user/lists/${groupId}/${listId}`);
                this.list = response.data[0];
            } catch (error) {
                console.error('Error fetching lists:', error);

            }
        },
        editList() {
            this.isEditing = true;
            this.newListName = this.list.list_name;
            this.newShoppingDate = this.list.shopping_date;
        },
        async saveListName() {
            try {
                await axios.patch(`/user/lists/${this.groupId}/${this.listId}`, { list_name: this.newListName, shopping_date: this.newShoppingDate });
                this.list.list_name = this.newListName;
                this.list.shopping_date = this.newShoppingDate;
                this.isEditing = false;
            } catch (error) {
                console.error('Error updating list name:', error);
            }
        },
        cancelEdit() {
            this.isEditing = false;
        },
        async getProducts(listId) {
            try {
                const response = await axios.get(`/user/products/${listId}`)
                this.products = response.data
            } catch (error) {
                console.log(error)
            }

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

.main-container {
    display: flex;
    padding-top: 50px;
}

.list {
    width: 50%;
    padding-left: 3rem;
}

.list h1 {
    margin-top: 20px;
    margin-bottom: 10px;
}

.admin-buttons {
    display: flex;
    flex-wrap: wrap;
}

.edit-button,
.delete-button {
    margin-right: 10px;
    padding: 10px 20px;
    background-color: white;
    color: black;
    border: solid 2px #2C7C45;
    border-radius: 5px;
    cursor: pointer;
}

.edit-button:hover,
.delete-button:hover {
    background-color: #2C7C45;
    color: white;
}

.products {
    width: 50%;
    padding-left: 3rem;
}

.products h1 {
    margin-top: 20px;
}

.products-container {
    width: 100%;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
}

.product-card {
    background: white;
    padding: 1rem;
    margin: 0.5rem;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.30) 0px 0px 10px 0px;
    border: solid 2px #2C7C45;
}

.product-card h3 {
    margin: 0 0 0.5rem 0;
    font-weight: bold;
}

.product-card p {
    margin: 0.2rem 0;
}

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

.list-button:hover {
    background: #2C7C45;
    color: white;
}

.edit-modal,
.invitation-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 10px;
    border: solid 2px #2C7C45;
    box-shadow: #0000004d 0px 0px 10px 0px;
    z-index: 1000;
}

.modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal-content h2 {
    margin-bottom: 15px;
}

.modal-content input {
    margin-bottom: 15px;
    padding: 10px;
    font-size: 16px;
    width: 100%;
}

.modal-content button {
    width: 100%;
    padding: 10px;
    background-color: #2C7C45;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
}

.modal-content button:hover {
    background-color: #2C7C45;
    color: white;
}
</style>