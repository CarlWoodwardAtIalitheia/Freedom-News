<script>
import { nip19 } from 'nostr-tools';
import { useNostrStore } from '../clients/nostr';
import { RouterLink } from 'vue-router';

export default {
    props: {
        pubkey: {
            type: String
        },
        showName: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            avatar: '',
            name: '',

            nostr: useNostrStore()
        };
    },
    mounted() {
        this.nostr.get({ authors: [this.pubkey], kinds: [0] }, (e) => {
            let profile = JSON.parse(e.content);
            this.avatar = profile.picture;
            this.name = profile.display_name;
        });
    },
    computed: {
        npub() {
            return nip19.npubEncode(this.pubkey);
        }
    }
};
</script>
<template>
    <div class="publisher">
        <div class="left">
            <div class="avatar"><img :src="avatar" alt="Avatar"></div>
            <div class="follow"></div>
        </div>
        <router-link :to="`/users/${npub}`">
            <div class="right" v-if="showName">{{ name }}</div>
        </router-link>
    </div>
</template>
<style scoped>
@import url(../assets/css/Publisher.css);
</style>