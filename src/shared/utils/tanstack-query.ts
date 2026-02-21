import type { PersistedClient, Persister } from "@tanstack/react-query-persist-client";

// Only import idb-keyval if we're not in Brave browser
let idbKeyval: typeof import("idb-keyval") | null = null;

if (typeof navigator === "undefined" || !navigator.userAgent.includes("Brave")) {
  try {
    // Use dynamic import instead of require
    import("idb-keyval")
      .then((module) => {
        idbKeyval = module;
      })
      .catch((err) => {
        console.warn("[Storage] Failed to load idb-keyval:", err);
      });
  } catch (err) {
    console.warn("[Storage] Failed to load idb-keyval:", err);
  }
}

/**
 * Check if IndexedDB is available and accessible
 */
function isIndexedDBAvailable(): boolean {
  try {
    // Check if IndexedDB is supported
    if (typeof window === "undefined" || !window.indexedDB) {
      return false;
    }

    // For Brave and other privacy-focused browsers, we'll be more conservative
    // and assume IndexedDB might be blocked, so we'll rely on the actual
    // operations to determine availability
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all storage (both IndexedDB and localStorage)
 */
export async function clearAllStorage(): Promise<void> {
  try {
    // Clear IndexedDB if available
    if (isIndexedDBAvailable() && idbKeyval) {
      try {
        // Get all keys from IndexedDB
        const allKeys = await idbKeyval.keys();
        for (const key of allKeys) {
          if (typeof key === "string" && key.startsWith("turtle-query-")) {
            await idbKeyval.del(key);
          }
        }
      } catch (idbErr) {
        console.warn("[Storage] Failed to clear IndexedDB:", idbErr);
        // If IndexedDB fails, we'll just clear localStorage
      }
    }
  } catch (err) {
    console.warn("[Storage] IndexedDB not available:", err);
  }

  try {
    // Clear localStorage entries that start with our prefix
    const localStorageKeys = Object.keys(localStorage);
    for (const key of localStorageKeys) {
      if (key.startsWith("turtle-query-")) {
        localStorage.removeItem(key);
      }
    }
  } catch (err) {
    console.warn("[Storage] Failed to clear localStorage:", err);
  }
}

/**
 * Creates a localStorage-only persister for better compatibility with privacy-focused browsers
 */
function createLocalStoragePersister(idbValidKey: IDBValidKey = "reactQuery"): Persister {
  const localStorageKey = `turtle-query-${String(idbValidKey)}`;

  return {
    persistClient: async (client: PersistedClient) => {
      const json = JSON.stringify(client, (_, value) => {
        if (typeof value === "bigint") {
          return `${value.toString()}n`;
        }
        return value;
      });

      try {
        localStorage.setItem(localStorageKey, json);
      } catch (err) {
        console.warn("[localStorage] Failed to persist client:", err);
      }
    },
    async restoreClient() {
      try {
        const json = localStorage.getItem(localStorageKey) || undefined;
        if (!json) return undefined;

        const parsed = JSON.parse(json, (_, value) => {
          if (typeof value === "string" && value.match(/^\d+n$/) && !Number.isNaN(Number(value.slice(0, -1)))) {
            return BigInt(value.slice(0, -1));
          }
          return value;
        }) as PersistedClient;

        return parsed;
      } catch (err) {
        console.warn("[localStorage] Failed to restore client:", err);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        localStorage.removeItem(localStorageKey);
      } catch (err) {
        console.warn("[localStorage] Failed to remove client:", err);
      }
    },
  };
}

/**
 * Creates an Indexed DB persister with fallback to localStorage
 * @see https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
 */
export function createIDBPersister(idbValidKey: IDBValidKey = "reactQuery") {
  // For Brave and other privacy-focused browsers, use localStorage-only persister
  // to avoid IndexedDB issues
  if (typeof navigator !== "undefined" && navigator.userAgent.includes("Brave")) {
    return createLocalStoragePersister(idbValidKey);
  }

  const localStorageKey = `turtle-query-${String(idbValidKey)}`;
  let useIndexedDB = isIndexedDBAvailable();

  return {
    persistClient: async (client: PersistedClient) => {
      const json = JSON.stringify(client, (_, value) => {
        if (typeof value === "bigint") {
          return `${value.toString()}n`;
        }
        return value;
      });

      try {
        if (useIndexedDB) {
          await idbKeyval?.set(idbValidKey, json);
        } else {
          // Fallback to localStorage
          localStorage.setItem(localStorageKey, json);
        }
      } catch (err) {
        console.warn("[Storage] Failed to persist client:", err);
        // Disable IndexedDB for future operations if it fails
        useIndexedDB = false;
        // Try localStorage as fallback
        try {
          localStorage.setItem(localStorageKey, json);
        } catch (localStorageErr) {
          console.warn("[localStorage] Failed to persist client:", localStorageErr);
        }
      }
    },
    async restoreClient() {
      let json: string | undefined;

      try {
        if (useIndexedDB) {
          json = await idbKeyval?.get<string>(idbValidKey);
        } else {
          // Fallback to localStorage
          json = localStorage.getItem(localStorageKey) || undefined;
        }
      } catch (err) {
        console.warn("[Storage] Failed to restore client:", err);
        // Disable IndexedDB for future operations if it fails
        useIndexedDB = false;
        // Try localStorage as fallback
        try {
          json = localStorage.getItem(localStorageKey) || undefined;
        } catch (localStorageErr) {
          console.warn("[localStorage] Failed to restore client:", localStorageErr);
          return undefined;
        }
      }

      if (!json) return undefined;

      try {
        const parsed = JSON.parse(json, (_, value) => {
          if (typeof value === "string" && value.match(/^\d+n$/) && !Number.isNaN(Number(value.slice(0, -1)))) {
            return BigInt(value.slice(0, -1));
          }
          return value;
        }) as PersistedClient;

        return parsed;
      } catch (err) {
        console.error("Error parsing persisted client:", err);
        return undefined;
      }
    },
    removeClient: async () => {
      try {
        if (useIndexedDB) {
          await idbKeyval?.del(idbValidKey);
        } else {
          // Fallback to localStorage
          localStorage.removeItem(localStorageKey);
        }
      } catch (err) {
        console.warn("[Storage] Failed to remove client:", err);
        // Disable IndexedDB for future operations if it fails
        useIndexedDB = false;
        // Try localStorage as fallback
        try {
          localStorage.removeItem(localStorageKey);
        } catch (localStorageErr) {
          console.warn("[localStorage] Failed to remove client:", localStorageErr);
        }
      }
    },
  } as Persister;
}
