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

RedDwarf.BloodyHashTable.Bucket = function() {}
RedDwarf.BloodyHashTable.Bucket.prototype = [];

RedDwarf.BloodyHashTable.prototype.keysAreEqual = function keysAreEqual(k1, k2) {
  if (k1 == null) {return k2 == null;}
  if (k2 == null) {return false;     }
  var t1 = typeof(k1);
  var t2 = typeof(k2);
  if (t1 != t2) {return false;}
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
