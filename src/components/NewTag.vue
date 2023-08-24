<template>
    <div v-show="!inputCompleted"><input v-model="tag" ref="tagInput" @blur="newTag"></div>
    <img src="../assets/icons/interface/rr-add.svg" alt="Add" class="icon" @click="getTag">
</template>

<script>
export default {
    data() {
        return {
            tag: '',
            inputCompleted: true
        };
    },
    emits: ["newTag"],
    methods: {
        getTag() {
            this.inputCompleted = false;
            this.tag = '';
            this.$nextTick(() => {
                this.$refs.tagInput.focus();
            });
        },
        newTag() {
            this.inputCompleted = true;
            if (this.tag) {
                this.$emit('newTag', this.tag);
            }
        }
    }
};
</script>

<style scoped>
@import url(../assets/css/NewTag.css);
</style>