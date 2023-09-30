<script setup>

import NewEvent from './NewEvent.vue';
import Editor from './Editor.vue';
import { useNostrStore } from '../clients/nostr';
import secretary from '../copilot/secretary';
import { useToast } from 'vue-toastification';
import { nip19 } from 'nostr-tools';
import { db } from '../db';
import { liveQuery } from 'dexie';
import { useObservable } from "@vueuse/rxjs";

import { useUIStore } from '../ui';
</script>

<template>
    <div class="new">
        <div class="title">
            <h2>{{ $t('new.title') }}: </h2>
            <input v-model="title" class="title-input">
        </div>
        <div class="event">
            <h2>{{ $t('new.event') }}: </h2>

            <select v-model="event" class="event-select">
                <option disabled value="">{{ $t('new.pleaseSelectEvent') }}</option>
                <option value="new">{{ $t('new.newEvent') }}</option>
                <option v-for="id of (following || []).map(v => v.eventId)" :value="{ id: id }">
                    {{ titles[id] || nostr.get({ 'ids': [id] }, e => titles[id] = e.content) }}
                </option>
            </select>

            <NewEvent v-if="event == 'new'" ref="eventCreator"></NewEvent>
        </div>
        <br>
        <Editor ref="editor"></Editor>
        <Teleport to=".dashboard">
            <div class="category" v-if="event && title">
                <select v-model="category" class="category-select">
                    <option disabled value="">{{ $t('new.categorySelect') }}</option>
                    <option v-for="category of [
                        'moment',
                        'opinion',
                        'breaking',
                        'investigative',
                        'analysis',
                        'feature',
                        'interview',
                        'report',
                        'inDepth',
                        'advise',
                    ]" :value="category">{{
    $t(`postCategories.${category}`) }}</option>
                </select>
            </div>
        </Teleport>
        <Teleport to=".dashboard">
            <div class="post">
                <div class="post-button" @click="post" v-show="event && title && $refs.editor.content && category">
                    <img src="../assets/icons/interface/br-paper-plane-top.svg" :alt="$t('new.post')" class="icon">
                    {{ $t('new.post') }}
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script>
export default {
    data() {
        return {
            event: '',
            category: '',
            title: '',
            nostr: useNostrStore(),
            toast: useToast(),
            following: useObservable(
                liveQuery(() => db.followedEvents.toArray())
            ),
            titles: {},
            ui: useUIStore()
        };
    },
    mounted() {
        this.ui.setDashboardHeight(0);
    },
    emits: ["newTag"],
    methods: {
        async post() {
            if (this.event == 'new') {
                this.event = await this.$refs.eventCreator.create();
                await db.followedEvents.add({
                    eventId: this.event.id
                });
            }
            let post = await this.nostr.publish(
                await secretary.createPost(this.category, this.event.id, this.title, this.$refs.editor.content, this.nostr.rr, this.$i18n.locale),
                this.nostr.sk,
                (name, url) => { this.toast.success(this.$t('new.succeeded', { title: this.title, name: name, url: url })); },
                () => { /* failed */ }
            );
            this.$router.push(`/posts/${nip19.noteEncode(post.id)}`);
        }
    },
    watch: {
        title(newValue, oldValue) {
            if (newValue && this.event) {
                this.ui.setDashboardHeight(60);
            } else {
                this.ui.setDashboardHeight(0);
            }
        },
        event(newValue, oldValue) {
            if (this.title && newValue) {
                this.ui.setDashboardHeight(60);
            } else {
                this.ui.setDashboardHeight(0);
            }
        },
    },
    unmounted() {
        this.ui.setDashboardHeight(60);
    }
};
</script>
<style scoped>
@import url(../assets/css/New.css);
@import url(../assets/css/desktop/New.css) screen and (min-width: 500px);
</style>