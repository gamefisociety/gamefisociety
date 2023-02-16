import { createSlice } from '@reduxjs/toolkit';
const NotificationsReadItem = "notifications-read";
const FollowList = "last-follows";

export const InitState = {
  follows: [],
  latestFollows: 0,
  tags: [],
  latestTags: 0,
  pinned: [],
  latestPinned: 0,
  bookmarked: [],
  latestBookmarked: 0,
  muted: [],
  blocked: [],
  latestMuted: 0,
  latestNotification: 0,
  readNotifications: new Date().getTime(),
  dms: [],
  dmInteraction: 0,
};

const SocietySlice = createSlice({
  name: "Society",
  initialState: InitState,
  reducers: {
    init: (state, action) => {
      // state.useDb = action.payload;
      // // notifications
      // const readNotif = parseInt(window.localStorage.getItem(NotificationsReadItem) ?? "0");
      // if (!isNaN(readNotif)) {
      //   state.readNotifications = readNotif;
      // }
      console.log('SocieSlice init', state.follows);
    },
    setFollows: (state, action) => {
      const { keys, createdAt } = action.payload;
      if (state.latestFollows > createdAt) {
        return;
      }

      const existing = new Set(state.follows);
      const update = Array.isArray(keys) ? keys : [keys];

      let changes = false;
      for (const pk of update.filter(a => a.length === 64)) {
        if (!existing.has(pk)) {
          existing.add(pk);
          changes = true;
        }
      }
      for (const pk of existing) {
        if (!update.includes(pk)) {
          existing.delete(pk);
          changes = true;
        }
      }

      if (changes) {
        state.follows = Array.from(existing);
        state.latestFollows = createdAt;
      }

      window.localStorage.setItem(FollowList, JSON.stringify(state.follows));
    },
    setTags(state, action) {
      const { createdAt, tags } = action.payload;
      if (createdAt >= state.latestTags) {
        const newTags = new Set([...tags]);
        state.tags = Array.from(newTags);
        state.latestTags = createdAt;
      }
    },
    setMuted(state, action) {
      const { createdAt, keys } = action.payload;
      if (createdAt >= state.latestMuted) {
        const muted = new Set([...keys]);
        state.muted = Array.from(muted);
        state.latestMuted = createdAt;
      }
    },
    setPinned(state, action) {
      const { createdAt, keys } = action.payload;
      if (createdAt >= state.latestPinned) {
        const pinned = new Set([...keys]);
        state.pinned = Array.from(pinned);
        state.latestPinned = createdAt;
      }
    },
    setBookmarked(state, action) {
      const { createdAt, keys } = action.payload;
      if (createdAt >= state.latestBookmarked) {
        const bookmarked = new Set([...keys]);
        state.bookmarked = Array.from(bookmarked);
        state.latestBookmarked = createdAt;
      }
    },
    setBlocked(state, action) {
      const { createdAt, keys } = action.payload;
      if (createdAt >= state.latestMuted) {
        const blocked = new Set([...keys]);
        state.blocked = Array.from(blocked);
        state.latestMuted = createdAt;
      }
    },
    addDirectMessage: (state, action) => {
      let n = action.payload;
      if (!Array.isArray(n)) {
        n = [n];
      }

      let didChange = false;
      for (const x of n) {
        if (!state.dms.some(a => a.id === x.id)) {
          state.dms.push(x);
          didChange = true;
        }
      }

      if (didChange) {
        state.dms = [...state.dms];
      }
    },
    incDmInteraction: state => {
      state.dmInteraction += 1;
    },
    markNotificationsRead: state => {
      state.readNotifications = Math.ceil(new Date().getTime() / 1000);
      window.localStorage.setItem(NotificationsReadItem, state.readNotifications.toString());
    },
    setLatestNotifications: (state, action) => {
      state.latestNotification = action.payload;
    },
  },
});

export const {
  init,
  setFollows,
  setTags,
  setMuted,
  setPinned,
  setBookmarked,
  setBlocked,
  addDirectMessage,
  incDmInteraction,
  markNotificationsRead,
  setLatestNotifications,
} = SocietySlice.actions;

export function sendNotification({
  title,
  body,
  icon,
  timestamp,
}) {
  return async (dispatch, getState) => {
    const state = getState();
    const { readNotifications } = state.login;
    const hasPermission = "Notification" in window && Notification.permission === "granted";
    const shouldShowNotification = hasPermission && timestamp > readNotifications;
    if (shouldShowNotification) {
      try {
        const worker = await navigator.serviceWorker.ready;
        worker.showNotification(title, {
          tag: "notification",
          vibrate: [500],
          body,
          icon,
          timestamp,
        });
      } catch (error) {
        console.warn(error);
      }
    }
  };
}

export default SocietySlice.reducer;
