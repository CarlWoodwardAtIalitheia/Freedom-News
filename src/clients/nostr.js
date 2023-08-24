import { relayInit } from 'nostr-tools';
import { defineStore } from 'pinia';

import { generatePrivateKey, getPublicKey, getEventHash, getSignature } from 'nostr-tools';

export const useNostrStore = defineStore('nostr', {
    state: () => ({ relays: {}, available: false, urls: {}, sk: '', rr: '' }),
    actions: {
        establishConnection(callback) {
            for (let name in this.urls) {
                let url = this.urls[name];
                let relay = new Relay(name, url);
                this.relays[name] = relay;
                relay.connect(
                    callback,
                    this);
            }
        },
        setRelayStatus(name, status) {
            this.relays[name].status = status;
        },
        addRelay(name, url, beTop = false) {
            if (!beTop) {
                this.urls[name] = url;
                this.relays[name] = new Relay(name, url);
            } else {
                this.urls = { [name]: url, ...this.urls };
                this.relays = { [name]: new Relay(name, url), ...this.relays };
            }
            return this.relays[name];
        },
        async publish(event, sk, okCallback, failedCallback) {
            event.pubkey = getPublicKey(sk);
            event.id = getEventHash(event);
            event.sig = getSignature(event, sk);
            for (let name in this.relays) {
                await this.relays[name].publish(event, okCallback, failedCallback);
            }
            return event;
        },
        get(filter, callback, recommendRelay = '') {
            for (let name in this.relays) {
                this.relays[name].get(filter).then((e) => { if (e) callback(e); });
            }
            if (recommendRelay && !(recommendRelay in this.urls)) {
                let relay = new Relay('TEMP', recommendRelay);
                relay.connect(() => { }, this);
                relay.get(filter).then((e) => { if (e) callback(e); });
            }
            return 'Getting...';
        },
        sub(filters, onEvent, onEose) {
            for (let name in this.relays) {
                let sub = this.relays[name].connection.sub(filters);
                sub.on('event', onEvent);
                sub.on('eose', onEose);
            }
        }
    }
});

export class Relay {
    constructor(name, url) {
        this.name = name;
        this.url = url;
        this.status = -2;
        this.connection = relayInit(url);
    }
    connect(callback, nostr) {
        this.connection.on('connect', () => {
            nostr.setRelayStatus(this.name, 1);
            nostr.available = true;
            callback(this.name, 1);
        });
        this.connection.on('error', () => {
            nostr.setRelayStatus(this.name, -1);
            callback(this.name, -1);
        });
        nostr.setRelayStatus(this.name, 0);
        callback(this.name, 0);
        this.connection.connect();
    }
    publish(event, okCallback, failedCallback) {
        let pub = this.connection.publish(event);
        pub.on('ok', () => { okCallback(this.name, this.url); });
        pub.on('failed', (reason) => { failedCallback(this.name, this.url, reason); });
    }
    async get(filter) {
        return await this.connection.get(filter);
    }
};