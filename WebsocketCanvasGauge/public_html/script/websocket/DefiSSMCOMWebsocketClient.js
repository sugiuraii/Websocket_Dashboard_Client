/* 
 * Copyright (c) 2017, Sugiura K.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Superclass of Websocket classes.
 * @constructor
 * @returns {WebsocketCommon}
 */
var WebsocketCommon = function()
{
    'use strict';
    /**
     * Websocket obj.
     * @private
    */
    this._ws;
    /**
     * URL of server
     */
    this.URL;
    /**
     * Event on ERR packet is received.
     * @param {msg} msg JSON of message.
     */
    this.onERRpacketReceived = function(msg){};
    /**
     * Event on RES packet is received.
     * @param {msg} msg JSON of message.
     */
    this.onRESpacketReceived = function(msg){};
    /**
     * Event on websocket open.
     */
    this.onWebsocketOpen = function(){};
    /**
     * Event on websocket close.
     */
    this.onWebsocketClose = function(){};
    this.onWebsocketError = function(msg)
    {
      alert(msg);  
    };
};

/**
 * Connect websocket.
 */
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

/**
 * Send reset packet.
 * @returns {undefined}
 */
WebsocketCommon.prototype.SendReset = function()
{
    'use strict';
    var obj={
      mode : "RESET"
    };
    
    var jsonstr = JSON.stringify(obj);
    
    this._ws.send(jsonstr);    
};

/**
 * Close websocket.
 */
WebsocketCommon.prototype.Close = function()
{
    'use strict';
    if(this._ws){
        this._ws.close();
    };
};

/**
 * Get websocket ready state.
 * @return {Number} Websocket state.
 */
WebsocketCommon.prototype.getReadyState = function()
{
    'use strict';
    if(typeof this._ws === "undefined")
        return -1;
    
    return this._ws.readyState;
};

/**
 * Superclass of Defi/SSM/Arduino/ELM327 websocket.
 * @returns {DefiSSMWebsocketCommon}
 */
var DefiSSMWebsocketCommon = function()
{
    'use strict';
    WebsocketCommon.call(this);    
    /**
     * Prefix of modecode. (Do not change).
     */
    this.ModePrefix;
    
    /**
     * Switch to take packet interval time.
     */
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
    /**
     * Event on VAL packet is received.
     * @param {VALPacketJSON} val Incoming val packet data.
     */
    this.onVALpacketReceived = function(val){};
};
Object.setPrototypeOf(DefiSSMWebsocketCommon.prototype, WebsocketCommon.prototype);

/**
 * Parse incomming JSON mesage
 * @param {JSON} message JSON message to parse.
 */
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
            
            for (var key in received_json_object.val)
            {
                if(key in this.onVALpacketReceived)
                    this.onVALpacketReceived[key](received_json_object.val[key]);
            }
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

/**
 * DefiCOM_Websocket class.
 * @constructor
 * @returns {DefiCOM_Websocket}
 */
var DefiCOM_Websocket = function()
{
    'use strict';
    DefiSSMWebsocketCommon.call(this);
    /**
     * Prefix of modecode. (Do not change).
     */
    this.ModePrefix = "DEFI";
};
Object.setPrototypeOf(DefiCOM_Websocket.prototype, DefiSSMWebsocketCommon.prototype);

/**
 * Send DEFI(ARDUINO)_WS_SEND to enable or disable defi(arduino) parameter.
 * @param {String} code Defi(Arduino) parameter code to set.
 * @param {String} flag Enable or disable flag. ("true" or "false")
 */
DefiCOM_Websocket.prototype.SendWSSend = function(code,flag)
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

/**
 * Send DEFI(ARDUINO)_WS_INTERVAL to set inverval for sending VAL message.
 * @param {Numeric} interval of VAL message. (more than 0. 0:No interval).
 */
DefiCOM_Websocket.prototype.SendWSInterval = function(interval)
{
    'use strict';
    var obj={
      mode : this.ModePrefix + "_WS_INTERVAL",
      interval : interval
    };
    
    var jsonstr = JSON.stringify(obj);
    
    this._ws.send(jsonstr);    
};

/**
 * ArduinoCOM_Websocket class.
 * @constructor
 */
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

SSMCOM_Websocket.prototype.SendCOMRead = function(code, mode, flag)
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

SSMCOM_Websocket.prototype.SendSlowreadInterval = function(interval)
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
    'use strict';
    this.ModePrefix = "FUELTRIP";
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
