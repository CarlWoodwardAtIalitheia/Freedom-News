<script setup>
import { RouterLink } from 'vue-router';
import { useNostrStore } from '../clients/nostr';
import { getPublicKey, nip19 } from 'nostr-tools';
import { useUIStore } from '../ui';
</script>

<script>

export default {
    data() {
        return {
            mobileTabs: [
                // { path: '/following', icon: 'following' },
                // { path: '/home', icon: 'home' },
                { path: '/events', icon: 'radio-alt' },
                { path: '/new', icon: 'square-plus' },
                { name: 'me', path: `/users/${nip19.npubEncode(getPublicKey(useNostrStore().sk))}`, icon: 'circle-user' },
            ],
            desktopTabs: [
                { path: '/events', icon: 'radio-alt' },
                // { name: 'me', path: `/users/${nip19.npubEncode(getPublicKey(useNostrStore().sk))}`, icon: 'circle-user' },
            ],
            ui: useUIStore()
        };
    }
};
</script>

<template>
    <footer class="mobile">
        <ul>
            <li v-for="tab of mobileTabs">
                <RouterLink :to="tab.path">
                    <i :class="`fi fi-${$route.path == tab.path ? 's' : 'r'}r-${tab.icon}`"></i>
                    <span>{{ $t(`footer.${tab.name || tab.path.substring(1)}`) }}</span>
                </RouterLink>
            </li>
        </ul>
    </footer>
    <template v-if="ui.desktop">
        <Teleport to=".dashboard">
            <footer class="desktop">
                <ul>
                    <li v-for="tab of desktopTabs">
                        <RouterLink :to="tab.path">
                            <span>{{ $t(`footer.${tab.name || tab.path.substring(1)}`) }}</span>
                        </RouterLink>
                    </li>
                    <li>
                        <div class="new-button" @click="$router.push('/new')">
                            <img src="../assets/icons/interface/sr-square-plus.svg" :alt="$t('footer.newButton')"
                                class="icon">
                            {{ $t('footer.newButton') }}
                        </div>
                    </li>
                </ul>
            </footer>
        </Teleport>
    </template>
</template>

<style scoped>
@import url(../assets/css/Footer.css);
@import url(../assets/css/desktop/Footer.css) screen and (min-width: 500px);
</style>