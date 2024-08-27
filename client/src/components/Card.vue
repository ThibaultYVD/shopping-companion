<template>
    <div class="card">
        <div class="card-infos">
            <h3>{{ title }}</h3>
            <p v-if="groupName">{{ groupName }}</p>
            <p v-if="userCount !== undefined">Nombre de personnes: {{ userCount }}</p>
            <p v-if="activeListCount !== undefined">Listes actives: {{ activeListCount }}</p>
            <p v-if="shoppingDate">Date de course prévu: {{ formattedDate }}</p>
            <p v-if="supermarketName">{{ supermarketName }}</p>
        </div>
        <div class="card-footer">
            <button @click="handleButtonClick" class="go-to-button">
                {{ buttonText }}
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        title: {
            type: String,
            required: true
        },
        groupName: {
            type: String,
            required: false
        },
        shoppingDate: {
            type: String,
            required: false
        },
        supermarketName: {
            type: String,
            required: false
        },
        userCount: {
            type: Number,
            required: false
        },
        activeListCount: {
            type: Number,
            required: false
        },
        groupId: {
            type: [String, Number],
            required: false
        },
        listId: {
            type: [String, Number],
            required: false
        },
        buttonText: {
            type: String,
            required: true
        }
    },
    computed: {
        formattedDate() {
            return this.formatDate(this.shoppingDate);
        }
    },
    methods: {
        handleButtonClick() {
            if (this.listId) {
                this.$emit('go-to-list', this.groupId, this.listId);
            } else if (this.groupId) {
                this.$emit('go-to-group', this.groupId);
            }
        },
        formatDate(date) {
            // Implémentez ici la logique de formatage de la date
            // Retourne une date formatée
            return new Date(date).toLocaleDateString();
        }
    }
};
</script>

<style scoped>
.card {
    background: #ffffff;
    width: 30%;
    margin: 1rem;
    border-radius: 20px;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 10px 0px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-infos {
    padding: 1rem;
}

.card-footer {
    background-color: #e0e0e0;
    padding: 15px;
    border-radius: 0 0 10px 10px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card h3 {
    margin: 0 0 0.5rem 0;
    font-weight: bold;
}

.card p {
    margin: 0.2rem 0;
    font-size: 16px;
}


.go-to-button {
    background-color: white;
    padding: 8px;
    width: 70%;
    border: 2px solid #2c7c45;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    font-family: Inter;
}

.go-to-button:hover {
    background-color: #2c7c45;
    color: white;
}

/* Responsive styles */
@media (max-width:1444px) {
    .card {
        width: 25%;
    }
}

@media (max-width:1244px) {
    .card {
        width: 45%;
    }

    .card-infos {
        height: 20%;
    }

    .card-footer {
        padding: 10px;
    }
}

@media (max-width: 768px) {
    .card {
        width: 90%;
        height: 100%;
    }
    
}
</style>
