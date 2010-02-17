Object.extend(Orbited.TCPSocket.prototype, WriteStream);

Orbited.TCPSocket.prototype.writeBytes = function(str) {
  this.send(str);
};

Orbited.TCPSocket.prototype.flush = function() {
  // does anything need to be done here?
};
