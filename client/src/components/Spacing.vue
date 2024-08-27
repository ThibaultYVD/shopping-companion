<template>
    <div class="spacing"></div>
</template>

<script>
export default {
    name: 'Spacing',

};
</script>

<style scoped>
.spacing {
    display: block;
    width: 15%;
}


@media (max-width:1244px) {

    .spacing {
        width: 5%;
    }
}

@media (max-width: 768px) {

    .spacing {
        display: none;
    }

}
</style>