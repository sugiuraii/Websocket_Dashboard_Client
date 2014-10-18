/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var FUELTRIP_Websocket = function()
{
    this._ws;
    this.URL;
    this.onMomentFUELTRIPpacketReceived = function(moment_gasmilage, total_gas, total_trip, total_gasmilage){};
    this.onSectFUELTRIPpacketReceived = function(sect_span, sect_trip, sect_gas, sect_gasmilage){};
    this.onERRpacketReceived = function(msg){};
    this.onRESpacketReceived = function(msg){};
    this.onWebsocketOpen = function(){};
    this.onWebsocketClose = function(){};
    this.onWebsocketError = function(msg)
    {
      alert(msg);  
    };
};

FUELTRIP_Websocket.prototype.SendSectSpan = function(sect_span)
{
    var obj={
      mode : "SECT_SPAN",
      sect_span : sect_span
    };
    
    var jsonstr = JSON.stringify(obj);
    this._ws.send(jsonstr);
};

FUELTRIP_Websocket.prototype.SendSectStoreMax = function(storemax)
{
    var obj={
      mode : "SECT_STOREMAX",
      storemax : storemax
    };
    
    var jsonstr = JSON.stringify(obj);
    
    this._ws.send(jsonstr);    
};

FUELTRIP_Websocket.prototype._parseIncomingMessage = function(message){
    var received_json_object = JSON.parse(message);
    switch(received_json_object.mode)
    {
        case ("MOMENT_FUELTRIP") :
            this.onMomentFUELTRIPpacketReceived(received_json_object.moment_gasmilage,
            received_json_object.total_gas,
            received_json_object.total_trip,
            received_json_object.total_gasmilage);
            break;
        case ("SECT_FUELTRIP") :
            this.onSectFUELTRIPpacketReceived(received_json_object.sect_span,
            received_json_object.sect_trip,
            received_json_object.sect_gas,
            received_json_object.sect_gasmilage);
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

FUELTRIP_Websocket.prototype.Connect = function() { 
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

FUELTRIP_Websocket.prototype.Close = function()
{
    if(this._ws){
        this._ws.close();
    };
};

