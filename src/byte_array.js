(function() {

RedDwarf.ByteArray = function ByteArray(bytes) {
  this._strings = bytes ? [bytes] : [];
  this._position = 0;
  this._cachedString = null;
};

RedDwarf.ByteArray.prototype.writeByte = function writeByte(b) {
  this.writeBytes(String.fromCharCode(b));
};

RedDwarf.ByteArray.prototype.writeShort = function writeShort(s) {
  this.writeBytes(String.fromCharCode((s >> 8) & 255, s & 255));
};

RedDwarf.ByteArray.prototype.writeUTF = function writeUTF(str) {
  this.writeShort(str.length);
  this.writeBytes(str);
};

RedDwarf.ByteArray.prototype.writeBytes = function writeBytes(str) {
  this._strings.push(str);
  this._position += str.length;
  this._cachedString = null;
};

RedDwarf.ByteArray.prototype.toString = function toString() {
  if (this._cachedString == null) {
    this._cachedString = this._strings.join("");
  }
  return this._cachedString;
};

RedDwarf.ByteArray.prototype.size = function size() {
  return this.toString().length;
};

RedDwarf.ByteArray.prototype.position = function position() {
  return this._position;
};

RedDwarf.ByteArray.prototype.setPosition = function setPosition(pos) {
  this._position = pos;
};

RedDwarf.ByteArray.prototype.bytesAvailable = function bytesAvailable() {
  return this.size() - this._position;
};

RedDwarf.ByteArray.prototype.readByte = function readByte() {
  return this.toString().charCodeAt(this._position++);
};

RedDwarf.ByteArray.prototype.readSgsString = function readSgsString() {
  var stringLength = this.readShort();
  return this.readBytes(stringLength);
};

RedDwarf.ByteArray.prototype.readShort = function readShort() {
  return (this.readByte() << 8) + this.readByte();
};

RedDwarf.ByteArray.prototype.readInt = function readInt() {
  return (this.readByte() << 24) + (this.readByte() << 16) + (this.readByte() << 8) + this.readByte();
};

RedDwarf.ByteArray.prototype.readRemainingBytes = function readRemainingBytes() {
  return this.readBytes(this.bytesAvailable());
};

RedDwarf.ByteArray.prototype.readBytes = function readBytes(length) {
  return this.toString().substring(this._position, this._position += length);
};

})();
