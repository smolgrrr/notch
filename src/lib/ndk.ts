import NDK from '@nostr-dev-kit/ndk';

const ndk = new NDK({
    explicitRelayUrls: ['wss://relay.damus.io', 'wss://nos.lol']
});

export default ndk;