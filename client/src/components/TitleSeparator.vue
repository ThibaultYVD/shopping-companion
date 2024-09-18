<template>
    <div class="buttons-container">
        <h1>{{ title }}</h1>
        <div class="buttons" v-if="buttons.length > 0">
            <button v-for="(button, index) in buttons" :key="index" @click="button.action" class="action-button">
                <i :class="button.icon"></i> {{ button.label }}
            </button>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'TitleSeparator',
    props: {
        title: {
            type: String,
            required: true,
        },
        buttons: {
            type: Array,
            default: () => [],
        },
    },
};
</script>

<style scoped>
h1{
    font-weight: 400;
}

.buttons-container {
    padding: 15px 0px 10px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: #2C7C45 solid 5px;
    /*border-radius: 0 0px 10px 10px;*/
}

.buttons {
    display: flex;
    gap: 20px;
    height: 5vh;
}


.action-button {
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: #0000004d 0px 0px 10px 0px;
    border:none;
    border-radius: 15px;
    cursor: pointer;
    font-size: 18px;
    padding: 10px;
    font-weight: 400;
    font-family: Inter;
    text-align: center;
}

.action-button:hover {
    background-color: #2c7c45;
    color: white
}

i{
    font-size: 25px;
}

@media (max-width: 1444px) {
    .buttons-container {
        padding: 10px;

    }

    .buttons {
        gap: 10px;
        display: flex;
        justify-content: center;

    }

    .action-button {
        border-radius: 15px;
        cursor: pointer;
        font-size: 16px;
        padding: 10px;
        font-weight: 400;
        font-family: Inter;
        
    }

}
</style>