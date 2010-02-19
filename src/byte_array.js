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

RedDwarf.ByteArray = function(bytes) {
  this._strings = bytes ? [bytes] : [];
  this._position = 0;
  this._cachedString = null;
};

RedDwarf.extend(RedDwarf.ByteArray.prototype, {
  writeByte: function(b) {
    this.writeBytes(String.fromCharCode(b));
  },

  writeShort: function(s) {
    this.writeBytes(String.fromCharCode((s >> 8) & 255, s & 255));
  },

  writeUTF: function(str) {
    this.writeShort(str.length);
    this.writeBytes(str);
  },

  writeBytes: function(str) {
    this._strings.push(str);
    this._position += str.length;
    this._cachedString = null;
  },

  toString: function() {
    if (! this._cachedString) {
      this._cachedString = this._strings.join("");
    }
    return this._cachedString;
  },

  size: function() {
    return this.toString().length;
  },

  position: function() {
    return this._position;
  },

  setPosition: function(pos) {
    this._position = pos;
  },

  bytesAvailable: function() {
    return this.size() - this._position;
  },

  readByte: function() {
    return this.toString().charCodeAt(this._position++);
  },

  readSgsString: function() {
    var stringLength = this.readShort();
    return this.readBytes(stringLength);
  },

  readShort: function() {
    return (this.readByte() << 8) + this.readByte();
  },

  readInt: function() {
    return (this.readByte() << 24) + (this.readByte() << 16) + (this.readByte() << 8) + this.readByte();
  },

  readRemainingBytes: function() {
    return this.readBytes(this.bytesAvailable());
  },

  readBytes: function(length) {
    return this.toString().substring(this._position, this._position += length);
  }
});

})();
