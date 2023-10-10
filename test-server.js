import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({ noServer: true });
const wssBroad = new WebSocketServer({ noServer: true });

app.use('/connect', (req, res) => {
  res.send(`you are connected to HTTP server on port ${PORT}`);
});

const server = app.listen(PORT, () => {
  console.log(`server is up on port ${PORT} ...`);
});

server.on('upgrade', function upgrade(req, socket, head) {
  const path = req.url;
  if (path === '/ws') {
    wss.handleUpgrade(req, socket, head, function done(ws) {
      wss.emit('connection', ws, req);
    });
  } else if (path === '/broadcast') {
    wssBroad.handleUpgrade(req, socket, head, function done(ws) {
      wssBroad.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', function connection(ws, req) {
  ws.on('message', function message(data) {
    console.log(req.url);
    console.log('received: %s', data);
  });

  ws.send('something');
});

wssBroad.on('connection', function connection(ws, req) {
  ws.on('message', function message(data, isBinary) {
    wssBroad.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  ws.send('some other thing');
});

// function connectWSS() {
//   return new Promise((resolve, reject) => {
//     wss.on('connection', function connection(ws) {
//       resolve(ws);
//     });

//     wss.on('error', function error(err) {
//       reject(err);
//     });
//   });
// }
