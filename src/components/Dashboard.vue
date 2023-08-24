<script setup>
import { useUIStore } from '../ui';
</script>

<script>
export default {
    data() {
        return {
            ui: useUIStore()
        };
    }
};
</script>

<template>
    <div :style="{ marginTop: ui.dashboardHeight + (ui.dashboardHeight ? 10 : 0) + 'px' }">
        <div class="dashboard" :style="{ height: ui.dashboardHeight + 'px' }">
        </div>
    </div>
</template>

<style scoped>
@import url(../assets/css/Dashboard.css);
</style>