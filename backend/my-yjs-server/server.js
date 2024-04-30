const http = require('http');
const ws = require('ws');
const wss = new ws.Server({ noServer: true });

const server = http.createServer((req, res) => {
  // your server code here
});

wss.on('connection', ws => {
  // your websocket code here
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
});

server.listen(1234);
