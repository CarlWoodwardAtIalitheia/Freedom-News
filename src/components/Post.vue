<script setup>
import { useNostrStore } from '../clients/nostr';
import Title from './Title.vue';
import markdownIt from 'markdown-it';
import Publisher from './Publisher.vue';
import { nip19 } from 'nostr-tools';
</script>

<script>
export default {
    data() {
        return {
            id: nip19.decode(this.$route.params.note).data,
            nostr: useNostrStore(),
            markdown: new markdownIt({
                html: true,
                allowedTags: ['span', 'img', 'audio', 'video', 'source', 'style']
            }),

            title: '',
            content: '',
            pubkey: ''
        };
    },
    mounted() {
        this.nostr.get({ ids: [this.id] }, (post) => {
            this.title = post.tags[1][1];
            this.content = post.content.replace(/^[^\n]+\n/, '');
            this.pubkey = post.pubkey;
            this.date = new Date(post.created_at * 1000).toLocaleString();
        });
    },
    computed: {
        htmlText() {
            return this.markdown.render(this.content);
        }
    }
};
</script>

<template>
    <div class="post">
        <Teleport to=".dashboard">
            <img src="../assets/icons/interface/sr-arrow-small-left.svg" alt="Back" class="icon back"
                @click="$router.go(-1)">
        </Teleport>
        <Title :line-clamp="100" :font-size="`xx-large`">{{ title }}</Title>
        <div class="metadata" v-if="content">
            <Publisher :pubkey="pubkey" class="publisher"></Publisher>
            <span class="date">{{ date }}</span>
        </div>
        <div class="markdown-body" v-html="htmlText"></div>
    </div>
</template>

<style scoped>
@import url(../assets/css/Post.css);
</style>

<style>
.post a {
    color: hsl(136, 22%, 50%) !important;
}
</style>