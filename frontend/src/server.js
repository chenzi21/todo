const { createServer } = require('https')
const { createServer: createHTTPServer } = require('http')
const { readFileSync } = require('fs')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const privateKeyPath = "certificates/localhost-key.pem";
const certificatePath = "certificates/localhost.pem";

const port = process.env.PORT || 80;

const httpsOptions = {
    key: readFileSync(privateKeyPath),
    cert: readFileSync(certificatePath),
};

const HTTPS_SERVER = createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
})

const HTTP_SERVER = createHTTPServer((req, res) => {
    console.log("lol")
    res.writeHead(301, { Location: new URL(req.url, "https://" + req.headers.host) })
    return res.end()
})

app.prepare().then(() => {
    HTTPS_SERVER
        .listen(443)
    HTTP_SERVER.listen(port)
});