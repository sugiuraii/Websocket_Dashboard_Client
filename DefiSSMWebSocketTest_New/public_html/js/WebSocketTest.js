/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var WebsocketCommon = function()
{
    'use strict';
    this._ws;
    this.URL;
    this.onERRpacketReceived = function(msg){};
    this.onRESpacketReceived = function(msg){};
    this.onWebsocketOpen = function(){};
    this.onWebsocketClose = function(){};
    this.onWebsocketError = function(msg)
    {
      alert(msg);  
    };
};

WebsocketCommon.prototype.Connect = function() { 
    'use strict';    
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

WebsocketCommon.prototype.Close = function()
{
    'use strict';
    if(this._ws){
        this._ws.close();
    };
};

var DefiSSMWebsocketCommon = function()
{
    'use strict';
    WebsocketCommon.call(this);    

    this.ModePrefix;

    this.RecordIntervalTimeIsEnabled = true;
    
    /**
     * Timestamp of previous arrival of VAL packet.
     * @private 
     */
    this._valPacketPreviousTimeStamp = window.performance.now();
    /**
     * VAL packet interval time.
     * @private
     */
    this._valPacketIntervalTime = 0;
    
    var self = this;
    Object.defineProperty(this, "ValPacketIntervalTime", 
    {
        get : function()
        {
            return self._valPacketIntervalTime;
        }
    });
    this.onVALpacketReceived = function(val){};
};
Object.setPrototypeOf(DefiSSMWebsocketCommon.prototype, WebsocketCommon.prototype);

DefiSSMWebsocketCommon.prototype._parseIncomingMessage = function(message){
    'use strict';
    var received_json_object = JSON.parse(message);    
    
    switch(received_json_object.mode)
    {
        case ("VAL") :
            if(this.RecordIntervalTimeIsEnabled)
            {
                var nowTime = window.performance.now();
                this._valPacketIntervalTime = nowTime - Number(this._valPacketPreviousTimeStamp);
                this._valPacketPreviousTimeStamp = nowTime;
            };
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

var DefiCOM_Websocket = function()
{
    'use strict';
    DefiSSMWebsocketCommon.call(this);
    this.ModePrefix = "DEFI";
};
Object.setPrototypeOf(DefiCOM_Websocket.prototype, DefiSSMWebsocketCommon.prototype);

DefiCOM_Websocket.prototype.SendDefiWSSend = function(code,flag)
{
    'use strict';
    var obj={
      mode : this.ModePrefix + "_WS_SEND",
      code : code,
      flag : flag
    };
    
    var jsonstr = JSON.stringify(obj);
    this._ws.send(jsonstr);
};

DefiCOM_Websocket.prototype.SendDefiWSInterval = function(interval)
{
    'use strict';
    var obj={
      mode : this.ModePrefix + "_WS_INTERVAL",
      interval : interval
    };
    
    var jsonstr = JSON.stringify(obj);
    
    this._ws.send(jsonstr);    
};

var ArduinoCOM_Websocket = function()
{
    'use strict';
    DefiCOM_Websocket.call(this);
    this.ModePrefix = "ARDUINO"; 
};
Object.setPrototypeOf(ArduinoCOM_Websocket.prototype, DefiCOM_Websocket.prototype);

var SSMCOM_Websocket = function()
{
    'use strict';
    DefiSSMWebsocketCommon.call(this);
    this.ModePrefix = "SSM";
};
Object.setPrototypeOf(SSMCOM_Websocket.prototype, DefiSSMWebsocketCommon.prototype);

SSMCOM_Websocket.prototype.SendSSMCOMRead = function(code, mode, flag)
{
    'use strict';
    var obj={
      mode : this.ModePrefix + "_COM_READ",
      code : code,
      read_mode : mode,
      flag : flag
    };
    
    var jsonstr = JSON.stringify(obj);
    this._ws.send(jsonstr);
};

SSMCOM_Websocket.prototype.SendSSMSlowreadInterval = function(interval)
{
    'use strict';
    var obj={
      mode : this.ModePrefix + "_SLOWREAD_INTERVAL",
      interval : interval
    };
    
    var jsonstr = JSON.stringify(obj);
    
    this._ws.send(jsonstr);    
};

var ELM327COM_Websocket = function()
{
    'use strict';
    SSMCOM_Websocket.call(this);
    this.ModePrefix = "ELM327";
};
Object.setPrototypeOf(ELM327COM_Websocket.prototype, SSMCOM_Websocket.prototype);

var FUELTRIP_Websocket = function()
{
    WebsocketCommon.call(this);
    this.onMomentFUELTRIPpacketReceived = function(moment_gasmilage, total_gas, total_trip, total_gasmilage){};
    this.onSectFUELTRIPpacketReceived = function(sect_span, sect_trip, sect_gas, sect_gasmilage){};
};
Object.setPrototypeOf(FUELTRIP_Websocket.prototype, WebsocketCommon.prototype);

FUELTRIP_Websocket.prototype.SendSectSpan = function(sect_span)
{
    var obj={
      mode : "SECT_SPAN",
      sect_span : sect_span
    };
    
    var jsonstr = JSON.stringify(obj);
    this._ws.send(jsonstr);
};

FUELTRIP_Websocket.prototype.SendReset = function()
{
    var obj={
      mode : "RESET"
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
