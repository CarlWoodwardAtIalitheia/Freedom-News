<script setup>
import Title from './Title.vue';
import { RouterLink } from 'vue-router';
import Publisher from './Publisher.vue';
import { nip19 } from 'nostr-tools';
</script>

<template>
    <div class="update">
        <div class="metadata">
            <Publisher :pubkey="pubkey" class="publisher" :show-name="false"></Publisher>
            <div class="info">
                <div class="category">{{ category }}</div>
                <div class="date">{{ new Date(date * 1000).toLocaleString() }}</div>
            </div>
        </div>
        <RouterLink :to="`/posts/${note}`">
            <div class="content">
                <Title>{{ title }}</Title>
            </div>
        </RouterLink>
    </div>
</template>

<script>
export default {
    props: {
        date: {
            type: Number
        },
        category: {
            type: String
        },
        title: {
            type: String
        },
        id: {
            type: String
        },
        pubkey: {
            type: String
        }
    },
    computed: {
        note() {
            return nip19.noteEncode(this.id);
        }
    }
};
</script>

<style scoped>
@import url(../assets/css/TimelineUpdate.css);
</style>