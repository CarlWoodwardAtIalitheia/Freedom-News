<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        hideOverflow: {
            type: Boolean,
            default: true
        },
        lineClamp: {
            type: Number,
            default: 2
        },
        width: {
            type: String,
            default: "auto"
        },
        fontSize: {
            type: String,
            default: "x-large"
        }
    },
    data() {
        return {
            style: {
                width: this.width,
                fontSize: this.fontSize,
                '-webkit-line-clamp': this.lineClamp
            }
        };
    }
};
</script>

<template>
    <div>
        <h3 :style="style">
            {{ title }}
            <slot></slot>
        </h3>
    </div>
</template>

<style scoped>
@import url(../assets/css/Title.css);
</style>