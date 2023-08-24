<script>
export default {
    props: {
        images: {
            type: Array[Object]
        }
    }
};
</script>
<template>
    <div class="images-container">
        <img :src="image.src" :alt="image.alt" v-for="image of images">
    </div>
</template>
<style scoped>
@import url(../assets/css/ImagesDisplay.css);
</style>