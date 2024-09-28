<template>
    <div v-if="visible" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>{{ title }}</h2>
                <button @click="$emit('close')" class="close-button">&times;</button>

            </div>
            <div class="modal-body">
                <slot name="body"></slot>
                <div class="modal-actions">
                    <button v-for="action in actions" :key="action.label" @click="action.handler" :class="action.class">
                        {{ action.label }}
                    </button>
                </div>
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
    padding-top: 15px;
    width: 80%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.modal-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.modal-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
}


.close-button {
    background: transparent;
    border: none;
    font-size: 32px;
    cursor: pointer;
    box-shadow: #0000004d 0px 0px 10px 0px;
    border-radius: 10px;
}



.modal-actions button {
    width: 100%;
    padding: 10px;
    background-color: #2C7C45;
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}
</style>
