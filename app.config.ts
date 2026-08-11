import type { ConfigContext, ExpoConfig } from "expo/config";

const GOOGLE_CLIENT_ID_SUFFIX = ".apps.googleusercontent.com";
const GOOGLE_PLUGIN = "react-native-nitro-google-signin";

const getIosUrlScheme = (): string | undefined => {
  const clientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID?.trim();
  if (!clientId) return undefined;

  if (!clientId.endsWith(GOOGLE_CLIENT_ID_SUFFIX)) {
    throw new Error(
      "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID debe terminar en .apps.googleusercontent.com",
    );
  }

  const clientPrefix = clientId.slice(0, -GOOGLE_CLIENT_ID_SUFFIX.length);
  return `com.googleusercontent.apps.${clientPrefix}`;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const plugins = [...(config.plugins ?? [])];
  const iosUrlScheme = getIosUrlScheme();
  const hasGooglePlugin = plugins.some(
    (plugin) =>
      plugin === GOOGLE_PLUGIN ||
      (Array.isArray(plugin) && plugin[0] === GOOGLE_PLUGIN),
  );

  if (iosUrlScheme && !hasGooglePlugin) {
    plugins.push([GOOGLE_PLUGIN, { iosUrlScheme }]);
  }

  return {
    ...config,
    name: config.name ?? "GestorDeTareas",
    slug: config.slug ?? "gestordetareas",
    plugins,
  };
};
