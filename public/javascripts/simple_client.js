(function() {

RedDwarf.SimpleClient = function SimpleClient(host, port) {
  this._host           = host;
  this._port           = port;
  this._reconnectKey   = new RedDwarf.ByteArray();
  this._eventListeners = [];
  this._channels       = new RedDwarf.BloodyHashTable();
  this._sock           = new Orbited.TCPSocket();
  this._messageFilter  = new RedDwarf.MessageFilter();

  var thisClient = this;
  this._sock         .onread       = function(msg)  { return thisClient.onData(msg);       };
  this._sock         .onclose      = function(code) { return thisClient.onClose(code);     };
  this._messageFilter.onRawMessage = function(msg)  { return thisClient.onRawMessage(msg); };
};

RedDwarf.SimpleClient.prototype.writeBytesPrecededByLength = function writeBytesPrecededByLength(bytes, stream) {
  var str = bytes.toString();
  stream.writeShort(str.length);
  stream.writeBytes(str);
};

RedDwarf.SimpleClient.prototype.login = function login(username, passwd) {
  var thisClient = this;
  this._sock.onopen = function() {
    var buf = new RedDwarf.ByteArray();
    buf.writeByte(RedDwarf.SimpleProtocol.LOGIN_REQUEST);
    buf.writeByte(RedDwarf.SimpleProtocol.VERSION);
    buf.writeUTF(username);
    buf.writeUTF(passwd);
    thisClient.writeBytesPrecededByLength(buf, thisClient._sock);
  };

  this._sock.open(this._host, this._port, true); // must be in binary mode - otherwise we get Unicode weirdness -- Adam, Dec. 2009
};

RedDwarf.SimpleClient.prototype.channelSend = function channelSend(channel, message) {
  var buf = new RedDwarf.ByteArray();
  buf.writeByte(RedDwarf.SimpleProtocol.CHANNEL_MESSAGE);
  this.writeBytesPrecededByLength(channel.rawIdBytes(), buf);
  buf.writeBytes(message);
  this.writeBytesPrecededByLength(buf, this._sock);
};

RedDwarf.SimpleClient.prototype.getChannels = function getChannels() {
  return this._channels;
};

RedDwarf.SimpleClient.prototype.getChannelWithID = function getChannelWithID(id) {
  return this._channels.get(id);
};

RedDwarf.SimpleClient.prototype.sessionSend = function sessionSend(message) {
  var buf = new RedDwarf.ByteArray();
  buf.writeByte(RedDwarf.SimpleProtocol.SESSION_MESSAGE);
  buf.writeBytes(message);
  this.writeBytesPrecededByLength(buf, this._sock);
};

RedDwarf.SimpleClient.prototype.logout = function logout(force) {
  if (force) {
    this._sock.close();
  } else {
    var buf = new RedDwarf.ByteArray();
    buf.writeByte(RedDwarf.SimpleProtocol.LOGOUT_REQUEST);
    this.writeBytesPrecededByLength(buf, this._sock);
  }
};


/* private */ RedDwarf.SimpleClient.prototype.onClose = function onClose(code) {
  // I'm confused. I saw something like this in the ActionScript code, but here it seems to mess things up.
  // this.dispatchRedDwarfEvent(new RedDwarf.Event(RedDwarf.Event.LOGOUT));
};

/* private */ RedDwarf.SimpleClient.prototype.onData = function onData(msg) {
  this._messageFilter.receive(msg, this);
};

RedDwarf.SimpleClient.prototype.onRawMessage = function onRawMessage(msg) {
  this.receivedMessage(new RedDwarf.ByteArray(msg));
};

RedDwarf.SimpleClient.prototype.dispatchRedDwarfEvent = function dispatchRedDwarfEvent(e) {
  var listenerFunctionName = "on_" + e.eventType();
  for (var i = 0, n = this._eventListeners.length; i < n; ++i) {
    var listener = this._eventListeners[i];
    var listenerFunction = listener[listenerFunctionName];
    if (listenerFunction != null) {listenerFunction.call(listener, e, this);}
  }
};

RedDwarf.SimpleClient.prototype.registerListener = function registerListener(listener) {
  this._eventListeners.push(listener);
};




/**
 * This is the heart of the SimpleClient. The method reads
 * the incoming data, parses the commands based on the RedDwarf.SimpleProtocol byte
 * and dispatches events.
 *
 */
/* private */ RedDwarf.SimpleClient.prototype.receivedMessage = function receivedMessage(message) {
  var command = message.readByte();

  if (command == RedDwarf.SimpleProtocol.LOGIN_SUCCESS)
  {
    //TODO reconnectkey support?
    var reconnectKey = message.readRemainingBytes();
    this.dispatchRedDwarfEvent(new RedDwarf.Event(RedDwarf.Event.LOGIN_SUCCESS));
  }

  else if (command == RedDwarf.SimpleProtocol.LOGIN_FAILURE)
  {
    var e = new RedDwarf.Event(RedDwarf.Event.LOGIN_FAILURE);
    e.failureMessage = message.readSgsString();
    this.dispatchRedDwarfEvent(e);
  }

  else if (command == RedDwarf.SimpleProtocol.LOGIN_REDIRECT)
  {
    var newHost = message.readSgsString();
    var newPort = message.readInt();
    var e = new RedDwarf.Event(RedDwarf.Event.LOGIN_REDIRECT);
    e.host = newHost;
    e.port = newPort;
    this.dispatchRedDwarfEvent(e);
  }

  else if (command == RedDwarf.SimpleProtocol.RECONNECT_SUCCESS)
  {
    //TODO reconnectkey support?
    var reconnectKey = message.readRemainingBytes();
    this.dispatchRedDwarfEvent(new RedDwarf.Event(RedDwarf.Event.RECONNECT_SUCCESS));
  }

  else if (command == RedDwarf.SimpleProtocol.RECONNECT_FAILURE)
  {
    var e = new RedDwarf.Event(RedDwarf.Event.RECONNECT_FAILURE);
    e.failureMessage = message.readSgsString();
    this.dispatchRedDwarfEvent(e);
  }

  else if (command == RedDwarf.SimpleProtocol.SESSION_MESSAGE)
  {
    var e = new RedDwarf.Event(RedDwarf.Event.SESSION_MESSAGE);
    e.sessionMessage = message.readRemainingBytes();
    this.dispatchRedDwarfEvent(e);
  }
  else if (command == RedDwarf.SimpleProtocol.LOGOUT_SUCCESS)
  {
    var e = new RedDwarf.Event(RedDwarf.Event.LOGOUT);
    this.dispatchRedDwarfEvent(e);
  }
  else if (command == RedDwarf.SimpleProtocol.CHANNEL_JOIN)
  {
    var channelName = message.readSgsString();
    var channel = new RedDwarf.ClientChannel(channelName, message.readRemainingBytes());
    this._channels.put(channel.uniqueId(), channel);
    var e = new RedDwarf.Event(RedDwarf.Event.CHANNEL_JOIN);
    e.channel = channel;
    this.dispatchRedDwarfEvent(e);
  }
  else if (command == RedDwarf.SimpleProtocol.CHANNEL_MESSAGE)
  {
    //Read channelId bytes
    var channel = this._channels.get(RedDwarf.ClientChannel.bytesToChannelId(message.readSgsString()));
    var e = new RedDwarf.Event(RedDwarf.Event.CHANNEL_MESSAGE);
    e.channel = channel;
    e.channelMessage = message.readRemainingBytes();
    this.dispatchRedDwarfEvent(e);
  }
  else if (command == RedDwarf.SimpleProtocol.CHANNEL_LEAVE)
  {
    //Read channelId bytes
    var channel = this._channels.get(RedDwarf.ClientChannel.bytesToChannelId(message.readRemainingBytes()));

    if (channel != null) {
      this._channels.remove(channel.uniqueId());
      var e = new RedDwarf.Event(RedDwarf.Event.CHANNEL_LEAVE);
      e.channel = channel;
      this.dispatchRedDwarfEvent(e);
    }
  }
  else
  {
    throw new Error("Undefined protocol command:" + command);
  }
};

})();
