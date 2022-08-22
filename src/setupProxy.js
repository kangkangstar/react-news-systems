const {
    createProxyMiddleware
} = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/vips-mobile',
        createProxyMiddleware({
            target: 'https://mapi-rp.vip.com',
            changeOrigin: true,
        })
    );
};