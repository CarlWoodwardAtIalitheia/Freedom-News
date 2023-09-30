<script setup>
import Title from '../Title.vue';
import ImagesDisplay from '../ImagesDisplay.vue';
import Timeline from '../Timeline.vue';
import { useNostrStore } from '../../clients/nostr';

import { db } from '../../db';
import { nip19 } from 'nostr-tools';
import { useObservable } from '@vueuse/rxjs';
import { liveQuery } from 'dexie';

</script>

<script>
export default {
    data() {
        return {
            id: nip19.decode(this.$route.params.note).data,
            posts: [],
            following: useObservable(
                liveQuery(() => db.followedEvents.where('eventId').equals(nip19.decode(this.$route.params.note).data).toArray())
            ),
            title: '',
            nostr: useNostrStore(),
        };
    },
    mounted() {
        this.nostr.get({ ids: [this.id] }, (event) => { this.title = event.content; });

        this.nostr.sub([{ '#e': [this.id] }], (post) => {
            if (this.posts.map(post => post.id).includes(post.id)) return false;
            this.posts.push(post);
        }, () => { /* eose */ });
    },
    computed: {
        followBtnText() {
            return (this.following || []).length ? this.$t('event.following') : this.$t('event.follow');
        }
    },
    methods: {
        async followSwitch() {
            if ((this.following || []).length) {
                await db.followedEvents
                    .where('eventId').equals(this.id)
                    .delete();
            } else {
                db.followedEvents.add({
                    eventId: this.id
                });
            }
        }
    }
};
</script>
<template>
    <Teleport to=".dashboard">
        <img src="../../assets/icons/interface/sr-arrow-small-left.svg" alt="Back" class="icon back"
            @click="$router.go(-1)">
    </Teleport>
    <div class="intro">
        <Title width="90vw" font-size="xx-large" :line-clamp="10">{{ title }}</Title>
        <!-- <ImagesDisplay :images="images"></ImagesDisplay> -->
        <!-- <p class="summary">{{ 'Get premium to summarize the event.' }}</p> -->
        <button :class="['follow-btn', following.length ? 'following' : 'follow']" @click="followSwitch">{{
            followBtnText
        }}</button>
    </div>

    <div class="timeline">
        <Timeline :updates="posts"></Timeline>
    </div>
</template>
<style scoped>
@import url(../../assets/css/Events/Event.css);
@import url(../../assets/css/desktop/Events/Event.css) screen and (min-width: 500px);
</style>