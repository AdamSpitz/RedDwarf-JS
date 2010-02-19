
if(typeof(RedDwarf)==='undefined'){RedDwarf={COPYRIGHT:'Copyright (c) 2010 Adam Spitz',LICENSE:'This code is released under the MIT License: http://www.opensource.org/licenses/mit-license.php'};}
(function(){RedDwarf.extend=function extend(destination,source){for(var property in source){destination[property]=source[property];}
if(source.toString!==Object.prototype.toString){destination.toString=source.toString;}
return destination;};})();(function(){RedDwarf.BloodyHashTable=function(){this._buckets={};this._size=0;};RedDwarf.BloodyHashTable.Bucket=Array;RedDwarf.extend(RedDwarf.BloodyHashTable.prototype,{keysAreEqual:function(k1,k2){if(k1===null||k1===undefined){return k2===null||k2===undefined;}
if(k2===null||k2===undefined){return false;}
if(typeof(k1)!==typeof(k2)){return false;}
if(typeof(k1.equals)==='function'){return k1.equals(k2);}else{return k1==k2;}},bucketForKey:function(k){var b=this._buckets[k];if(typeof b==="undefined"){b=new RedDwarf.BloodyHashTable.Bucket();this._buckets[k]=b;}
return b;},pairForKey:function(k){var b=this.bucketForKey(k);for(var i=0,n=b.length;i<n;++i){var pair=b[i];if(this.keysAreEqual(k,pair.key)){return pair;}}
return null;},get:function(k){var pair=this.pairForKey(k);return pair!==null?pair.value:null;},set:function(k,v){var b=this.bucketForKey(k);for(var i=0,n=b.length;i<n;++i){var pair=b[i];if(this.keysAreEqual(k,pair.key)){pair.value=v;return v;}}
b.push({key:k,value:v});++this._size;return v;},put:function(k,v){return this.set(k,v);},containsKey:function(k){var pair=this.pairForKey(k);return pair!==null;},_each:function(iterator){for(var h in this._buckets){var b=this._buckets[h];if(b instanceof RedDwarf.BloodyHashTable.Bucket){for(var i=0,n=b.length;i<n;++i){var pair=b[i];iterator(pair);}}}},values:function(){var vs=[];this._each(function(v){vs.push(v);});return vs;},toString:function(){if(this._size>5){return"a hash table";}
var s=["a hash table"];var sep="";s.push("(");this._each(function(pair){s.push(sep);s.push(pair.key);s.push(": ");s.push(pair.value);sep=", ";});s.push(")");return s.join("");}});})();(function(){RedDwarf.ByteArray=function(bytes){this._strings=bytes?[bytes]:[];this._position=0;this._cachedString=null;};RedDwarf.extend(RedDwarf.ByteArray.prototype,{writeByte:function(b){this.writeBytes(String.fromCharCode(b));},writeShort:function(s){this.writeBytes(String.fromCharCode((s>>8)&255,s&255));},writeUTF:function(str){this.writeShort(str.length);this.writeBytes(str);},writeBytes:function(str){this._strings.push(str);this._position+=str.length;this._cachedString=null;},toString:function(){if(!this._cachedString){this._cachedString=this._strings.join("");}
return this._cachedString;},size:function(){return this.toString().length;},position:function(){return this._position;},setPosition:function(pos){this._position=pos;},bytesAvailable:function(){return this.size()-this._position;},readByte:function(){return this.toString().charCodeAt(this._position++);},readSgsString:function(){var stringLength=this.readShort();return this.readBytes(stringLength);},readShort:function(){return(this.readByte()<<8)+this.readByte();},readInt:function(){return(this.readByte()<<24)+(this.readByte()<<16)+(this.readByte()<<8)+this.readByte();},readRemainingBytes:function(){return this.readBytes(this.bytesAvailable());},readBytes:function(length){return this.toString().substring(this._position,this._position+=length);}});})();(function(){RedDwarf.extend(Orbited.TCPSocket.prototype,{writeByte:function(b){this.writeBytes(String.fromCharCode(b));},writeShort:function(s){this.writeBytes(String.fromCharCode((s>>8)&255,s&255));},writeUTF:function(str){this.writeShort(str.length);this.writeBytes(str);},writeBytes:function(str){this.send(str);}});})();RedDwarf.SimpleProtocol={MAX_MESSAGE_LENGTH:65535,MAX_PAYLOAD_LENGTH:65532,VERSION:0x04,LOGIN_REQUEST:0x10,LOGIN_SUCCESS:0x11,LOGIN_FAILURE:0x12,LOGIN_REDIRECT:0x13,RECONNECT_REQUEST:0x20,RECONNECT_SUCCESS:0x21,RECONNECT_FAILURE:0x22,SESSION_MESSAGE:0x30,LOGOUT_REQUEST:0x40,LOGOUT_SUCCESS:0x41,CHANNEL_JOIN:0x50,CHANNEL_LEAVE:0x51,CHANNEL_MESSAGE:0x52};(function(){RedDwarf.ClientChannel=function(name,rawId){this._name=name;this._rawIdBytes=rawId;this._idNumber=RedDwarf.ClientChannel.bytesToChannelId(rawId);};RedDwarf.extend(RedDwarf.ClientChannel.prototype,{name:function(){return this._name;},id:function(){return this._idNumber;},uniqueId:function(){return this._idNumber;},rawIdBytes:function(){return this._rawIdBytes;},toString:function(){return this._name;}});RedDwarf.ClientChannel.bytesToChannelId=function(buf){var result=0;var shift=(buf.length-1)*8;for(var i=0,n=buf.length;i<n;++i){var b=buf.charCodeAt(i);result+=(b&255)<<shift;shift-=8;}
return result;};})();(function(){RedDwarf.MessageFilter=function(client){this._client=client;this._messageBuffer=new RedDwarf.ByteArray();};RedDwarf.extend(RedDwarf.MessageFilter.prototype,{receive:function(msg,client){this._messageBuffer.writeBytes(msg);this._messageBuffer.setPosition(0);while(this._messageBuffer.bytesAvailable()>2){var payloadLength=this._messageBuffer.readShort();if(this._messageBuffer.bytesAvailable()>=payloadLength){client.onRawMessage(this._messageBuffer.readBytes(payloadLength));}else{this._messageBuffer.setPosition(this._messageBuffer.position()-2);break;}}
var newBuffer=new RedDwarf.ByteArray(this._messageBuffer.readRemainingBytes());this._messageBuffer=newBuffer;}});})();(function(){RedDwarf.Event=function Event(type){this._eventType=type;};RedDwarf.extend(RedDwarf.Event.prototype,{eventType:function(){return this._eventType;}});RedDwarf.extend(RedDwarf.Event,{LOGIN_SUCCESS:"loginSuccess",LOGIN_FAILURE:"loginFailure",LOGIN_REDIRECT:"loginRedirect",RECONNECT_SUCCESS:"reconnectSuccess",RECONNECT_FAILURE:"reconnectFailure",SESSION_MESSAGE:"sessionMessage",LOGOUT:"logout",CHANNEL_JOIN:"channelJoin",CHANNEL_MESSAGE:"channelMessage",CHANNEL_LEAVE:"channelLeave",RAW_MESSAGE:"rawMessage"});})();(function(){RedDwarf.SimpleClient=function SimpleClient(host,port){this._host=host;this._port=port;this._reconnectKey=new RedDwarf.ByteArray();this._eventListeners=[];this._channels=new RedDwarf.BloodyHashTable();this._sock=new Orbited.TCPSocket();this._messageFilter=new RedDwarf.MessageFilter(this);var thisClient=this;this._sock.onread=function(msg){return thisClient.onData(msg);};this._sock.onclose=function(code){return thisClient.onClose(code);};};RedDwarf.extend(RedDwarf.SimpleClient.prototype,{registerListener:function registerListener(listener){this._eventListeners.push(listener);},login:function(username,password){var thisClient=this;this._sock.onopen=function(){var buf=new RedDwarf.ByteArray();buf.writeByte(RedDwarf.SimpleProtocol.LOGIN_REQUEST);buf.writeByte(RedDwarf.SimpleProtocol.VERSION);buf.writeUTF(username);buf.writeUTF(password);thisClient.writeBytesPrecededByLength(buf,thisClient._sock);};var mustUseSocketInBinaryMode=true;this._sock.open(this._host,this._port,mustUseSocketInBinaryMode);},logout:function(shouldForceSocketToClose){if(shouldForceSocketToClose){this._sock.close();}else{var buf=new RedDwarf.ByteArray();buf.writeByte(RedDwarf.SimpleProtocol.LOGOUT_REQUEST);this.writeBytesPrecededByLength(buf,this._sock);}},sessionSend:function(message){var buf=new RedDwarf.ByteArray();buf.writeByte(RedDwarf.SimpleProtocol.SESSION_MESSAGE);buf.writeBytes(message);this.writeBytesPrecededByLength(buf,this._sock);},channelSend:function(channel,message){var buf=new RedDwarf.ByteArray();buf.writeByte(RedDwarf.SimpleProtocol.CHANNEL_MESSAGE);this.writeBytesPrecededByLength(channel.rawIdBytes(),buf);buf.writeBytes(message);this.writeBytesPrecededByLength(buf,this._sock);},getChannelWithID:function(id){return this._channels.get(id);},writeBytesPrecededByLength:function(bytes,stream){var str=bytes.toString();stream.writeShort(str.length);stream.writeBytes(str);},onClose:function(code){},onData:function(msg){this._messageFilter.receive(msg,this);},dispatchRedDwarfEvent:function(e){var listenerFunctionName="on_"+e.eventType();for(var i=0,n=this._eventListeners.length;i<n;++i){var listener=this._eventListeners[i];var listenerFunction=listener[listenerFunctionName];if(listenerFunction){listenerFunction.call(listener,e,this);}}},onRawMessage:function(messageString){var message=new RedDwarf.ByteArray(messageString);var command=message.readByte();var e;var channel;if(command===RedDwarf.SimpleProtocol.LOGIN_SUCCESS){e=new RedDwarf.Event(RedDwarf.Event.LOGIN_SUCCESS);e.reconnectKey=message.readRemainingBytes();this.dispatchRedDwarfEvent(e);}
else if(command===RedDwarf.SimpleProtocol.LOGIN_FAILURE){e=new RedDwarf.Event(RedDwarf.Event.LOGIN_FAILURE);e.failureMessage=message.readSgsString();this.dispatchRedDwarfEvent(e);}
else if(command===RedDwarf.SimpleProtocol.LOGIN_REDIRECT){var newHost=message.readSgsString();var newPort=message.readInt();e=new RedDwarf.Event(RedDwarf.Event.LOGIN_REDIRECT);e.host=newHost;e.port=newPort;this.dispatchRedDwarfEvent(e);}
else if(command===RedDwarf.SimpleProtocol.RECONNECT_SUCCESS){e=new RedDwarf.Event(RedDwarf.Event.RECONNECT_SUCCESS);e.reconnectKey=message.readRemainingBytes();this.dispatchRedDwarfEvent(e);}
else if(command===RedDwarf.SimpleProtocol.RECONNECT_FAILURE){e=new RedDwarf.Event(RedDwarf.Event.RECONNECT_FAILURE);e.failureMessage=message.readSgsString();this.dispatchRedDwarfEvent(e);}
else if(command===RedDwarf.SimpleProtocol.SESSION_MESSAGE){e=new RedDwarf.Event(RedDwarf.Event.SESSION_MESSAGE);e.message=message.readRemainingBytes();this.dispatchRedDwarfEvent(e);}
else if(command===RedDwarf.SimpleProtocol.LOGOUT_SUCCESS){e=new RedDwarf.Event(RedDwarf.Event.LOGOUT);this.dispatchRedDwarfEvent(e);}
else if(command===RedDwarf.SimpleProtocol.CHANNEL_JOIN){var channelName=message.readSgsString();channel=new RedDwarf.ClientChannel(channelName,message.readRemainingBytes());this._channels.put(channel.uniqueId(),channel);e=new RedDwarf.Event(RedDwarf.Event.CHANNEL_JOIN);e.channel=channel;this.dispatchRedDwarfEvent(e);}
else if(command===RedDwarf.SimpleProtocol.CHANNEL_MESSAGE){channel=this._channels.get(RedDwarf.ClientChannel.bytesToChannelId(message.readSgsString()));e=new RedDwarf.Event(RedDwarf.Event.CHANNEL_MESSAGE);e.channel=channel;e.message=message.readRemainingBytes();this.dispatchRedDwarfEvent(e);}
else if(command===RedDwarf.SimpleProtocol.CHANNEL_LEAVE){channel=this._channels.get(RedDwarf.ClientChannel.bytesToChannelId(message.readRemainingBytes()));if(channel){this._channels.remove(channel.uniqueId());e=new RedDwarf.Event(RedDwarf.Event.CHANNEL_LEAVE);e.channel=channel;this.dispatchRedDwarfEvent(e);}}
else{throw new Error("Undefined protocol command:"+command);}}});})();