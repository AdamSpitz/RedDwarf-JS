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

/*
 * I don't mean to keep this class around forever - hopefully sooner or later Javascript will
 * have a working hash table that can handle arbitrary objects (rather than just strings) as
 * keys. Maybe it exists already, but I couldn't find it. So for now I'll just use this
 * bloody thing. -- Adam
 */

(function() {

RedDwarf.BloodyHashTable = function BloodyHashTable() {
  this._buckets = {};
  this._size = 0;
};

/* Adding stuff to Object.prototype screws up Ajax. See http://dev.rubyonrails.org/ticket/6579
Object.prototype.equals = function equals(other) {
  return this == other;
};
*/

Number.prototype.equals = function equals(other) {
  return this == other;
};

RedDwarf.BloodyHashTable.Bucket = Array;

RedDwarf.BloodyHashTable.prototype.keysAreEqual = function keysAreEqual(k1, k2) {
  if (k1 === null || k1 === undefined) {return k2 === null || k2 === undefined;}
  if (k2 === null || k2 === undefined) {return false;}
  if (typeof(k1) !== typeof(k2)) {return false;}
  return k1.equals(k2);
};

RedDwarf.BloodyHashTable.prototype.bucketForKey = function bucketForKey(k) {
  var b = this._buckets[k];
  if (typeof b === "undefined") {
    b = new RedDwarf.BloodyHashTable.Bucket();
    this._buckets[k] = b;
  }
  return b;
};

RedDwarf.BloodyHashTable.prototype.pairForKey = function pairForKey(k) {
  var b = this.bucketForKey(k);
  for (var i = 0, n = b.length; i < n; ++i) {
    var pair = b[i];
    if (this.keysAreEqual(k, pair.key)) {
      return pair;
    }
  }
  return null;
};

RedDwarf.BloodyHashTable.prototype.get = function get(k) {
  var pair = this.pairForKey(k);
  return pair !== null ? pair.value : null;
};

RedDwarf.BloodyHashTable.prototype.set = function set(k, v) {
  var b = this.bucketForKey(k);
  for (var i = 0, n = b.length; i < n; ++i) {
    var pair = b[i];
    if (this.keysAreEqual(k, pair.key)) {
      pair.value = v;
      return v;
    }
  }
  b.push({key: k, value: v});
  ++this._size;
  return v;
};

RedDwarf.BloodyHashTable.prototype.containsKey = function containsKey(k) {
  var pair = this.pairForKey(k);
  return pair !== null;
};

RedDwarf.BloodyHashTable.prototype.put = RedDwarf.BloodyHashTable.prototype.set;

RedDwarf.BloodyHashTable.prototype._each = function _each(iterator) {
  for (var h in this._buckets) {
    var b = this._buckets[h];
    if (b instanceof RedDwarf.BloodyHashTable.Bucket) {
      for (var i = 0, n = b.length; i < n; ++i) {
        var pair = b[i];
        iterator(pair);
      }
    }
  }
};

RedDwarf.BloodyHashTable.prototype.values = function values() {
  var vs = [];
  this._each(function(v) {
    vs.push(v);
  });
  return vs;
};

RedDwarf.BloodyHashTable.prototype.toString = function toString() {
  if (this._size > 5) {return "a hash table";}
  var s = ["a hash table"];
  var sep = "";
  s.push("(");
  this._each(function(pair) {
    s.push(sep);
    s.push(pair.key);
    s.push(": ");
    s.push(pair.value);
    sep = ", ";
  });
  s.push(")");
  return s.join("");
};

})();
