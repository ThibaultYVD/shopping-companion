<template>
    <div class="product-card">
        <div class="product-details">
            <div class="left-infos">
                <h3 class="product-name">{{ product.product_name }}</h3>
                <p class="added-by">Demandé par {{ product.first_name }} le {{ formatDate(product.added_at) }}</p>
            </div>
            <div class="right-actions">
                <div class="pricing">
                    <p class="total-price">Prix: {{ formatPrice(product.price * product.quantity) }}€</p>
                    <p class="price-per-unit">Prix/u: {{ product.price }}€</p>
                </div>

                <div class="quantity-controls">
                    <div class="quantity-inputs">
                        <button class="left-button" @click="decrementQuantity">-</button>
                        <input v-model.number="product.quantity" min="0" />
                        <button class="right-button" @click="incrementQuantity">+</button>
                    </div>
                    <button class="remove-button" @click="removeProduct">Supprimer</button>
                </div>

            </div>
            <div class="mobile">
                <p class="added-by">Ajouté par {{ product.first_name }} le {{ formatDate(product.added_at) }}</p>
            </div>
        </div>

        <div class="product-details-mobile">
            <div class="product-container">
                <div class="left-infos">
                    <h3 class="product-name">{{ product.product_name }}</h3>
                    <div class="quantity-inputs-mobile">
                        <button class="left-button" @click="decrementQuantity">-</button>
                        <input v-model.number="product.quantity" min="0" />
                        <button class="right-button" @click="incrementQuantity">+</button>
                    </div>
                </div>

                <div class="right-actions">
                    <div class="pricing">
                        <p class="total-price">Prix: {{ formatPrice(product.price * product.quantity) }}€</p>
                        <p class="price-per-unit">Prix/u: {{ product.price }}€</p>
                    </div>

                </div>

            </div>

            <div class="quantity-controls-mobile">
                <button class="remove-button" @click="removeProduct">Supprimer</button>
            </div>
            <p class="added-by">Ajouté par {{ product.first_name }} le {{ formatDate(product.added_at) }}</p>
        </div>

    </div>
</template>

<script>
export default {
    props: {
        product: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            required: true
        }
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
        }
    }
}
</script>

<style scoped>
.product-card {
    background: #ffffff;
    width: 50%;
    border-radius: 15px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 10px 0px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 5px;
    margin-top: 10px;
}

.mobile {
    display: none;
}

.product-details {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.product-details-mobile {
    display: none;
}

.product-details h3 {
    margin: 0;
}

.additional-info {
    display: flex;
    flex-direction: row;
    margin-left: 10px;
    gap: 20px
}

.product-name {
    font-size: 18px;
    font-weight: 700;
}

.added-by {
    font-size: 12px;
    font-style: italic;
}

.right-actions {
    display: flex;
    flex-direction: row;
    gap: 20px;
}

.pricing {
    display: flex;
    flex-direction: column;
}

.price-per-unit {
    font-size: 14px;
    font-style: italic;
}

.total-price {
    font-size: 15px;
    font-weight: 700;
}

.quantity-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1px;
    gap: 1px;
}

.quantity-inputs button,
.quantity-inputs-mobile button {
    text-align: center;
    padding: 5px;
    background-color: #2C7C45;
    color: white;
    border: #2C7C45 2px solid;
}

.quantity-inputs .left-button,
.quantity-inputs-mobile .left-button {
    border-radius: 5px 0px 0px 5px;
}

.quantity-inputs .right-button,
.quantity-inputs-mobile .right-button {
    border-radius: 0px 5px 5px 0px;
}



.quantity-controls input {
    width: 50px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    padding: 5px;
}

.quantity-inputs input,.quantity-inputs-mobile input {
    padding: 5px;
    width: 50px;
    text-align: center;
    border: #2C7C45 2px solid;

}

.remove-button {
    width: 100%;
    background-color: white;
    padding: 5px;
    border-radius: 10px;
    border: 2px #2C7C45 solid;
}



@media (max-width:1244px) {
    .product-card {
        width: 100%;
    }
}

@media (max-width:768px) {
    .product-details {
        display: none;

    }

    .product-details-mobile {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .product-container {
        display: flex;
    }



    .quantity-inputs-mobile button {
        width: 20%;
    }

    .left-infos {
        width: 50%;
    }

    .right-actions {
        width: 50%;
        justify-content: flex-end;
    }

}
</style>