<script>
export default {
    props: {
        connecting: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        click() {
            this.$emit('reconnect');
        }
    }
};
</script>

<template>
    <span :class="{ reconnect: true }"><img src="../assets/icons/interface/br-refresh.svg" alt="br-refresh" class="icon"
            @click="click"></span>
</template>