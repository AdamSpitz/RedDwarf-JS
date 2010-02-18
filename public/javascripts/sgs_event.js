(function() {

RedDwarf.Event = function Event(type) {
  this._eventType = type;
  this.type = type;
};

RedDwarf.Event.prototype.eventType = function eventType() { return this._eventType; };

RedDwarf.Event.LOGIN_SUCCESS     = "loginSuccess";
RedDwarf.Event.LOGIN_FAILURE     = "loginFailure";
RedDwarf.Event.LOGIN_REDIRECT    = "loginRedirect";
RedDwarf.Event.RECONNECT_SUCCESS = "reconnectSuccess";
RedDwarf.Event.RECONNECT_FAILURE = "reconnectFailure";
RedDwarf.Event.SESSION_MESSAGE   = "sessionMessage";
RedDwarf.Event.LOGOUT            = "logout";
RedDwarf.Event.CHANNEL_JOIN      = "channelJoin";
RedDwarf.Event.CHANNEL_MESSAGE   = "channelMessage";
RedDwarf.Event.CHANNEL_LEAVE     = "channelLeave";
RedDwarf.Event.RAW_MESSAGE       = "rawMessage";

})();
