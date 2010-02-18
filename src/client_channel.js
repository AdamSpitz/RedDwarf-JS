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

RedDwarf.ClientChannel = function ClientChannel(name, rawId) {
  this._name = name;
  this._rawIdBytes = rawId;
  this._idNumber = RedDwarf.ClientChannel.bytesToChannelId(rawId);
}

RedDwarf.ClientChannel.prototype.name       = function name      () { return this._name;       };
RedDwarf.ClientChannel.prototype.id         = function id        () { return this._idNumber;   };
RedDwarf.ClientChannel.prototype.uniqueId   = function uniqueId  () { return this._idNumber;   };
RedDwarf.ClientChannel.prototype.rawIdBytes = function rawIdBytes() { return this._rawIdBytes; };
RedDwarf.ClientChannel.prototype.toString   = function toString  () { return this._name;       };

RedDwarf.ClientChannel.bytesToChannelId = function bytesToChannelId(buf) {
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
