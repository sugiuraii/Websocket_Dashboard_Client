/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SSMCOM_Websocket = function()
{
    this._ws;
    this.URL;
    this.onVALpacketReceived = function(val){};
    this.onERRpacketReceived = function(msg){};
    this.onRESpacketReceived = function(msg){};
    this.onWebsocketOpen = function(){};
    this.onWebsocketClose = function(){};
    this.onWebsocketError = function(msg)
    {
      alert(msg);  
    };
};

SSMCOM_Websocket.prototype.SendSSMCOMRead = function(code, mode, flag)
{
    var obj={
      mode : "SSM_COM_READ",
      code : code,
      read_mode : mode,
      flag : flag
    };
    
    var jsonstr = JSON.stringify(obj);
    this._ws.send(jsonstr);
};

SSMCOM_Websocket.prototype.SendSSMSlowreadInterval = function(interval)
{
    var obj={
      mode : "SSM_SLOWREAD_INTERVAL",
      interval : interval
    };
    
    var jsonstr = JSON.stringify(obj);
    
    this._ws.send(jsonstr);    
};

SSMCOM_Websocket.prototype._parseIncomingMessage = function(message){
    var received_json_object = JSON.parse(message);
    switch(received_json_object.mode)
    {
        case ("VAL") :
            this.onVALpacketReceived(received_json_object.val);
            break;
        case("ERR"):
            this.onERRpacketReceived(received_json_object.msg);
            break;
        case("RES"):
            this.onRESpacketReceived(received_json_object.msg);
            break;
        default:
            this.onWebsocketError("Unknown mode packet received. " + message);
    };
};

SSMCOM_Websocket.prototype.Connect = function() { 
    var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);

    if (support === null) {
       this.onWebsocketError("Websocket is not supported.");
        return;
    };
    this._ws = new window[support](this.URL); 
    
    // store self reference in order to register event handler.
    var self = this;
    // when data is comming from the server, this metod is called
    this._ws.onmessage = function (evt) {
        self._parseIncomingMessage(evt.data);
    };
    // when the connection is established, this method is called
    this._ws.onopen = function () {
        self.onWebsocketOpen();
    };
    // when the connection is closed, this method is called
    this._ws.onclose = function () {
        self.onWebsocketClose();
    };
};

SSMCOM_Websocket.prototype.Close = function()
{
    if(this._ws){
        this._ws.close();
    };
};

SSMCOM_Websocket.prototype.getReadyState = function()
{
    return this._ws.readyState;
};
