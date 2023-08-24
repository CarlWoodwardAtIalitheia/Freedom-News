<template>
    <div class="new-event">
        <div class="title">
            <strong>{{ $t('newEvent.title') }}: </strong>
            <input v-model="title" @blur="updateTags" class="title-input">
        </div>
        <div class="tags">
            <strong>{{ $t('newEvent.tags') }}: </strong>
            <span class="updating" v-show="updating"> <img class="icon" src="../assets/icons/interface/br-spinner.svg"
                    alt="br-spinner"></span>
            <span v-for="tag of tags" class="tag">{{ tag }}
                <img class="icon" src="../assets/icons/interface/br-cross-small.svg" alt="cross" @click="removeTag(tag)">
            </span>

            <NewTag @newTag="tag => { tags.push(tag); }"></NewTag>
        </div>
    </div>
</template>

<script setup>
import { keys } from '../copilot/writer';

import NewTag from './NewTag.vue';
import secretary from '../copilot/secretary';
import { useNostrStore } from '../clients/nostr';
import { useToast } from 'vue-toastification';
</script>

<script>

export default {
    data() {
        return {
            title: "",
            tags: [],
            updating: false,
            nostr: useNostrStore(),
            toast: useToast()
        };
    },
    expose: ['create'],
    methods: {
        updateTags() {
            this.updating = true;
            this.tags = [];
            keys(this.title, navigator.language).then((keys) => {
                for (let key of keys) {
                    this.tags.push(key);
                }
                this.updating = false;
            });
        },
        removeTag(tag) {
            this.tags.splice(this.tags.indexOf(tag), 1);
        },
        async create() {
            return await this.nostr.publish(
                secretary.createEvent(this.title, this.tags),
                this.nostr.sk,
                () => { },
                () => { /* failed */ }
            );
        }
    }
}

</script>

<style>
@import url(../assets/css/NewEvent.css);
</style>