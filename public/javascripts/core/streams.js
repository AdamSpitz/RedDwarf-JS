ReadStream = {

  readShort: function readShort() {
    return (this.readByte() << 8) + this.readByte();
  },

  readInt: function readInt() {
    return (this.readByte() << 24) + (this.readByte() << 16) + (this.readByte() << 8) + this.readByte();
  },

  readRemainingBytes: function readRemainingBytes() {
    return this.readBytes(this.bytesAvailable());
  },
};

WriteStream = {
  writeByte: function writeByte(b) {
    this.writeBytes(String.fromCharCode(b));
  },

  writeShort: function writeShort(s) {
    this.writeBytes(String.fromCharCode((s >> 8) & 255, s & 255));
  },

  writeUTF: function writeUTF(str) {
    this.writeShort(str.length);
    this.writeBytes(str);
  },
};
