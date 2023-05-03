import { Button } from '../ui';
import { useEffect, useState } from 'react';
import {
    nip57,
    nip19,
    Event,
    generatePrivateKey,
    finishEvent,
    getEventHash
  } from "nostr-tools";
import { getStoredPubkey } from '@/lib/user';
import { relayUrls } from '@/consts/consts';

// based on https://github.com/nbd-wtf/nostr-tools/blob/master/nip57.ts
export async function createZap(amount: number, metadata: Event) {
    const endpoint = await nip57.getZapEndpoint(metadata)
    await window.webln.enable();

    if (!endpoint) {
        return 'No zap endpoint found';
    }

    // const zapRequest = await nip57.makeZapRequest({
    //   profile: '8f44c56131b362668b0e01be8c71b24786598bb68fb909cfd78fabfb058dd0f0',
    //   event: 'ca18c387dc0e79239c74962ae883944d846a8866b17e90d6899dab6a6469f8e9',
    //   amount: 100,  // Replace 100 with the amount you want to zap
    //   comment: '',  // Replace with your own comment
    //   relays: relayUrls,  // Add any relays you want to use
    // });

    const zapRequest: Event = {
      id: 'null',
      kind: 9734,
      content: '',
      tags: [
        ['e', 'ca18c387dc0e79239c74962ae883944d846a8866b17e90d6899dab6a6469f8e9'],
        ['p', '8f44c56131b362668b0e01be8c71b24786598bb68fb909cfd78fabfb058dd0f0'],
        ['amount', amount.toString()],
        ["relays", ...relayUrls],
      ],
      created_at: Math.round(Date.now() / 1000),
      pubkey: getStoredPubkey() as string,
      sig: 'null',
    };
    zapRequest.id = getEventHash(zapRequest);

    if (window.nostr) {
      zapRequest.sig = (await window.nostr.signEvent(zapRequest)).sig;
    }

    const validationResult = nip57.validateZapRequest(JSON.stringify(zapRequest));
    if (validationResult !== null) {
      return `Zap request invalid: ${validationResult}`;
    }
    
    const response = await fetch(`${endpoint}?` + new URLSearchParams({
            amount: amount.toString(),
            nostr: JSON.stringify(zapRequest),
        })
    );
    const body = await response.json();
    if (body.error) {
        return body.error;
    }

    return body.pr;
}

type ZapButtonProps = {
  metadata?: Event,
}

const ZapButton = ({metadata}: ZapButtonProps) => {
    const [zapRequest, setZapRequest] = useState<string | null>(null);

    const onClick = async () => {
        createZap(50 * 1000, metadata as Event).then(result => {
          setZapRequest(result);
          console.log('Invoice: ' + result);
          window.webln.sendPayment(result)
        }).catch(error => {
            alert('Zap failed with error: ' + error);
            return;
        });
    }

    return (
        <>
            <Button variant='subtle' onClick={onClick}>Zap Badge</Button>
        </>
    )
}

export default ZapButton;