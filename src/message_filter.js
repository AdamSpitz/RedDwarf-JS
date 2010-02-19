/*
http://www.opensource.org/licenses/mit-license.php

Copyright (c) 2010 Adam Spitz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

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
      this.onRawMessage(this._messageBuffer.readBytes(payloadLength));
    } else {
      // Roll back the length we read
      this._messageBuffer.setPosition(this._messageBuffer.position() - 2);
      break;
    }
  }

  var newBuffer = new RedDwarf.ByteArray(this._messageBuffer.readRemainingBytes());
  this._messageBuffer = newBuffer;
};

RedDwarf.MessageFilter.prototype.onRawMessage = function onRawMessage(msg) {
  // Overwrite this if you want.
};


})();
