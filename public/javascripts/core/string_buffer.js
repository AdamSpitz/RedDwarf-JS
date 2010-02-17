function StringBuffer(initialString) {
   this._buffer = [];
   if (initialString != null) { this.append(initialString); }
 }

StringBuffer.prototype.append = function append(string) {
  this._buffer.push(string);
  return this;
};

StringBuffer.prototype.toString = function toString() {
  return this._buffer.join("");
};
