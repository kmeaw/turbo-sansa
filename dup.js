var PORT = 40001;
var TARGETS = ['127.0.0.1:40002', '127.0.0.1:40003'];
var N = 30000;
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var clients = TARGETS.map(function(){ return dgram.createSocket("udp4") });
var value = 0;
var id = new Buffer([0,0]);

function broadcast(message) {
  clients.forEach(function(client, idx) {
    var address = TARGETS[idx].split(":");
    console.log("Broadcasting %d bytes to %s", message.length, TARGETS[idx]);
    client.send(message, 0, message.length, parseInt(address[1]), address[0], function(err, bytes) {
      if (err) throw err;
    });
  });
}

server.on("error", function (err) {
  console.log("server error:\n" + err.stack);
  server.close();
});

broadcast(id);

server.on("message", function (msg, rinfo) {
  id.writeUInt16BE(value++, 0);
  value = value % N;
  var message = Buffer.concat([id, msg]);
  broadcast(message);
});

server.bind(PORT);
console.log("Server is ready, port = %d, sending to %s.", PORT, TARGETS);

