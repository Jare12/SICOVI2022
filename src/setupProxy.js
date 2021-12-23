/** @format */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
	app.use(
		createProxyMiddleware('/DEV-WSCartaPorte/rest/service/verViajes', {
			target: 'https://tr01.gepp.com',
			changeOrigin: true,
		})
	);
	app.use(
		createProxyMiddleware(
			'/DEV-WSCartaPorte/rest/service/recepcionCartaPorte',
			{
				target: 'https://tr01.gepp.com',
				changeOrigin: true,
			}
		)
	);
	app.use(
		createProxyMiddleware('/WSCartaPorte/rest/service/verViajes', {
			target: 'https://tr01.gepp.com',
			changeOrigin: true,
		})
	);
	app.use(
		createProxyMiddleware('/WSCartaPorte/rest/service/recepcionCartaPorte', {
			target: 'https://tr01.gepp.com',
			changeOrigin: true,
		})
	);
};
