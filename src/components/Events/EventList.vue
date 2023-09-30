<script setup>
import { useNostrStore } from '../../clients/nostr';
import { generatePrivateKey, nip19 } from 'nostr-tools';

import secretary from '../../copilot/secretary';

import { RouterLink } from 'vue-router';
import Title from '../Title.vue';
</script>

<script>
export default {
    props: {
        ids: Array
    },
    data() {
        return {
            nostr: useNostrStore(),
            titles: {}
        };
    },
    methods: {
        note(id) {
            return nip19.noteEncode(id);
        }
    }
};
</script>

<template>
    <div>
        <h2>
            <slot></slot>
        </h2>
        <div class="list">
            <div v-for="id of ids" :key="id">
                <div class="title">
                    <Title>{{ titles[id] || nostr.get({ 'ids': [id] }, (event) => {
                        titles[id] = event.content;
                    }) }}
                    </Title>
                </div>
                <router-link :to="`/events/${note(id)}`">
                    <div class="enter"><img src="../../assets/icons/interface/sr-arrow-small-right.svg" alt="continue"
                            class="icon"></div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url(../../assets/css/Events/EventList.css);
@import url(../../assets/css/desktop/Events/EventList.css) screen and (min-width: 500px);
</style>