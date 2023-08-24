<script setup>
import { useToast } from 'vue-toastification';
import { useNostrStore } from '../clients/nostr';
import { useUIStore } from '../ui';
import { getPublicKey, nip19 } from 'nostr-tools';
import Timeline from './Timeline.vue';
import cdn from '../clients/cdn'

</script>

<template>
    <template v-if="profile">
        <div class="banner" @click="$refs.bannerInput.click"><img :src="profile.banner" alt="Banner"></div>
        <div class="panel">
            <div class="avatar" @click="$refs.avatarInput.click"><img :src="profile.picture" alt="Avatar"></div>
            <div class="name">
                <h1 @click="updateName">{{ profile.display_name }}</h1>
                <div class="credential">
                    <div class="npub">
                        <span>{{ $route.params.npub }}</span>
                    </div>
                    <img src="../assets/icons/interface/sr-copy.svg" alt="Copy" class="icon" @click="copyNpub">
                </div>
                <div class="credential" v-if="id == getPublicKey(nostr.sk)">
                    <div class="nsec">
                        <span>{{ showSk ? nip19.nsecEncode(nostr.sk) :
                            '***************************************************************' }}</span>
                    </div>
                    <img :src="showSk ? './src/assets/icons/interface/br-eye.svg' : './src/assets/icons/interface/br-eye-crossed.svg'"
                        alt="Show" class="icon show" @click="showSk = showSk ? false : true">
                    <img src="../assets/icons/interface/sr-copy.svg" alt="Copy" class="icon" @click="copyNsec">
                </div>
            </div>
        </div>
        <template v-if="id == getPublicKey(nostr.sk)">
            <input type="file" name="banner" id="banner" accept="image/*" ref="bannerInput" @change="updateProfile">
            <input type="file" name="avatar" id="avatar" accept="image/*" ref="avatarInput" @change="updateProfile">
        </template>
        <Timeline :updates="posts"></Timeline>
    </template>
</template>
<script>
export default {
    mounted() {
        this.ui.setDashboardHeight(0);
        this.nostr.get({ authors: [this.id], kinds: [0] }, (e) => {
            this.profile = { ...this.profile, ...JSON.parse(e.content) };
        });

        this.nostr.sub([{ authors: [this.id], kinds: [30023] }], (post) => {
            if (this.posts.map(post => post.id).includes(post.id)) return false;
            this.posts.push(post);
        }, () => { /* eose */ });

    },
    data() {
        return {
            id: nip19.decode(this.$route.params.npub).data,
            nostr: useNostrStore(),
            ui: useUIStore(),
            profile: {
                banner: './src/assets/images/banner.png',
                picture: './src/assets/images/avatar.png',
                display_name: 'Click To Update'
            },
            toast: useToast(),
            posts: [],
            showSk: false
        };
    },
    unmounted() {
        this.ui.setDashboardHeight(60);
    },
    methods: {
        copyNpub() {
            navigator.clipboard.writeText(this.$route.params.npub)
                .then(() => {
                    this.toast.success(this.$t('user.npubCopied'));
                })
                .catch(() => {
                    this.toast.error(this.$t('user.copyFailed'));
                });
        },
        copyNsec() {
            navigator.clipboard.writeText(nip19.nsecEncode(this.nostr.sk))
                .then(() => {
                    this.toast.success(this.$t('user.nsecCopied'));
                })
                .catch(() => {
                    this.toast.error(this.$t('user.copyFailed'));
                });
        },
        async updateProfile(event) {
            try {
                await cdn.upload(event.srcElement.files, async (status, res) => {
                    switch (status) {
                        case -1:
                            this.toast.error(this.$t('user.uploadFailed', { name: res.name, message: res.message }));
                            break;
                        case 1:
                            const uploadedFile = res.data[0];
                            if (!uploadedFile) {
                                this.toast.error(this.$t('editor.formatNotSupported'));
                                return false;
                            }
                            switch (event.srcElement.name) {
                                case 'banner':
                                    this.profile.banner = uploadedFile.url;
                                    break;
                                case 'avatar':
                                    this.profile.picture = uploadedFile.url;
                                    break;

                            }
                            break;
                    }
                });
            } catch (e) {
                // It seems that you didn't update any images. 
            }
            await this.nostr.publish({ content: JSON.stringify(this.profile), kind: 0, created_at: Math.floor(Date.now() / 1000), tags: [] }, this.nostr.sk, (name, url) => { this.toast.success(this.$t('user.updateSucceeded', { name: name, url: url })); }, () => { /* failed */ });
        },
        updateName() {
            if (this.id != getPublicKey(this.nostr.sk)) return false;
            let name = prompt(this.$t('user.newName'));
            if (!name) return false;
            this.profile.display_name = name;
            this.updateProfile();
        }
    }
};
</script>
<style scoped>
@import url(../assets/css/User.css);
</style>
