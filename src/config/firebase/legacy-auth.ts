import AsyncStorage from "@react-native-async-storage/async-storage";

const LEGACY_AUTH_KEYS = ["@auth/users", "@auth/session"];
let cleanupPromise: Promise<void> | undefined;

export const clearLegacyAuthStorage = (): Promise<void> => {
  cleanupPromise ??= AsyncStorage.multiRemove(LEGACY_AUTH_KEYS);
  return cleanupPromise;
};
