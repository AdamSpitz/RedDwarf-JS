function SimpleClient(host, port) {
  this._host           = host;
  this._port           = port;
  this._reconnectKey   = new ByteArray();
  this._eventListeners = [];
  this._channels       = new HashMap();
  this._sock           = new Orbited.TCPSocket();
  this._messageFilter  = new MessageFilter();

  var thisClient = this;
  this._sock         .onread       = function(msg)  { return thisClient.onData(msg);       };
  this._sock         .onclose      = function(code) { return thisClient.onClose(code);     };
  this._messageFilter.onRawMessage = function(msg)  { return thisClient.onRawMessage(msg); };
}

(function() {
SimpleClient.prototype.writeBytesPrecededByLength = function writeBytesPrecededByLength(bytes, stream) {
  var str = bytes.toString();
  stream.writeShort(str.length);
  stream.writeBytes(str);
};

SimpleClient.prototype.login = function login(username, passwd) {
  var thisClient = this;
  this._sock.onopen = function() {
    var buf = new ByteArray();
    buf.writeByte(SimpleSgsProtocol.LOGIN_REQUEST);
    buf.writeByte(SimpleSgsProtocol.VERSION);
    buf.writeUTF(username);
    buf.writeUTF(passwd);
    thisClient.writeBytesPrecededByLength(buf, thisClient._sock);
    thisClient._sock.flush();
  };

  this._sock.open(this._host, this._port, true); // must be in binary mode - otherwise we get Unicode weirdness -- Adam, Dec. 2009
};

SimpleClient.prototype.channelSend = function channelSend(channel /*ClientChannel*/, message /*ByteArray*/) {
  var buf = new ByteArray();
  buf.writeByte(SimpleSgsProtocol.CHANNEL_MESSAGE);
  this.writeBytesPrecededByLength(channel.rawId, buf);
  buf.writeBytes(message);
  buf.position = 0;
  this.writeBytesPrecededByLength(buf, this._sock);
  this._sock.flush();
};

SimpleClient.prototype.getChannels = function getChannels() {
  return this._channels.values();
};

SimpleClient.prototype.sessionSend = function sessionSend(message) {
  var buf = new ByteArray();
  buf.writeByte(SimpleSgsProtocol.SESSION_MESSAGE);
  buf.writeBytes(message);
  //debug("SimpleClient.sessionSend(): about to write to the socket, readyState is now " + this._sock.readyState)
  this.writeBytesPrecededByLength(buf, this._sock);
  this._sock.flush();
};

SimpleClient.prototype.logout = function logout(force) {
  if (force) {
    this._sock.close();
  } else {
    var buf = new ByteArray();
    buf.writeByte(SimpleSgsProtocol.LOGOUT_REQUEST);
    this.writeBytesPrecededByLength(buf, this._sock);
    this._sock.flush();
  }
};


/* private */ SimpleClient.prototype.onClose = function onClose(code) {
  // I'm confused. I saw something like this in the ActionScript code, but here it seems to mess things up.
  // this.dispatchSgsEvent(new SgsEvent(SgsEvent.LOGOUT));
};

/* private */ SimpleClient.prototype.onData = function onData(msg) {
  this._messageFilter.receive(msg, this);
};

SimpleClient.prototype.onRawMessage = function onRawMessage(msg) {
  this.receivedMessage(new ByteArray(msg));
};

SimpleClient.prototype.dispatchSgsEvent = function dispatchSgsEvent(e) {
  var listenerFunctionName = "on_" + e.eventType();
  for (var i = 0, n = this._eventListeners.length; i < n; ++i) {
    var listener = this._eventListeners[i];
    var listenerFunction = listener[listenerFunctionName];
    if (listenerFunction != null) {listenerFunction.call(listener, e, this);}
  }
};

SimpleClient.prototype.registerListener = function registerListener(listener) {
  this._eventListeners.push(listener);
};




/**
 * This is the heart of the SimpleClient. The method reads
 * the incoming data, parses the commands based on the SimpleSgsProtocol byte
 * and dispatches events.
 *
 */
/* private */ SimpleClient.prototype.receivedMessage = function receivedMessage(message) {
  var command = message.readByte();
  var e = null;
  var channel;

  if (command == SimpleSgsProtocol.LOGIN_SUCCESS)
  {
    //TODO reconnectkey support?
    var reconnectKey = message.readRemainingBytes();
    this.dispatchSgsEvent(new SgsEvent(SgsEvent.LOGIN_SUCCESS));
  }

  else if (command == SimpleSgsProtocol.LOGIN_FAILURE)
  {
    e = new SgsEvent(SgsEvent.LOGIN_FAILURE);
    e.failureMessage = message.readSgsString();
    this.dispatchSgsEvent(e);
  }

  else if (command == SimpleSgsProtocol.LOGIN_REDIRECT)
  {
    var newHost = message.readSgsString();
    var newPort = message.readInt();
    e = new SgsEvent(SgsEvent.LOGIN_REDIRECT);
    e.host = newHost;
    e.port = newPort;
    this.dispatchSgsEvent(e);
  }

  else if (command == SimpleSgsProtocol.RECONNECT_SUCCESS)
  {
    //TODO reconnectkey support?
    var reconnectKey = message.readRemainingBytes();
    this.dispatchSgsEvent(new SgsEvent(SgsEvent.RECONNECT_SUCCESS));
  }

  else if (command == SimpleSgsProtocol.RECONNECT_FAILURE)
  {
    e = new SgsEvent(SgsEvent.RECONNECT_FAILURE);
    e.failureMessage = message.readSgsString();
    this.dispatchSgsEvent(e);
  }

  else if (command == SimpleSgsProtocol.SESSION_MESSAGE)
  {
    e = new SgsEvent(SgsEvent.SESSION_MESSAGE);
    e.sessionMessage = message.readRemainingBytes();
    this.dispatchSgsEvent(e);
  }
  else if (command == SimpleSgsProtocol.LOGOUT_SUCCESS)
  {
    e = new SgsEvent(SgsEvent.LOGOUT);
    this.dispatchSgsEvent(e);
  }
  else if (command == SimpleSgsProtocol.CHANNEL_JOIN)
  {
    var channelName = message.readSgsString();
    channel = new ClientChannel(channelName, message.readRemainingBytes());
    this._channels.put(channel.id, channel);
    e = new SgsEvent(SgsEvent.CHANNEL_JOIN);
    e.channel = channel;
    this.dispatchSgsEvent(e);
  }
  else if (command == SimpleSgsProtocol.CHANNEL_MESSAGE)
  {
    //Read channelId bytes
    channel = this._channels.get(ClientChannel.bytesToChannelId(message.readSgsString()));
    e = new SgsEvent(SgsEvent.CHANNEL_MESSAGE);
    e.channel = channel;
    e.channelMessage = message.readRemainingBytes();
    this.dispatchSgsEvent(e);
  }
  else if (command == SimpleSgsProtocol.CHANNEL_LEAVE)
  {
    //Read channelId bytes
    channel = this._channels.get(ClientChannel.bytesToChannelId(message.readRemainingBytes()));

    if (channel != null) {
      channels.remove(channel.id);
      e = new SgsEvent(SgsEvent.CHANNEL_LEAVE);
      e.channel = channel;
      this.dispatchSgsEvent(e);
    }
  }
  else
  {
    throw new Error("Undefined protocol command:" + command);
  }
};
})();



function debug(msg) {
  if (typeof(console) !== 'undefined') {
    console.log(msg);
  }
}
