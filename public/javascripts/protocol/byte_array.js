function ByteArray(bytes) {
  this._strings = bytes ? [bytes] : [];
  this._position = 0;
  this._cachedString = null;
}

(function() {

ByteArray.prototype.writeByte = function writeByte(b) {
  this.writeBytes(String.fromCharCode(b));
};

ByteArray.prototype.writeShort = function writeShort(s) {
  this.writeBytes(String.fromCharCode((s >> 8) & 255, s & 255));
};

ByteArray.prototype.writeUTF = function writeUTF(str) {
  this.writeShort(str.length);
  this.writeBytes(str);
};

ByteArray.prototype.writeBytes = function writeBytes(str) {
  this._strings.push(str);
  this._position += str.length;
  this._cachedString = null;
};

ByteArray.prototype.toString = function toString() {
  if (this._cachedString == null) {
    this._cachedString = this._strings.join("");
  }
  return this._cachedString;
};

ByteArray.prototype.size = function size() {
  return this.toString().length;
};

ByteArray.prototype.position = function position() {
  return this._position;
};

ByteArray.prototype.setPosition = function setPosition(pos) {
  this._position = pos;
};

ByteArray.prototype.bytesAvailable = function bytesAvailable() {
  return this.size() - this._position;
};

ByteArray.prototype.readByte = function readByte() {
  return this.toString().charCodeAt(this._position++);
};

ByteArray.prototype.readSgsString = function readSgsString() {
  var stringLength = this.readShort();
  return this.readBytes(stringLength);
};

ByteArray.prototype.readShort = function readShort() {
  return (this.readByte() << 8) + this.readByte();
};

ByteArray.prototype.readInt = function readInt() {
  return (this.readByte() << 24) + (this.readByte() << 16) + (this.readByte() << 8) + this.readByte();
};

ByteArray.prototype.readRemainingBytes = function readRemainingBytes() {
  return this.readBytes(this.bytesAvailable());
};

ByteArray.prototype.readBytes = function readBytes(length) {
  return this.toString().substring(this._position, this._position += length);
};

})();
