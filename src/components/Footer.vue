<script setup>
import { RouterLink } from 'vue-router';
import { useNostrStore } from '../clients/nostr';
import { getPublicKey, nip19 } from 'nostr-tools';
</script>

<script>

export default {
    data() {
        return {
            tabs: [
                // { path: '/following', icon: 'following' },
                // { path: '/home', icon: 'home' },
                { path: '/events', icon: 'radio-alt' },
                { path: '/new', icon: 'square-plus' },
                { name: 'me', path: `/users/${nip19.npubEncode(getPublicKey(useNostrStore().sk))}`, icon: 'circle-user' },
            ]
        };
    }
};
</script>

<template>
    <footer>
        <ul>
            <li v-for="tab of tabs">
                <RouterLink :to="tab.path">
                    <i :class="`fi fi-${$route.path == tab.path ? 's' : 'r'}r-${tab.icon}`"></i>
                    <span>{{ $t(`footer.${tab.name || tab.path.substring(1)}`) }}</span>
                </RouterLink>
            </li>
        </ul>
    </footer>
</template>

<style scoped>
@import url(../assets/css/Footer.css);
</style>