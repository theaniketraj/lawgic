import localforage from "localforage";

localforage.config({
  name: "lawgic-db",
  version: 1.0,
  storeName: "lawgic_store",
  description: 'Local storage for LAWgic Assistant'
});

export const db = {
  // Chat Sessions Storage (metadata for chats)
  chats: localforage.createInstance({
    name: 'lawgic-db',
    storeName: 'chatSessions'
  }),
  
  // Chat History List (quick preview metadata)
  history: localforage.createInstance({
    name: 'lawgic-db',
    storeName: 'chatHistoryList'
  }),

  // Global Settings Storage
  settings: localforage.createInstance({
    name: 'lawgic-db',
    storeName: 'userSettings'
  }),
  
  // Usage Stats Storage
  stats: localforage.createInstance({
    name: 'lawgic-db',
    storeName: 'usageStats'
  })
};
