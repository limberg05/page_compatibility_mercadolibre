module.exports = function override(config) {
  config.resolve.fallback = {
    crypto: require.resolve('crypto-browserify'), // Necesario
    stream: false, // No es necesario
    buffer: false, // No es necesario
    process: false, // Dejar a Webpack manejar process.env
  };

  return config;
};
