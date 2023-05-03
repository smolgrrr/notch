

export function getStoredPubkey() {
    const storedNostrObject = localStorage.getItem("hexPubkey");
  
    if (!storedNostrObject) return null;
    return JSON.parse(storedNostrObject);
  }

 export async function signEvent(event: Event) {
        if (window.nostr) {
            // @ts-expect-error it's there
            event = await window.nostr.signEvent(event);
            return event;
        }
        alert("No NIP-07 compatible extension found.");

    return null;
}