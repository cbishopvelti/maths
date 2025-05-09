// config-overrides.js
const { override, addWebpackModuleRule } = require('customize-cra');
const path = require('path');

module.exports = override(
  // Add the purs-loader for .purs files
  addWebpackModuleRule({ // Doesnt work :()
    test: /\.purs$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'purs-loader',
        options: {
          spago: true, // Use spago as the build tool
          watch: true, // process.env.NODE_ENV === 'development',
          // Optional: If your PureScript sources are not in default locations spago expects
          src: ['purs/**/*.purs', '.spago/*/*/src/**/*.purs'], // Adjust if needed
          output: 'output', // Default output directory for compiled JS
          // psc: "spago build",
        },
      },
    ],
  }), (config) => {
    // const isEnvDevelopment = config.mode === 'development';
    // const isEnvProduction = config.mode === 'production';

    // The 'output' directory for PureScript, resolved to an absolute path
    const pursOutputDir = path.resolve(__dirname, 'output');
    config.resolve.modules = [...(config.resolve.modules || []), pursOutputDir];
    return config;
  }
  // You can add other overrides here if needed
);
