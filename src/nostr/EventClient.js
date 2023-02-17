import { useSelector } from "react-redux";
import { System } from "nostr/NostrSystem";
import NostrEvent from "nostr/NostrEvent";
import { DefaultRelays } from "nostr/Const";

let isNip07Busy = false;

const delay = (t) => {
  return new Promise(resolve => {
    setTimeout(resolve, t);
  });
};

export const barrierNip07 = async (then) => {
  while (isNip07Busy) {
    await delay(10);
  }
  isNip07Busy = true;
  try {
    return await then();
  } finally {
    isNip07Busy = false;
  }
};

const EventClient = () => {
  const pubKey = useSelector(s => s.login.publicKey);
  const privKey = useSelector(s => s.login.privateKey);
  const hasNip07 = "nostr" in window;

  return {
    signEvent: async (ev) => {
      if (hasNip07 && !privKey) {
        ev.Id = await ev.CreateId();
        const tmpEv = (await barrierNip07(() => window.nostr.signEvent(ev.ToObject())));
        return new NostrEvent(tmpEv);
      } else if (privKey) {
        await ev.Sign(privKey);
      } else {
        console.warn("Count not sign event, no private keys available");
      }
      return ev;
    },
    broadcast: (ev) => {
      if (ev) {
        console.debug("Sending event: ", ev);
        System.BroadcastEvent(ev);
      }
    },
    broadcastForBootstrap: (ev) => {
      if (ev) {
        for (const [k] of DefaultRelays) {
          System.WriteOnceToRelay(k, ev);
        }
      }
    },
    broadcastAll: (ev, relays) => {
      if (ev) {
        for (const k of relays) {
          System.WriteOnceToRelay(k, ev);
        }
      }
    },
  }
};

export default EventClient;
