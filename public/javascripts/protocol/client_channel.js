function ClientChannel(name, rawId) {
  this._name = name;
  this._rawIdBytes = rawId;
  this._idNumber = ClientChannel.bytesToChannelId(rawId);
}

(function() {
ClientChannel.prototype.name       = function name      () { return this._name;       };
ClientChannel.prototype.uniqueId   = function uniqueId  () { return this._idNumber;   };
ClientChannel.prototype.rawIdBytes = function rawIdBytes() { return this._rawIdBytes; };
ClientChannel.prototype.toString   = function toString  () { return this._name;       };

ClientChannel.bytesToChannelId = function bytesToChannelId(buf) {
  var result = 0;
  var shift = (buf.length - 1) * 8;
  for (var i = 0, n = buf.length; i < n; ++i) {
    var b = buf.charCodeAt(i);
    result += (b & 255) << shift;
    shift -= 8;
  }
  return result;
};
})();
