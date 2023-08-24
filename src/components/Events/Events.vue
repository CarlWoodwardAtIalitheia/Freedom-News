<script setup>
import EventList from './EventList.vue';

import { nip19 } from 'nostr-tools';

import { db } from '../../db';
import { liveQuery } from 'dexie';
import { useObservable } from "@vueuse/rxjs";

import { useToast } from 'vue-toastification';

import { assert } from 'elliptic/lib/elliptic/utils';

</script>

<script>
export default {
    data() {
        return {
            following: useObservable(
                liveQuery(() => db.followedEvents.toArray())
            ),
            note: '',
            toast: useToast()
        };
    },
    methods: {
        pasteNote() {
            navigator.clipboard.readText().then(text => {
                this.note = text;
                this.followEvent();
            });
        },
        convertToHex() {
            if (!this.note) return false;
            try {
                let { type, data: hex } = nip19.decode(this.note);
                assert(type == 'note');
                return hex;
            } catch (e) {
                this.toast.error(this.$t('events.checkEventId'));
                return false;
            }
        },
        async followEvent() {
            let hex = this.convertToHex();
            if (!hex) return false;

            await db.followedEvents.add({
                eventId: hex
            });
        }
    }
};
</script>

<template>
    <div class="events">
        <Teleport to=".dashboard">
            <div class="follow-panel">
                <input type="text" :placeholder="$t('events.notePlaceholder')" v-model="note" @blur="followEvent">
                <img src="../../assets/icons/interface/sr-paste.svg" alt="Paste" class="icon paste" @click="pasteNote">
            </div>
        </Teleport>
        <EventList :ids="(following || []).map(v => v.eventId)">{{ $t('events.following') }}</EventList>
        <div class="prompt">
            <span>{{ $t('events.prompt') }}</span>
        </div>
        <!-- <EventList :ids="foryou">{{ $t('events.foryou') }}</EventList> -->
    </div>
</template>

<style>
@import url(../../assets/css/Events/Events.css);
</style>