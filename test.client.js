import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:3001/ws', {
  // headers: { ['some_header']: 1234 },
});

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('client is connected to ...');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});
