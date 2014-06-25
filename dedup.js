var PORTS = [40002, 40003];
var TARGET = ["127.0.0.1", 40004];
var N = 30000;

function dist(a,b)
{
  return a != b && ((a - b + N) % N) < N / 4;
}

var dgram = require('dgram');
var client = dgram.createSocket("udp4");
var value = 0;

var servers = PORTS.map(function(port){
  var server = dgram.createSocket('udp4');
  server.on("message", function (message, rinfo) {
    var v = message.readUInt16BE(0);
    if (message.length == 2)
      value = v;
    else if (dist(v, value))
    {
      value = v;
      client.send(message, 2, message.length - 2, TARGET[1], TARGET[0], function(err, bytes) {
	console.log("Got %d good bytes from %s, forwarded to %s", message.length, rinfo.address, TARGET.join(":"));
	if (err) throw err;
      });
    }
    else
      console.log("Dropped duplicate pkt from %s", rinfo.address);
  });
  server.on("error", function (err) {
    console.log("server error:\n" + err.stack);
    throw err;
  });
  server.bind(port);
  return server;
});

console.log("Server is ready, ports = %s, sending to %s.", PORTS, TARGET.join(":"));

