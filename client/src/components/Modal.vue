<template>
    <div v-if="visible" class="modal-overlay">
        <div class="modal-content">
            <button @click="$emit('close')" class="close-button">&times;</button>
            <h2>{{ title }}</h2>
            <slot name="body"></slot>
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
        actions: {
            type: Array,
            required: true,
            default: () => []
        }
    }
};
</script>

<style scoped>
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

.modal-actions button {
    width: 100%;
    padding: 10px;
    background-color: #2C7C45;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    font-size: 16px;
}

</style>
