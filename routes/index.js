export const routes = function (ws) {
  return function (req, socket, head) {
    const path = req.url;

    //====================================
    //====== BETTER IN PERFORMANCE =======
    //====================================
    /*
     if (path === '/ws') {
       ws[0].handleUpgrade(req, socket, head, function done(ws) {
         wss.emit('connection', ws, req);
       });
     } else if (path === '/broadcast') {
       ws[1].handleUpgrade(req, socket, head, function done(ws) {
         wssBroad.emit('connection', ws, req);
       });
     } else {
       socket.destroy();
     }

     */

    //===================================
    //====== BETTER IN CLEAN CODE =======
    //===================================
    for (let [k, v] of Object.entries(ws)) {
      if (path === k) {
        v.handleUpgrade(req, socket, head, function done(ws) {
          v.emit('connection', ws, req);
        });
        return;
      }
    }
    socket.destroy();
  };
};
