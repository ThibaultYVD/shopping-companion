<template>
    <div class="background">
        <Spacing />
        <div class="main-container">
            <div class="group-container">
                <CustomTitleSeparator :title="list.list_name" :buttons="listButtons" />
                <p>Infos</p>
            </div>


            <div class="center-container">
                <div class="products-container">
                    <TitleSeparator title="Produits" :buttons="productsButtons" />


                    <div v-if="products.length > 0" class="products">
                        <Product v-for="product in products" :key="product.product_id" :product="product"
                            @remove="handleRemove" />
                    </div>
                    <div v-else>
                        <p>Il n'y a aucun produit dans cette liste. Commencez par en ajouter un !</p>
                    </div>

                </div>


            </div>
        </div>
        <Spacing />
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
</template>

<script>
import TitleSeparator from '@/components/TitleSeparator.vue';
import { instance as axios } from '../services/axios';
import { useRouter } from 'vue-router';
import CustomTitleSeparator from '@/components/CustomTitleSeparator.vue';
import Spacing from '@/components/Spacing.vue';
import Product from '@/components/Product.vue';

export default {
    name: 'List',
    components: {
        TitleSeparator,
        CustomTitleSeparator,
        Spacing,
        Product
    },
    data() {
        return {
            list: {},
            products: [],
            userId: null,
            isEditing: false,
            newListName: '',
            newShoppingDate: '',
            invitation_code: null,
            productsButtons: [
                { label: "Ajouter", action: this.createList }
            ]
        };
    },
    computed: {

        isGroupCreator() {
            return this.userId === this.list.user_id;
        },
        isGroupMember() {
            return this.userId !== this.list.user_id;
        },
        listButtons() {
            const buttons = []
            if (this.isGroupCreator) {
                buttons.push(
                    { label: 'Modifier', action: this.editList },
                    { label: "Supprimer", action: this.deleteList },
                )
            }
            return buttons
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

        },
        async handleRemove(productId) {
            try {
                const isConfirmed = confirm("Voulez vous vraiment supprimer ce produit ?")

                if (isConfirmed) {
                    try {
                        await axios.delete(`/user/products/${this.listId}/${productId}`);
                        this.products = this.products.filter(product => product.product_id !== productId);
                    } catch (error) {
                        console.error('Error deleting group:', error);
                        alert("Une erreur est survenue lors de la suppression du groupe.");
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la suppression du produit:', error);
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
    display: flex;
}

.main-container {
    padding-top: 60px;
    width: 70%;
}

.center-container {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 10px;
    background: rgb(241, 238, 238);
    box-shadow: #0000004d 0px 0px 10px 0px;
    border-radius: 30px;
    box-sizing: border-box;
    margin: 0 auto;
    height: auto;
}

.products-container {
    padding: 10px;
    width: 100%;
}

.products-mobile {
    display: none;
}



@media (max-width:1444px) {
    .main-container {
        width: 80%;
    }
}

@media (max-width:1244px) {
    .modal {
        width: 50%;
    }

    .main-container {
        width: 90%;
    }
}

@media (max-width: 768px) {

    .main-container {
        width: 100%;
    }

    .center-container {
        display: flex;
        flex-direction: column-reverse;
        justify-content: flex-end;
        margin-left: auto;
        margin-right: auto;
        width: 90%;
        height: 100vh;
    }

    .products {
        display: flex;
        flex-direction: column;
    }

    .products .card {
        width: 100%;
    }

}
</style>