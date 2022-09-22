const {
    createProxyMiddleware
} = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        // 请求前缀带斜线，带此前缀就会走代理服务器
        '/vips-mobile',
        createProxyMiddleware({
            target: 'https://mapi-rp.vip.com', //配置真正要访问的url
            changeOrigin: true,//说谎,对方什么端口号，我就什么端口号
        })
    );
};