<script setup>
import { useNostrStore } from '../clients/nostr';

import Reconnect from './Reconnect.vue';
</script>

<script>
export default {
    props: {
        name: {
            type: String,
        },
    },
    data() {
        return {
            nostr: useNostrStore(),
            connecting: true
        };
    },
    computed: {
        statusClass() {
            switch (this.nostr.relays[this.name].status) {
                case -2:
                    return 'rr-circle-dashed';
                case 0:
                    return 'br-spinner';
                case 1:
                    return 'sr-check-circle';
                case -1:
                    return 'sr-cross-circle';
            }
        },
        shouldTurn() {
            switch (this.nostr.relays[this.name].status) {
                case 0:
                    return true;
                default:
                    return false;
            }
        }
    },
    methods: {
        reconnect() {
            this.nostr.relays[this.name].connect((name, status) => { if (status) this.connecting = false; }, this.nostr);
        }
    }
}

</script>

<template>
    <li>
        <Reconnect @reconnect="reconnect" :connecting="shouldTurn"></Reconnect>
        <span class="text">{{ name }}: <slot></slot></span>
        <img class="icon" :src="`./src/assets/icons/interface/${statusClass}.svg`" :alt="statusClass">
    </li>
</template>

<style scoped>
@import url(../assets/css/Relay.css);
</style>