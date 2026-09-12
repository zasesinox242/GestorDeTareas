module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // 'react-native-worklets/plugin' debe ir SIEMPRE al final de la lista:
    // permite que las animaciones de Reanimated corran en el hilo de UI.
    plugins: ["react-native-worklets/plugin"],
  };
};
