(function() {

RedDwarf.MessageFilter = function MessageFilter() {
  this._messageBuffer = new RedDwarf.ByteArray();
};

RedDwarf.MessageFilter.prototype.receive = function receive(msg, client) {
  // Stuff any new bytes into the buffer
  this._messageBuffer.writeBytes(msg);
  this._messageBuffer.setPosition(0);

  while (this._messageBuffer.bytesAvailable() > 2)
  {
    // The protocol says the number shouldn't include the two bytes for the length, but
    // I seem to be getting a 0 17 followed by 15 more bytes. So I'm confused, but maybe
    // the documentation is just wrong.
    var payloadLength = this._messageBuffer.readShort();

    if (this._messageBuffer.bytesAvailable() >= payloadLength) {
      var newMessage = new RedDwarf.ByteArray();
      this.onRawMessage(this._messageBuffer.readBytes(payloadLength));
    } else {
      // Roll back the length we read
      this._messageBuffer.setPosition(this._messageBuffer.position() - 2);
      break;
    }
  }

  var newBuffer = new RedDwarf.ByteArray(this._messageBuffer.readRemainingBytes());
  this._messageBuffer = newBuffer;
}

RedDwarf.MessageFilter.prototype.onRawMessage = function onRawMessage(msg) {
  // Overwrite this if you want.
};


})();
