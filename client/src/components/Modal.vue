<template>
    <div v-if="visible" class="modal">
        <div :class="['modal-content', modalClass]">
            <h2>{{ title }}</h2>

            <div v-for="(input, index) in inputs" :key="index" class="modal-input">
                <input :value="input.value" @input="updateInputValue($event, index)" :placeholder="input.placeholder"
                    :class="input.class" />
            </div>

            <p v-if="message">{{ message }}</p>
            <div class="modal-actions">
                <button v-for="action in actions" :key="action.label" @click="action.handler" :class="action.class">
                    {{ action.label }}
                </button>
            </div>
        </div>
    </div>
</template>



<script>
export default {
    name: 'Modal',
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        inputs: {
            type: Array,
            required: true,
            default: () => []
        },
        message: {
            type: String,
            required: false
        },
        actions: {
            type: Array,
            required: true,
            default: () => []
        },
        modalClass: {
            type: String,
            required: false,
            default: ''
        }
    },
    methods: {
        updateInputValue(event, index) {
            this.$emit('update:inputs', {
                index: index,
                value: event.target.value
            });
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

.container {
    display: flex;
    flex-direction: row;
    align-content: center;
    height: 30vh;
}

.modal {
    width: 20%;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 20px;
    border: solid 3px #2c7c45;
    box-shadow: #0000004d 0px 0px 50px 0px;
    z-index: 1000;
    font-family: Inter;
}

.rename-modal-content,
.joining-modal-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Inter;
}

.rename-modal-content,
.joining-modal-content h2 {
    margin-bottom: 15px;
    font-family: Inter;
}

.rename-modal-content input,
.joining-modal-content input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 20px !important;
    background-color: #f9f9f9;
    text-align: center;
    font-family: Inter;
}

.joining-modal-content input {
    letter-spacing: 0.1cm;
    font-weight: bold;
    font-size: 26px !important;
}

.rename-modal input {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 25px !important;
    font-weight: bold;
    background-color: #f9f9f9;
    text-align: center;
    font-family: Inter;
}

.rename-modal-content button,
.joining-modal-content button {
    width: 70%;
    padding: 10px;
    background-color: #2C7C45;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    font-size: 18px;
    font-family: Inter;
}

@media (max-width:1444px) {}

@media (max-width:1244px) {
    .modal {
        width: 50%;
    }

    .main-container {
        width: 90%;
    }

    .container {
        justify-content: space-between;
    }


}

@media (max-width: 768px) {
    .modal {
        width: 90%;
    }

    .group-container,
    .list-container {
        height: 70%;
    }

    .main-container {
        width: 100%;
        padding-left: 5px;
        padding-right: 5px;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

}
</style>