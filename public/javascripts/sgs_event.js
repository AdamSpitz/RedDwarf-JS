function SgsEvent(type) {
  this._eventType = type;
  this.type = type;
}

(function() {
SgsEvent.prototype.eventType = function eventType() { return this._eventType; };

SgsEvent.LOGIN_SUCCESS     = "loginSuccess";
SgsEvent.LOGIN_FAILURE     = "loginFailure";
SgsEvent.LOGIN_REDIRECT    = "loginRedirect";
SgsEvent.RECONNECT_SUCCESS = "reconnectSuccess";
SgsEvent.RECONNECT_FAILURE = "reconnectFailure";
SgsEvent.SESSION_MESSAGE   = "sessionMessage";
SgsEvent.LOGOUT            = "logout";
SgsEvent.CHANNEL_JOIN      = "channelJoin";
SgsEvent.CHANNEL_MESSAGE   = "channelMessage";
SgsEvent.CHANNEL_LEAVE     = "channelLeave";
SgsEvent.RAW_MESSAGE       = "rawMessage";

})();
