var PORT = 40001;
var TARGETS = ['127.0.0.1:40002', '127.0.0.1:40003'];
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var clients = TARGETS.map(function(){ return dgram.createSocket("udp4") });

server.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  server.close();
});
server.on("message", function (msg, rinfo) {
  clients.forEach(function(client, idx) {
    var address = TARGETS[idx].split(":");
    client.send(message, 0, message.length, parseInt(address[1]), address[0], function(err, bytes) {
      if (err) throw err;
    });
  });
});
server.bind(PORT);
console.log("Server is ready, port = %d, sending to %s.", PORT, TARGETS);

