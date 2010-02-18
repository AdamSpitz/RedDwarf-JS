
if(typeof(RedDwarf)=='undefined'){RedDwarf={};}
(function(){RedDwarf.BloodyHashTable=function BloodyHashTable(){this._buckets={};this._size=0;};Number.prototype.equals=function equals(other){return this==other;};RedDwarf.BloodyHashTable.Bucket=function(){}
RedDwarf.BloodyHashTable.Bucket.prototype=[];RedDwarf.BloodyHashTable.prototype.keysAreEqual=function keysAreEqual(k1,k2){if(k1==null){return k2==null;}
if(k2==null){return false;}
var t1=typeof(k1);var t2=typeof(k2);if(t1!=t2){return false;}
return k1.equals(k2);};RedDwarf.BloodyHashTable.prototype.bucketForKey=function bucketForKey(k){var b=this._buckets[k];if(typeof b==="undefined"){b=new RedDwarf.BloodyHashTable.Bucket();this._buckets[k]=b;}
return b;};RedDwarf.BloodyHashTable.prototype.pairForKey=function pairForKey(k){var b=this.bucketForKey(k);for(var i=0,n=b.length;i<n;++i){var pair=b[i];if(this.keysAreEqual(k,pair.key)){return pair;}}
return null;};RedDwarf.BloodyHashTable.prototype.get=function get(k){var pair=this.pairForKey(k);return pair!==null?pair.value:null;};RedDwarf.BloodyHashTable.prototype.set=function set(k,v){var b=this.bucketForKey(k);for(var i=0,n=b.length;i<n;++i){var pair=b[i];if(this.keysAreEqual(k,pair.key)){pair.value=v;return v;}}
b.push({key:k,value:v});++this._size;return v;};RedDwarf.BloodyHashTable.prototype.containsKey=function containsKey(k){var pair=this.pairForKey(k);return pair!==null;};RedDwarf.BloodyHashTable.prototype.put=RedDwarf.BloodyHashTable.prototype.set;RedDwarf.BloodyHashTable.prototype._each=function _each(iterator){for(var h in this._buckets){var b=this._buckets[h];if(b instanceof RedDwarf.BloodyHashTable.Bucket){for(var i=0,n=b.length;i<n;++i){var pair=b[i];iterator(pair);}}}};RedDwarf.BloodyHashTable.prototype.values=function values(){var vs=[];this._each(function(v){vs.push(v);});return vs;};RedDwarf.BloodyHashTable.prototype.toString=function toString(){if(this._size>5){return"a hash table";}
var s=["a hash table"];var sep="";s.push("(");this._each(function(pair){s.push(sep);s.push(pair.key);s.push(": ");s.push(pair.value);sep=", ";});s.push(")");return s.join("");};})();(function(){RedDwarf.ByteArray=function ByteArray(bytes){this._strings=bytes?[bytes]:[];this._position=0;this._cachedString=null;};RedDwarf.ByteArray.prototype.writeByte=function writeByte(b){this.writeBytes(String.fromCharCode(b));};RedDwarf.ByteArray.prototype.writeShort=function writeShort(s){this.writeBytes(String.fromCharCode((s>>8)&255,s&255));};RedDwarf.ByteArray.prototype.writeUTF=function writeUTF(str){this.writeShort(str.length);this.writeBytes(str);};RedDwarf.ByteArray.prototype.writeBytes=function writeBytes(str){this._strings.push(str);this._position+=str.length;this._cachedString=null;};RedDwarf.ByteArray.prototype.toString=function toString(){if(this._cachedString==null){this._cachedString=this._strings.join("");}
return this._cachedString;};RedDwarf.ByteArray.prototype.size=function size(){return this.toString().length;};RedDwarf.ByteArray.prototype.position=function position(){return this._position;};RedDwarf.ByteArray.prototype.setPosition=function setPosition(pos){this._position=pos;};RedDwarf.ByteArray.prototype.bytesAvailable=function bytesAvailable(){return this.size()-this._position;};RedDwarf.ByteArray.prototype.readByte=function readByte(){return this.toString().charCodeAt(this._position++);};RedDwarf.ByteArray.prototype.readSgsString=function readSgsString(){var stringLength=this.readShort();return this.readBytes(stringLength);};RedDwarf.ByteArray.prototype.readShort=function readShort(){return(this.readByte()<<8)+this.readByte();};RedDwarf.ByteArray.prototype.readInt=function readInt(){return(this.readByte()<<24)+(this.readByte()<<16)+(this.readByte()<<8)+this.readByte();};RedDwarf.ByteArray.prototype.readRemainingBytes=function readRemainingBytes(){return this.readBytes(this.bytesAvailable());};RedDwarf.ByteArray.prototype.readBytes=function readBytes(length){return this.toString().substring(this._position,this._position+=length);};})();(function(){Orbited.TCPSocket.prototype.writeByte=function writeByte(b){this.writeBytes(String.fromCharCode(b));};Orbited.TCPSocket.prototype.writeShort=function writeShort(s){this.writeBytes(String.fromCharCode((s>>8)&255,s&255));};Orbited.TCPSocket.prototype.writeUTF=function writeUTF(str){this.writeShort(str.length);this.writeBytes(str);};Orbited.TCPSocket.prototype.writeBytes=function(str){this.send(str);};})();RedDwarf.SimpleProtocol={MAX_MESSAGE_LENGTH:65535,MAX_PAYLOAD_LENGTH:65532,VERSION:0x04,LOGIN_REQUEST:0x10,LOGIN_SUCCESS:0x11,LOGIN_FAILURE:0x12,LOGIN_REDIRECT:0x13,RECONNECT_REQUEST:0x20,RECONNECT_SUCCESS:0x21,RECONNECT_FAILURE:0x22,SESSION_MESSAGE:0x30,LOGOUT_REQUEST:0x40,LOGOUT_SUCCESS:0x41,CHANNEL_JOIN:0x50,CHANNEL_LEAVE:0x51,CHANNEL_MESSAGE:0x52,};(function(){RedDwarf.ClientChannel=function ClientChannel(name,rawId){this._name=name;this._rawIdBytes=rawId;this._idNumber=RedDwarf.ClientChannel.bytesToChannelId(rawId);}
RedDwarf.ClientChannel.prototype.name=function name(){return this._name;};RedDwarf.ClientChannel.prototype.uniqueId=function uniqueId(){return this._idNumber;};RedDwarf.ClientChannel.prototype.rawIdBytes=function rawIdBytes(){return this._rawIdBytes;};RedDwarf.ClientChannel.prototype.toString=function toString(){return this._name;};RedDwarf.ClientChannel.bytesToChannelId=function bytesToChannelId(buf){var result=0;var shift=(buf.length-1)*8;for(var i=0,n=buf.length;i<n;++i){var b=buf.charCodeAt(i);result+=(b&255)<<shift;shift-=8;}
return result;};})();(function(){RedDwarf.MessageFilter=function MessageFilter(){this._messageBuffer=new RedDwarf.ByteArray();};RedDwarf.MessageFilter.prototype.receive=function receive(msg,client){this._messageBuffer.writeBytes(msg);this._messageBuffer.setPosition(0);while(this._messageBuffer.bytesAvailable()>2)
{var payloadLength=this._messageBuffer.readShort();if(this._messageBuffer.bytesAvailable()>=payloadLength){var newMessage=new RedDwarf.ByteArray();this.onRawMessage(this._messageBuffer.readBytes(payloadLength));}else{this._messageBuffer.setPosition(this._messageBuffer.position()-2);break;}}
var newBuffer=new RedDwarf.ByteArray(this._messageBuffer.readRemainingBytes());this._messageBuffer=newBuffer;}
RedDwarf.MessageFilter.prototype.onRawMessage=function onRawMessage(msg){};})();(function(){RedDwarf.Event=function Event(type){this._eventType=type;this.type=type;};RedDwarf.Event.prototype.eventType=function eventType(){return this._eventType;};RedDwarf.Event.LOGIN_SUCCESS="loginSuccess";RedDwarf.Event.LOGIN_FAILURE="loginFailure";RedDwarf.Event.LOGIN_REDIRECT="loginRedirect";RedDwarf.Event.RECONNECT_SUCCESS="reconnectSuccess";RedDwarf.Event.RECONNECT_FAILURE="reconnectFailure";RedDwarf.Event.SESSION_MESSAGE="sessionMessage";RedDwarf.Event.LOGOUT="logout";RedDwarf.Event.CHANNEL_JOIN="channelJoin";RedDwarf.Event.CHANNEL_MESSAGE="channelMessage";RedDwarf.Event.CHANNEL_LEAVE="channelLeave";RedDwarf.Event.RAW_MESSAGE="rawMessage";})();(function(){RedDwarf.SimpleClient=function SimpleClient(host,port){this._host=host;this._port=port;this._reconnectKey=new RedDwarf.ByteArray();this._eventListeners=[];this._channels=new RedDwarf.BloodyHashTable();this._sock=new Orbited.TCPSocket();this._messageFilter=new RedDwarf.MessageFilter();var thisClient=this;this._sock.onread=function(msg){return thisClient.onData(msg);};this._sock.onclose=function(code){return thisClient.onClose(code);};this._messageFilter.onRawMessage=function(msg){return thisClient.onRawMessage(msg);};};RedDwarf.SimpleClient.prototype.writeBytesPrecededByLength=function writeBytesPrecededByLength(bytes,stream){var str=bytes.toString();stream.writeShort(str.length);stream.writeBytes(str);};RedDwarf.SimpleClient.prototype.login=function login(username,passwd){var thisClient=this;this._sock.onopen=function(){var buf=new RedDwarf.ByteArray();buf.writeByte(RedDwarf.SimpleProtocol.LOGIN_REQUEST);buf.writeByte(RedDwarf.SimpleProtocol.VERSION);buf.writeUTF(username);buf.writeUTF(passwd);thisClient.writeBytesPrecededByLength(buf,thisClient._sock);};this._sock.open(this._host,this._port,true);};RedDwarf.SimpleClient.prototype.channelSend=function channelSend(channel,message){var buf=new RedDwarf.ByteArray();buf.writeByte(RedDwarf.SimpleProtocol.CHANNEL_MESSAGE);this.writeBytesPrecededByLength(channel.rawIdBytes(),buf);buf.writeBytes(message);this.writeBytesPrecededByLength(buf,this._sock);};RedDwarf.SimpleClient.prototype.getChannels=function getChannels(){return this._channels;};RedDwarf.SimpleClient.prototype.getChannelWithID=function getChannelWithID(id){return this._channels.get(id);};RedDwarf.SimpleClient.prototype.sessionSend=function sessionSend(message){var buf=new RedDwarf.ByteArray();buf.writeByte(RedDwarf.SimpleProtocol.SESSION_MESSAGE);buf.writeBytes(message);this.writeBytesPrecededByLength(buf,this._sock);};RedDwarf.SimpleClient.prototype.logout=function logout(force){if(force){this._sock.close();}else{var buf=new RedDwarf.ByteArray();buf.writeByte(RedDwarf.SimpleProtocol.LOGOUT_REQUEST);this.writeBytesPrecededByLength(buf,this._sock);}};RedDwarf.SimpleClient.prototype.onClose=function onClose(code){};RedDwarf.SimpleClient.prototype.onData=function onData(msg){this._messageFilter.receive(msg,this);};RedDwarf.SimpleClient.prototype.onRawMessage=function onRawMessage(msg){this.receivedMessage(new RedDwarf.ByteArray(msg));};RedDwarf.SimpleClient.prototype.dispatchRedDwarfEvent=function dispatchRedDwarfEvent(e){var listenerFunctionName="on_"+e.eventType();for(var i=0,n=this._eventListeners.length;i<n;++i){var listener=this._eventListeners[i];var listenerFunction=listener[listenerFunctionName];if(listenerFunction!=null){listenerFunction.call(listener,e,this);}}};RedDwarf.SimpleClient.prototype.registerListener=function registerListener(listener){this._eventListeners.push(listener);};RedDwarf.SimpleClient.prototype.receivedMessage=function receivedMessage(message){var command=message.readByte();if(command==RedDwarf.SimpleProtocol.LOGIN_SUCCESS)
{var reconnectKey=message.readRemainingBytes();this.dispatchRedDwarfEvent(new RedDwarf.Event(RedDwarf.Event.LOGIN_SUCCESS));}
else if(command==RedDwarf.SimpleProtocol.LOGIN_FAILURE)
{var e=new RedDwarf.Event(RedDwarf.Event.LOGIN_FAILURE);e.failureMessage=message.readSgsString();this.dispatchRedDwarfEvent(e);}
else if(command==RedDwarf.SimpleProtocol.LOGIN_REDIRECT)
{var newHost=message.readSgsString();var newPort=message.readInt();var e=new RedDwarf.Event(RedDwarf.Event.LOGIN_REDIRECT);e.host=newHost;e.port=newPort;this.dispatchRedDwarfEvent(e);}
else if(command==RedDwarf.SimpleProtocol.RECONNECT_SUCCESS)
{var reconnectKey=message.readRemainingBytes();this.dispatchRedDwarfEvent(new RedDwarf.Event(RedDwarf.Event.RECONNECT_SUCCESS));}
else if(command==RedDwarf.SimpleProtocol.RECONNECT_FAILURE)
{var e=new RedDwarf.Event(RedDwarf.Event.RECONNECT_FAILURE);e.failureMessage=message.readSgsString();this.dispatchRedDwarfEvent(e);}
else if(command==RedDwarf.SimpleProtocol.SESSION_MESSAGE)
{var e=new RedDwarf.Event(RedDwarf.Event.SESSION_MESSAGE);e.sessionMessage=message.readRemainingBytes();this.dispatchRedDwarfEvent(e);}
else if(command==RedDwarf.SimpleProtocol.LOGOUT_SUCCESS)
{var e=new RedDwarf.Event(RedDwarf.Event.LOGOUT);this.dispatchRedDwarfEvent(e);}
else if(command==RedDwarf.SimpleProtocol.CHANNEL_JOIN)
{var channelName=message.readSgsString();var channel=new RedDwarf.ClientChannel(channelName,message.readRemainingBytes());this._channels.put(channel.uniqueId(),channel);var e=new RedDwarf.Event(RedDwarf.Event.CHANNEL_JOIN);e.channel=channel;this.dispatchRedDwarfEvent(e);}
else if(command==RedDwarf.SimpleProtocol.CHANNEL_MESSAGE)
{var channel=this._channels.get(RedDwarf.ClientChannel.bytesToChannelId(message.readSgsString()));var e=new RedDwarf.Event(RedDwarf.Event.CHANNEL_MESSAGE);e.channel=channel;e.channelMessage=message.readRemainingBytes();this.dispatchRedDwarfEvent(e);}
else if(command==RedDwarf.SimpleProtocol.CHANNEL_LEAVE)
{var channel=this._channels.get(RedDwarf.ClientChannel.bytesToChannelId(message.readRemainingBytes()));if(channel!=null){this._channels.remove(channel.uniqueId());var e=new RedDwarf.Event(RedDwarf.Event.CHANNEL_LEAVE);e.channel=channel;this.dispatchRedDwarfEvent(e);}}
else
{throw new Error("Undefined protocol command:"+command);}};})();