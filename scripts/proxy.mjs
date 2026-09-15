import http from 'http';
import https from 'https';

const STAGING_BACKEND_HOST = 'uni-ooi-giga-maps-backend-stg.azurewebsites.net';
const PORT = process.env.PROXY_PORT || 8081;

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const server = http.createServer((clientReq, clientRes) => {
  const origin = clientReq.headers.origin || '*';
  const reqHeaders = clientReq.headers['access-control-request-headers'] || '*';

  clientRes.setHeader('Access-Control-Allow-Origin', origin);
  clientRes.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD'
  );
  clientRes.setHeader('Access-Control-Allow-Headers', reqHeaders);
  clientRes.setHeader('Access-Control-Allow-Credentials', 'true');

  if (clientReq.method === 'OPTIONS') {
    clientRes.writeHead(200);
    clientRes.end();
    return;
  }

  const headers = {
    ...clientReq.headers,
    host: STAGING_BACKEND_HOST,
    origin: `https://${STAGING_BACKEND_HOST}`,
    referer: `https://${STAGING_BACKEND_HOST}/`,
  };

  const proxyReq = https.request(
    {
      host: STAGING_BACKEND_HOST,
      port: 443,
      path: clientReq.url,
      method: clientReq.method,
      headers,
      agent: httpsAgent,
    },
    (proxyRes) => {
      const responseHeaders = { ...proxyRes.headers };
      responseHeaders['access-control-allow-origin'] = origin;
      responseHeaders['access-control-allow-methods'] =
        'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD';
      responseHeaders['access-control-allow-headers'] = reqHeaders;
      responseHeaders['access-control-allow-credentials'] = 'true';

      clientRes.writeHead(proxyRes.statusCode || 200, responseHeaders);
      proxyRes.pipe(clientRes, { end: true });
    }
  );

  proxyReq.on('error', (err) => {
    console.error(`[Proxy Error] ${clientReq.method} ${clientReq.url}:`, err.message);
    if (!clientRes.headersSent) {
      clientRes.writeHead(502, { 'Content-Type': 'application/json' });
    }
    clientRes.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
  });

  clientReq.pipe(proxyReq, { end: true });
});

server.listen(PORT, () => {
  console.log(`[Proxy] Listening on http://localhost:${PORT}/ -> https://${STAGING_BACKEND_HOST}`);
});
