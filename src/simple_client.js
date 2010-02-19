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

RedDwarf.SimpleClient = function SimpleClient(host, port) {
  this._host           = host;
  this._port           = port;
  this._reconnectKey   = new RedDwarf.ByteArray();
  this._eventListeners = [];
  this._channels       = new RedDwarf.BloodyHashTable();
  this._sock           = new Orbited.TCPSocket();
  this._messageFilter  = new RedDwarf.MessageFilter(this);

  var thisClient = this;
  this._sock.onread  = function(msg)  { return thisClient.onData(msg);       };
  this._sock.onclose = function(code) { return thisClient.onClose(code);     };
};

RedDwarf.extend(RedDwarf.SimpleClient.prototype, {
  registerListener: function registerListener(listener) {
    this._eventListeners.push(listener);
  },

  login: function(username, password) {
    var thisClient = this;
    this._sock.onopen = function() {
      var buf = new RedDwarf.ByteArray();
      buf.writeByte(RedDwarf.SimpleProtocol.LOGIN_REQUEST);
      buf.writeByte(RedDwarf.SimpleProtocol.VERSION);
      buf.writeUTF(username);
      buf.writeUTF(password);
      thisClient.writeBytesPrecededByLength(buf, thisClient._sock);
    };
  
    var mustUseSocketInBinaryMode = true; // otherwise we get Unicode weirdness -- Adam, Dec. 2009
    this._sock.open(this._host, this._port, mustUseSocketInBinaryMode);
  },

  logout: function(shouldForceSocketToClose) {
    if (shouldForceSocketToClose) {
      this._sock.close();
    } else {
      var buf = new RedDwarf.ByteArray();
      buf.writeByte(RedDwarf.SimpleProtocol.LOGOUT_REQUEST);
      this.writeBytesPrecededByLength(buf, this._sock);
    }
  },

  sessionSend: function(message) {
    var buf = new RedDwarf.ByteArray();
    buf.writeByte(RedDwarf.SimpleProtocol.SESSION_MESSAGE);
    buf.writeBytes(message);
    this.writeBytesPrecededByLength(buf, this._sock);
  },

  channelSend: function(channel, message) {
    var buf = new RedDwarf.ByteArray();
    buf.writeByte(RedDwarf.SimpleProtocol.CHANNEL_MESSAGE);
    this.writeBytesPrecededByLength(channel.rawIdBytes(), buf);
    buf.writeBytes(message);
    this.writeBytesPrecededByLength(buf, this._sock);
  },

  getChannelWithID: function(id) {
    return this._channels.get(id);
  },



  /* private */ writeBytesPrecededByLength: function(bytes, stream) {
    var str = bytes.toString();
    stream.writeShort(str.length);
    stream.writeBytes(str);
  },

  /* private */ onClose: function(code) {
    // I'm confused. I saw something like this in the ActionScript code, but here it seems to mess things up.
    // this.dispatchRedDwarfEvent(new RedDwarf.Event(RedDwarf.Event.LOGOUT));
  },

  /* private */ onData: function(msg) {
    this._messageFilter.receive(msg, this);
  },

  // aaa
  /* private */ dispatchRedDwarfEvent: function(e) {
    var listenerFunctionName = "on_" + e.eventType();
    for (var i = 0, n = this._eventListeners.length; i < n; ++i) {
      var listener = this._eventListeners[i];
      var listenerFunction = listener[listenerFunctionName];
      if (listenerFunction) {listenerFunction.call(listener, e, this);}
    }
  },

  /**
   * This is the heart of the SimpleClient. The method reads the incoming
   * data, parses the commands based on the RedDwarf.SimpleProtocol byte
   * and dispatches events.
   */
  /* private */ onRawMessage: function(messageString) {
    var message = new RedDwarf.ByteArray(messageString);
    var command = message.readByte();
    var e;
    var channel;

    if (command === RedDwarf.SimpleProtocol.LOGIN_SUCCESS) {
      //TODO reconnectkey support?
      e = new RedDwarf.Event(RedDwarf.Event.LOGIN_SUCCESS);
      e.reconnectKey = message.readRemainingBytes();
      this.dispatchRedDwarfEvent(e);
    }

    else if (command === RedDwarf.SimpleProtocol.LOGIN_FAILURE) {
      e = new RedDwarf.Event(RedDwarf.Event.LOGIN_FAILURE);
      e.failureMessage = message.readSgsString();
      this.dispatchRedDwarfEvent(e);
    }

    else if (command === RedDwarf.SimpleProtocol.LOGIN_REDIRECT) {
      var newHost = message.readSgsString();
      var newPort = message.readInt();
      e = new RedDwarf.Event(RedDwarf.Event.LOGIN_REDIRECT);
      e.host = newHost;
      e.port = newPort;
      this.dispatchRedDwarfEvent(e);
    }

    else if (command === RedDwarf.SimpleProtocol.RECONNECT_SUCCESS) {
      //TODO reconnectkey support?
      e = new RedDwarf.Event(RedDwarf.Event.RECONNECT_SUCCESS);
      e.reconnectKey = message.readRemainingBytes();
      this.dispatchRedDwarfEvent(e);
    }

    else if (command === RedDwarf.SimpleProtocol.RECONNECT_FAILURE) {
      e = new RedDwarf.Event(RedDwarf.Event.RECONNECT_FAILURE);
      e.failureMessage = message.readSgsString();
      this.dispatchRedDwarfEvent(e);
    }

    else if (command === RedDwarf.SimpleProtocol.SESSION_MESSAGE) {
      e = new RedDwarf.Event(RedDwarf.Event.SESSION_MESSAGE);
      e.message = message.readRemainingBytes();
      this.dispatchRedDwarfEvent(e);
    }

    else if (command === RedDwarf.SimpleProtocol.LOGOUT_SUCCESS) {
      e = new RedDwarf.Event(RedDwarf.Event.LOGOUT);
      this.dispatchRedDwarfEvent(e);
    }
 
    else if (command === RedDwarf.SimpleProtocol.CHANNEL_JOIN) {
      var channelName = message.readSgsString();
      channel = new RedDwarf.ClientChannel(channelName, message.readRemainingBytes());
      this._channels.put(channel.uniqueId(), channel);
      e = new RedDwarf.Event(RedDwarf.Event.CHANNEL_JOIN);
      e.channel = channel;
      this.dispatchRedDwarfEvent(e);
    }

    else if (command === RedDwarf.SimpleProtocol.CHANNEL_MESSAGE) {
      channel = this._channels.get(RedDwarf.ClientChannel.bytesToChannelId(message.readSgsString()));
      e = new RedDwarf.Event(RedDwarf.Event.CHANNEL_MESSAGE);
      e.channel = channel;
      e.message = message.readRemainingBytes();
      this.dispatchRedDwarfEvent(e);
    }

    else if (command === RedDwarf.SimpleProtocol.CHANNEL_LEAVE) {
      channel = this._channels.get(RedDwarf.ClientChannel.bytesToChannelId(message.readRemainingBytes()));
      if (channel) {
        this._channels.remove(channel.uniqueId());
        e = new RedDwarf.Event(RedDwarf.Event.CHANNEL_LEAVE);
        e.channel = channel;
        this.dispatchRedDwarfEvent(e);
      }
    }

    else {
      throw new Error("Undefined protocol command:" + command);
    }

  }
});

})();
