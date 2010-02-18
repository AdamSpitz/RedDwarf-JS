Orbited.TCPSocket.prototype.writeByte = function writeByte(b) {
  this.writeBytes(String.fromCharCode(b));
};

Orbited.TCPSocket.prototype.writeShort = function writeShort(s) {
  this.writeBytes(String.fromCharCode((s >> 8) & 255, s & 255));
};

Orbited.TCPSocket.prototype.writeUTF = function writeUTF(str) {
  this.writeShort(str.length);
  this.writeBytes(str);
};

Orbited.TCPSocket.prototype.writeBytes = function(str) {
  this.send(str);
};
