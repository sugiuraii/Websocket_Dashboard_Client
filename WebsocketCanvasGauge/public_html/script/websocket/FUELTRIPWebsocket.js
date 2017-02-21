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

var FUELTRIP_Websocket = function()
{
    'use strict';
    this._ws;
    this.URL;
    this.ModePrefix = "FUELTRIP";
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
    'use strict';
    var obj={
      mode : "SECT_SPAN",
      sect_span : sect_span
    };
    
    var jsonstr = JSON.stringify(obj);
    this._ws.send(jsonstr);
};

FUELTRIP_Websocket.prototype.SendReset = function()
{
    'use strict';
    var obj={
      mode : "RESET"
    };
    
    var jsonstr = JSON.stringify(obj);
    
    this._ws.send(jsonstr);    
};

FUELTRIP_Websocket.prototype.SendSectStoreMax = function(storemax)
{
    'use strict';
    var obj={
      mode : "SECT_STOREMAX",
      storemax : storemax
    };
    
    var jsonstr = JSON.stringify(obj);
    
    this._ws.send(jsonstr);    
};

FUELTRIP_Websocket.prototype._parseIncomingMessage = function(message){
    'use strict';
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

FUELTRIP_Websocket.prototype.Close = function()
{
    'use strict';
    if(this._ws){
        this._ws.close();
    };
};

FUELTRIP_Websocket.prototype.getReadyState = function()
{
    'use strict';
    if(typeof this._ws === "undefined")
        return -1;

    return this._ws.readyState;
};
