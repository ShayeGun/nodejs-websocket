import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;
const wss = new WebSocketServer({ noServer: true });
const wssBroad = new WebSocketServer({ noServer: true });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data, isBinary) {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  ws.send('you are connected to Shynance');
});

wssBroad.on('connection', function connection(ws, req) {
  ws.on('message', function message(data, isBinary) {
    wssBroad.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  ws.send('you are connected to Shynance broadcast');
});

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
