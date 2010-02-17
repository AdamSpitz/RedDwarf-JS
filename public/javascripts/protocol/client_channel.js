function ClientChannel(name, rawId) {
  this._name = name;
  this._rawIdBytes = rawId;
  this._idNumber = ClientChannel.bytesToChannelId(rawId);
}

ClientChannel.prototype.name       = function name      () { return this._name;       };
ClientChannel.prototype.idNumber   = function idNumber  () { return this._idNumber;   };
ClientChannel.prototype.rawIdBytes = function rawIdBytes() { return this._rawIdBytes; };

ClientChannel.bytesToChannelId = function bytesToChannelId(buf) {
  var rslt = 0;
  var shift = (buf.bytesAvailable - 1) * 8;
  for (var i = 0, n = buf.bytesAvailable; i <= n; ++i) {
    var bv = buf.readByte();
    rslt += (bv & 255) << shift;
    shift -= 8;
  }
  return rslt;
};
