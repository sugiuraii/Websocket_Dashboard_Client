/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var DefiCOM_Websocket = function(url)
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

DefiSSMCOM_Websocket.prototype.SendDefiWSSend = function(code,flag)
{
    var obj={
      mode : "DEFI_WS_SEND",
      code : code,
      flag : flag
    };
    
    var jsonstr = JSON.stringify(obj);
    this._ws.send(jsonstr);
};

DefiSSMCOM_Websocket.prototype.SendDefiWSInterval = function(interval)
{
    var obj={
      mode : "DEFI_WS_INTERVAL",
      interval : $('#interval_DEFI_WS_INTERVAL').val()
    };
    
    var jsonstr = JSON.stringify(obj);
    
    this._ws.send(jsonstr);    
};

DefiSSMCOM_Websocket.prototype._parseIncomingMessage = function(message){
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

DefiSSMCOM_WebSocket.prototype.Connect = function() { 
    var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);

    if (support === null) {
       this.onWebsocketError("Websocket is not supported.");
        return;
    };
    this._ws = new window[support](this.URL); 
    
    // when data is comming from the server, this metod is called
    ws.onmessage = function (evt) {
        this._parseIncomingMessage(evt.data);
    };
    // when the connection is established, this method is called
    ws.onopen = function () {
        this.onWebsocketOpen();
    };
    // when the connection is closed, this method is called
    ws.onclose = function () {
        this.onWebsocketClose();
    };
};

DefiSSMCOM_WebSocket.prototype.Close = function()
{
    if(this._ws){
        this._ws.close();
    };
};

