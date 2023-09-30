<script setup>
import Following from './components/Following.vue';
import Home from './components/Home.vue';
import New from './components/New.vue';
import Events from './components/Events/Events.vue';
import Event from './components/Events/Event.vue';
import Post from './components/Post.vue';
import User from './components/User.vue';
import ConnectionEstablishment from './components/ConnectionEstablishment.vue';

import Dashboard from './components/Dashboard.vue';
import Footer from './components/Footer.vue';

import { useNostrStore } from './clients/nostr';

import { RouterView } from 'vue-router';

import { auto as followSystemColorScheme, setFetchMethod } from 'darkreader';
import { useUIStore } from './ui';

</script>

<script>
export default {
    mounted() {
        // setFetchMethod(window.fetch);
        // followSystemColorScheme({
        //     brightness: 80,
        //     contrast: 120,
        // });
        let desktop = window.matchMedia('(min-width: 500px)');
        if (desktop.matches) {
            this.ui.desktop = true;
        }
    },
    routes: [
        { path: '/', redirect: '/events' },
        // { path: '/following', component: Following },
        // { path: '/home', component: Home },
        { path: '/new', component: New },
        { path: '/events', component: Events },
        { path: '/events/:note', component: Event },
        { path: '/posts/:note', component: Post },
        { path: '/users/:npub', component: User },
    ],
    data() {
        return {
            nostr: useNostrStore(),
            continued: false,
            ui: useUIStore()
        };
    }
};
</script>

<template>
    <div class="app">
        <ConnectionEstablishment v-if="!(nostr.available && nostr.sk) || !continued" @continue="continued = true">
        </ConnectionEstablishment>
        <template v-if="nostr.available && nostr.sk && continued">
            <Dashboard></Dashboard>
            <router-view></router-view>
            <Footer></Footer>
        </template>
    </div>
</template>

<style scoped>
@import url(./assets/css/App.css);
</style>
