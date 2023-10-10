import os from 'node:os';
import WebSocket from 'ws';

export const systemInfo = function (ws) {
  return function (data) {
    const mac = JSON.stringify(os.networkInterfaces()['enp5s0'][0]['mac']);
    ws.send(`${os.platform()}-${os.machine()}-${mac}-${os.arch()}`);
    console.log(data);
    //   ws.emit('test', 'apple');
  };
};

export const broadcast = function (wss, ws) {
  return function (data, isBinary) {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  };
};
