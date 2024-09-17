<template>
    <div class="product-card">
        <div class="product-details">
            <div class="product-container">
                <div class="top-infos">
                    <div class="product-infos">
                        <h3 class="product-name">{{ product.product_name }}</h3>
                        <p class="added-by">Ajouté par {{ product.first_name }} le {{ formatDate(product.added_at) }}
                        </p>
                    </div>

                    <div class="delete-action">
                        <button class="remove-button" @click="removeProduct"><i
                                class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>

                <div class="bottom-infos">
                    <div class="pricing">
                        <p class="total-price">Prix: {{ formatPrice(product.price * product.quantity) }}€</p>
                        <p class="price-per-unit">Prix/u: {{ product.price }}€</p>
                    </div>

                    <div class="quantity-inputs">
                        <!--<button class="left-button" @click="decrementQuantity">-</button>-->
                        <input v-model.number="product.quantity" min="0" @input="onQuantityChange" />
                        <!--<button class="right-button" @click="incrementQuantity">+</button>-->
                    </div>

                </div>
            </div>



        </div>

    </div>
</template>

<script>

import { instance as axios } from '../services/axios';

export default {
    props: {
        product: {
            type: Object,
            required: true
        },
    },
    methods: {
        incrementQuantity() {
            this.product.quantity++;
        },
        decrementQuantity() {
            if (this.product.quantity > 0) {
                this.product.quantity--;
            }
        },
        removeProduct() {
            this.$emit('remove', this.product.product_id);
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            const options = { month: 'long', day: 'numeric' };
            return date.toLocaleDateString('fr-FR', options);
        },
        formatPrice(value) {
            return value.toFixed(2);
        },
        async onQuantityChange() {
            if (this.product.quantity === '' || isNaN(this.product.quantity)) {
                return;
            }
            const response = await axios.patch(`/user/products/quantity/${this.$route.params.listId}/${this.product.product_id}`, {
                quantity: this.product.quantity
            });
        }
    }
}
</script>

<style scoped>
.product-card {
    background: #ffffff;
    width: 100%;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 10px 0px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px;
    margin-top: 10px;
}

.product-details {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    padding: 5px;
}

.product-name {
    font-size: 18px;
    font-weight: 700;
    margin: 0;
}

.pricing {
    display: flex;
    flex-direction: row;
    width: 80%;
    gap: 30px;
}

.price-per-unit {
    font-size: 14px;
    font-style: italic;
}

.total-price {
    font-size: 15px;
    font-weight: 700;
}

.product-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.top-infos,
.bottom-infos {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.bottom-infos {
    margin-top: 5px;
    border-top: 1px solid grey;
    padding-top: 10px;
}

.quantity-inputs {
    display: flex;
    flex-direction: row;
    width: 20%;
    justify-content: right;
}

.quantity-inputs input {
    padding: 5px;
    width: 50px;
    text-align: center;
    border: none;
    background-color: #eeeeee;
    border-bottom: 2px solid #2C7C45;
    border-radius: 10px 10px 2px 2px;
    font-size: 14px;
    font-weight: 700;
}

.remove-button {
    background-color: white;
    padding: 5px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-size: 30px;
}

.delete-action {
    box-shadow: #0000004d 0px 0px 10px 0px;
    border-radius: 10px;
}

.added-by {
    font-style: italic;
    font-size: 13px;
}
</style>