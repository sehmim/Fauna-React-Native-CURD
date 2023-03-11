const { getDefaultConfig } = require('metro-config');
const path = require('path');
const defaultConfig = getDefaultConfig.getDefaultValues(__dirname);

module.exports = {
  ...defaultConfig,
  resolver: {
    sourceExts: ['jsx', 'js', 'ts', 'tsx'],
    extraNodeModules: new Proxy(
      {
        'react-native-config': require.resolve('react-native-config'),
      },
      {
        get: (target, name) =>
          name in target
            ? target[name]
            : require.resolve(`node_modules/${name}`),
      }
    ),
  },
  watchFolders: [
    // Make sure react-native-config is included as a watch folder
    path.resolve(__dirname, 'node_modules', 'react-native-config'),
  ],
};