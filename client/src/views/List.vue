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

    <SearchProduct v-if="isSearchModalVisible" @close="closeSearchModal" @product-added="getProducts(this.listId)"/>

    <Modal :visible="isEditModalVisible" title="Modifier le nom de la liste" :actions="actions" @close="closeEditModal">
        <template v-slot:body>
            <input v-model="newListName" class="modal-input" placeholder="Nouveau nom de la liste" />
            <input v-model="newShoppingDate" class="modal-input" placeholder="Nouvelle date de course" />
        </template>
    </Modal>

</template>

<script>
import TitleSeparator from '@/components/TitleSeparator.vue';
import { instance as axios } from '../services/axios';
import { useRouter } from 'vue-router';
import CustomTitleSeparator from '@/components/CustomTitleSeparator.vue';
import Spacing from '@/components/Spacing.vue';
import Product from '@/components/Product.vue';
import SearchProduct from '@/components/SearchProduct.vue';
import Modal from '@/components/Modal.vue';

export default {
    name: 'List',
    components: {
        TitleSeparator,
        CustomTitleSeparator,
        Spacing,
        Product,
        SearchProduct,
        Modal
    },
    data() {
        return {
            list: {},
            products: [],
            userId: null,
            isEditModalVisible: false,
            newListName: '',
            newShoppingDate: '',
            invitation_code: null,
            productsButtons: [
                { label: "Ajouter", action: this.openSearchModal }
            ],
            isSearchModalVisible: false,
            actions: [
                { label: 'Enregistrer', handler: this.saveListName }
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
                    { label: 'Modifier', action: this.openEditModal },
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
        async deleteList() {
            try {
                const isConfirmed = confirm("Voulez vous vraiment supprimer cette liste ?")

                if (isConfirmed) {
                    try {
                        await axios.delete(`/user/lists/${this.groupId}/${this.listId}`);
                        this.$router.push(`/group/${this.groupId}`);
                    } catch (error) {
                        console.error('Error deleting list:', error);
                        alert("Une erreur est survenue lors de la suppression de la liste.");
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la suppression du produit:', error);
            }
        },
        async getList(groupId, listId) {
            try {
                const response = await axios.get(`/user/lists/${this.groupId}/${this.listId}`);
                this.list = response.data[0];
                this.newShoppingDate = this.list.shopping_date
            } catch (error) {
                console.error('Error fetching lists:', error);

            }
        },
        async saveListName() {
            try {
                await axios.patch(`/user/lists/${this.groupId}/${this.listId}`, { list_name: this.newListName, shopping_date: this.newShoppingDate });
                this.list.list_name = this.newListName;
                this.list.shopping_date = this.newShoppingDate;
                this.isEditModalVisible = false;
            } catch (error) {
                console.error('Error updating list name:', error);
            }
        },
        async getProducts(listId) {
            try {
                const response = await axios.get(`/user/products/${listId}`)
                this.products = response.data
            } catch (error) {
                if (error.status == 403) {
                    return
                }
                console.error(error)
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
                        alert("Une erreur est survenue lors de la suppression du produit.");
                    }
                }
            } catch (error) {
                console.error('Erreur lors de la suppression du produit:', error);
            }
        },
        openEditModal() {
            this.isEditModalVisible = true;
        },
        closeEditModal() {
            this.isEditModalVisible = false;
        },
        openSearchModal() {
            this.isSearchModalVisible = true;
        },
        closeSearchModal() {
            this.isSearchModalVisible = false;
        }


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

.center-container {
    margin-top: 10px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 10px;
    background: rgb(241, 238, 238);
    box-shadow: #0000004d 0px 0px 10px 0px;
    border-radius: 30px;
    box-sizing: border-box;

}

.products-container {
    width: 100%;
}

.products-mobile {
    display: none;
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

.modal-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
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
        width: 95%;
        min-height: 80%;
        overflow: auto;
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