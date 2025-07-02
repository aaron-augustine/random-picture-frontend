const FaroSourceMapUploaderPlugin = require('@grafana/faro-webpack-plugin');


module.exports = function override(config, env) {
    if (env === 'production') {
        if (!config.plugins) {
            config.plugins = [];
        }
        config.optimization.minimize = false;
        config.optimization.moduleIds = 'named';  // ← replaces namedModules
        config.optimization.chunkIds = 'named';  // ← replaces namedChunks

        // Add Faro Source Map Uploader Plugin only for production builds
        // use FARO_API_KEY from environment
        const apiKey = process.env.FARO_API_KEY;
        config.plugins.push(
            new FaroSourceMapUploaderPlugin({
                appName: 'Random-Picture-Frontend',
                endpoint: 'https://faro-api-prod-us-east-2.grafana.net/faro/api/v1',
                appId: '414',
                stackId: '1273903',
                apiKey,
                skipUpload: !apiKey,
                verbose: true,
                gzipContents: false
            })
        );
        if (!apiKey) {
            console.warn('FARO_API_KEY not set; source map upload will be skipped');
        }
    }

    return config;
};