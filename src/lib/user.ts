import { NDKUserProfile } from "@nostr-dev-kit/ndk";
import ndk from "./ndk";

export async function getUserInfo(hexKey: string) {
    const pablo = ndk.getUser({
        hexpubkey: hexKey
    });
    await pablo.fetchProfile();
    
    console.log((pablo.profile as NDKUserProfile).name)
    return pablo.profile?.name;
}