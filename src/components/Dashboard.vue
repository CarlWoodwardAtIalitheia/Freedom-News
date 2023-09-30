<script setup>
import { useNostrStore } from '../clients/nostr';
import { useUIStore } from '../ui';
import Publisher from './Publisher.vue';
import { nip19, getPublicKey } from 'nostr-tools';
</script>

<script>
export default {
    data() {
        return {
            ui: useUIStore(),
            nostr: useNostrStore()
        };
    }
};
</script>

<template>
    <div :style="{ marginTop: ui.dashboardHeight + (ui.dashboardHeight ? 10 : 0) + 'px' }">
        <div class="dashboard" :style="{ height: ui.dashboardHeight + 'px' }">
            <Publisher :pubkey="getPublicKey(nostr.sk)" v-if="ui.desktop"
                @click="$router.push(`/users/${nip19.npubEncode(getPublicKey(nostr.sk))}`)"></Publisher>
        </div>
    </div>
</template>

<style scoped>
@import url(../assets/css/Dashboard.css);
</style>