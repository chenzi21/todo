const { createServer } = require('https')
const { createServer: createHTTPServer } = require('http')
const { readFileSync } = require('fs')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();


const port = process.env.PORT || 80;

const httpsOptions = {
    key: readFileSync(process.env.SSL_KEY_PATH),
    cert: readFileSync(process.env.SSL_CERT_PATH),
};

const HTTPS_SERVER = createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
})

const HTTP_SERVER = createHTTPServer((req, res) => {
    res.writeHead(301, { Location: new URL(req.url, "https://" + req.headers.host) })
    return res.end()
})

app.prepare().then(() => {
    HTTPS_SERVER
        .listen(443)
    HTTP_SERVER.listen(port)
});