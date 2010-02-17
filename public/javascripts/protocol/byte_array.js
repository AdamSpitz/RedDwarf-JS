function ByteArray(bytes) {
  this._buffer = new StringBuffer(bytes || "");
  this._position = 0;
  this._cachedString = null;
}

(function() {
Object.extend(ByteArray.prototype,  ReadStream);
Object.extend(ByteArray.prototype, WriteStream);

ByteArray.prototype.writeBytes = function writeBytes(str) {
  this._buffer.append(str);
  this._position += str.length;
  this._cachedString = null;
};

ByteArray.prototype.toString = function toString() {
  if (this._cachedString == null) {
    this._cachedString = this._buffer.toString();
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

ByteArray.prototype.readBytes = function readBytes(length) {
  return this.toString().substring(this._position, this._position += length);
};

})();
