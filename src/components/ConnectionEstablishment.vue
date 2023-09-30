<script setup>
import { useNostrStore } from '../clients/nostr';
import { nip19, getPublicKey, generatePrivateKey } from 'nostr-tools';

import Relay from '../components/Relay.vue';
import InfiniteLoading from "v3-infinite-loading";

import { useToast } from 'vue-toastification';
import { assert } from 'elliptic/lib/elliptic/utils';

import { db } from '../db';
</script>

<script>
export default {
    mounted() {
        this.nostr.$patch({
            urls: {
                // 'Soloco': 'wss://soloco.nl',
                // 'Nostr.mom': 'wss://nostr.mom',
                // 'Nostr.oxtr.dev': 'wss://nostr.oxtr.dev',
                // 'Nostr.bitcoiner.social': 'wss://nostr.bitcoiner.social',
                // 'Nostr.einundzwanzig.space': 'wss://nostr.einundzwanzig.space',
                // 'Nostr.cercatrova.me': 'wss://nostr.cercatrova.me',
                // 'Nostr.gruntwerk.org': 'wss://nostr.gruntwerk.org',
                // 'Nostr.sandwich.farm': 'wss://nostr.sandwich.farm',
                // 'Nostr.swiss-enigma.ch': 'wss://nostr.swiss-enigma.ch',
                // 'Nostr.screaminglife.io': 'wss://nostr.screaminglife.io',
                'Damus': 'wss://relay.damus.io',
                'nos.lol': 'wss://nos.lol',
                'Nostr.Band': 'wss://relay.nostr.band',
                'Relayable.org': 'wss://relayable.org'
            }

        });
        this.connect();
    },
    data() {
        return {
            nostr: useNostrStore(),
            endedAt: 1,
            onlineRelayURLs: [],
            sk: '',
            toast: useToast(),
            rr: ''
        };
    },
    computed: {
        available() {
            return this.nostr.available && this.nostr.sk;
        }
    },
    methods: {
        async connect() {
            this.nostr.establishConnection((name, status) => {
                if (status == 1) {
                    // this.$router.push(this.$route.fullPath);
                }
            });
            let credentials = await db.credentials.toArray();
            if (credentials.length > 0) {
                let credential = credentials[0];
                this.sk = credential.sk;
                this.convertToHex();
                this.rr = credential.rr;
                this.nostr.rr = credential.rr;
                this.recommendRelay();
            };
        },
        async load($state) {
            this.onlineRelayURLs = this.onlineRelayURLs.length ? this.onlineRelayURLs : await (await fetch('https://api.nostr.watch/v1/online')).json();
            if (this.endedAt + 15 < this.onlineRelayURLs.length) {
                for (let i = this.endedAt; i < this.endedAt + 15; i++) {
                    this.nostr.addRelay(`Unnamed${i}`, this.onlineRelayURLs[i]);
                }
                this.endedAt += 15;
            } else {
                $state.complete();
            }
        },
        pasteNsec() {
            navigator.clipboard.readText().then(text => { this.sk = text; this.convertToHex(); }).catch(() => { /* failed */ });
        },
        recommendRelay() {
            try {
                if (!this.rr) return false;
                this.nostr.addRelay(`Recommendation ${+new Date()}`, this.rr, true).connect((name, status) => {
                    if (status === 1) {
                        if (!this.nostr.rr) this.toast.success(this.$t('connectionEstablishment.succeeded', { rr: this.rr }));
                        this.nostr.rr = this.rr;
                    }
                    else if (status === 0) { }
                    else this.toast.error(this.$t('connectionEstablishment.failed', { rr: this.rr }));
                }, this.nostr);
            } catch (e) {
                this.toast.error(this.$t('connectionEstablishment.error', { rr: this.rr, e: e }));
            }
        },
        pasteRr() {
            navigator.clipboard.readText().then(text => {
                this.rr = text;
                this.recommendRelay();
            });
        },
        convertToHex() {
            if (!this.sk) return false;
            try {
                let { type, data: hex } = nip19.decode(this.sk);
                assert(type === 'nsec');
                this.nostr.sk = hex;
            } catch (e) {
                this.toast.error(this.$t('connectionEstablishment.invalidPrivateKey'));
                this.nostr.sk = '';
            }
        },
        async _continue() {
            window.nostr = this.nostr;
            if (!await db.credentials.where('sk').equals(this.sk).first()) {
                await db.credentials.add({
                    user: getPublicKey(this.nostr.sk),
                    sk: this.sk,
                    rr: this.nostr.rr
                });
            }
            this.$emit('continue');
        },
        createSecretKey() {
            this.sk = nip19.nsecEncode(generatePrivateKey());
            this.convertToHex();
            this.toast.success(this.$t('connectionEstablishment.welcome'));
        }
    }
};
</script>

<template>
    <div class="container">
        <h1>{{ nostr.available ?
            (nostr.sk ? $t('connectionEstablishment.available') : $t('connectionEstablishment.enterPrivateKey')) :
            $t('connectionEstablishment.connecting') }}
        </h1>
        <div class="credentials">
            <div class="secret-key credential">
                <input type="password" :placeholder="$t('connectionEstablishment.nsecPlaceholder')" id="nsecInput"
                    v-model="sk" @blur="convertToHex">
                <img src="../assets/icons/interface/sr-paste.svg" alt="Paste" class="icon paste" @click="pasteNsec">
            </div>
            <div class="credential">
                <button class="newcomer" @click="createSecretKey">{{ $t('connectionEstablishment.newcomer') }}</button>
            </div>
            <div class="recommend-relay credential">
                <input type="text" :placeholder="$t('connectionEstablishment.rrPlaceholder')" id="rrInput" v-model="rr"
                    @blur="recommendRelay">
                <img src="../assets/icons/interface/sr-paste.svg" alt="Paste" class="icon paste" @click="pasteRr">
            </div>
        </div>
        <h2>{{ $t('connectionEstablishment.relays') }}</h2>
        <hr>
        <ul>
            <Relay v-for="(url, name) in nostr.urls" :key="name" :name="name">{{ url }}</Relay>
        </ul>
        <InfiniteLoading @infinite="load">
            <template #spinner>
                <span class="hint">{{ $t('connectionEstablishment.loading') }}</span>
            </template>
            <template #complete>
                <span class="hint">{{ $t('connectionEstablishment.noMoreRelays') }}</span>
            </template>
            <template #error="{ load }">
                <span class="hint">{{ $t('connectionEstablishment.errorOccupied') }}<button
                        @click="load">Retry.</button></span>
            </template>
        </InfiniteLoading>
        <div class="continue" @click="_continue" v-show="available">
            {{ $t('connectionEstablishment.continue') }}
            <img src="../assets/icons/interface/sr-arrow-small-right.svg" alt="continue" class="icon">
        </div>
    </div>
</template>

<style scoped>
@import url(../assets/css/ConnectionEstablishment.css);
@import url(../assets/css/desktop/ConnectionEstablishment.css) screen and (min-width: 500px);
</style>