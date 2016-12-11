/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var GaugeControl = function()
{
    this._Defi_WS = null;
    this._SSM_WS = null;
    this._Arduino_WS = null;
    this._ELM327_WS = null;
    this._FUELTRIP_WS = null;
    
    this.Defi_WS_URL = "ws://"+location.hostname+":2012/";
    this.SSM_WS_URL =  "ws://"+location.hostname+":2013/";
    this.Arduino_WS_URL = "ws://"+location.hostname+":2015/";
    this.ELM327_WS_URL = "ws://"+location.hostname+":2016/";
    this.FUELTRIP_WS_URL = "ws://"+location.hostname+":2014/";
    
    this.SSM_SlowFastReadFlagList = {};
    this.ELM327_SlowFastReadFlagList = {};
    
    this.MessageWindowID = '#div_message';
    this.Defi_StatusIndicatorID = "#defi_status";
    this.SSM_StatusIndicatorID = "#ssm_status";
    this.Arduino_StatusIndicatorID = "#arduino_status";
    this.ELM327_StatusIndicatorID = "#elm327_status";
    this.FUELTRIP_StatusIndicatorID = "#fueltrip_status";
    
    this.DEFIARDUINOWSInverval_SpinnerID = "#spinner_defiWSinterval";
    
    this.WaitTimeAfterWebSocketOpenClose = 5000;
};

GaugeControl.prototype = {
    //public
    EnableDefiWebSocket : function()
    {
        this._Defi_WS = new DefiCOM_Websocket();
        this._initializeWebSocket(this._Defi_WS);
    },
    EnableSSMWebSocket : function()
    {
        this._SSM_WS = new SSMCOM_Websocket();
        this._initializeWebSocket(this._SSM_WS);
    },
    EnableArduinoWebSocket : function()
    {
        this._Arduino_WS = new ArduinoCOM_Websocket();
        this._initializeWebSocket(this._Arduino_WS);
    },
    EnableELM327WebSocket : function()
    {
        this._ELM327_WS = new ELM327COM_Websocket();
        this._initializeWebSocket(this._ELM327_WS);
    },
    EnableFUELTRIPWebSocket : function()
    {
        this._FUELTRIP_WS = new FUELTRIP_Websocket();
        this._initializeWebSocket(this._FUELTRIP_WS);
    },
    RegisterDefiParameterCode : function(code, receivedEventHandler)
    {
        if(this._Defi_WS !== null)
            this._Defi_WS.onVALpacketReceived[code] = receivedEventHandler;
        else
            this._appendDebugMessage("DEFI", "ParameterCode Register is required. But Websocket is not enabled.");
    },
    RegisterArduinoParameterCode : function(code, receivedEventHandler)
    {
        if(this._Arduino_WS !== null)
            this._Arduino_WS.onVALpacketReceived[code] = receivedEventHandler;
        else
            this._appendDebugMessage("ARDUINO", "ParameterCode Register is required. But Websocket is not enabled."); 
    },
    RegisterSSMParameterCode : function(code, SlowFastFlag, receivedEventHandler)
    {
        if(SlowFastFlag !== "Slow" && SlowFastFlag !== "Fast"  && SlowFastFlag !== "Slow+Fast")
            this._appendDebugMessage("SSM", "SlowFastFlag is "+SlowFastFlag+". Not Slow or Fast or Slow+Fast.");
        else if (this._SSM_WS !== null)
        {
            // SSM SlowFastReadFlag is managed by parameter code. Not switch code. If switch code is assinged, need conversion.
            this.SSM_SlowFastReadFlagList[this._convertSSMSwitchCodeToNumericCode(code)] = SlowFastFlag;
            this._SSM_WS.onVALpacketReceived[code] = receivedEventHandler;
        }
        else
            this._appendDebugMessage("SSM", "ParameterCode Register is required. But Websocket is not enabled."); 

    },
    RegisterELM327ParameterCode : function(code, SlowFastFlag, receivedEventHandler)
    {
        if(SlowFastFlag !== "Slow" && SlowFastFlag !== "Fast"  && SlowFastFlag !== "Slow+Fast")
            this._appendDebugMessage("ELM327", "SlowFastFlag is "+SlowFastFlag+". Not Slow or Fast or Slow+Fast.");
        else if (this._ELM327_WS !== null)
        {
            this.ELM327_SlowFastReadFlagList[code] = SlowFastFlag;
            this._ELM327_WS.onVALpacketReceived[code] = receivedEventHandler;
        }
        else
            this._appendDebugMessage("ELM327", "ParameterCode Register is required. But Websocket is not enabled."); 

    },
    RegisterFUELTRIPPacketRecivedEvent : function(type, receivedEventHandler)
    {
        if(this._FUELTRIP_WS !== null)
            if(type === "MOMENT")
                this._FUELTRIP_WS.onMomentFUELTRIPpacketReceived = receivedEventHandler;
            else if (type === "SECT")
                this._FUELTRIP_WS.onSectFUELTRIPpacketReceived = receivedEventHandler;
            else
                this._appendDebugMessage("FUELTRIP", "PacketReceivedEvent Register is required. But type is nether MOMENT nor SECT."); 
        else
            this._appendDebugMessage("FUELTRIP", "PacketReceivedEvent Register is required. But Websocket is not enabled."); 

    },
    ConnectWebSocket : function()
    {
        if(this._Defi_WS !== null)
        {
            this._Defi_WS.URL = this.Defi_WS_URL;
            this._Defi_WS.Connect();
        }
        if(this._SSM_WS !== null)
        {
            this._SSM_WS.URL = this.SSM_WS_URL;
            this._SSM_WS.Connect();
        }
        if(this._Arduino_WS !== null)
        {
            this._Arduino_WS.URL = this.Arduino_WS_URL;
            this._Arduino_WS.Connect();
        }
        if(this._ELM327_WS !== null)
        {
            this._ELM327_WS.URL = this.ELM327_WS_URL;
            this._ELM327_WS.Connect();
        }
        if(this._FUELTRIP_WS !== null)
        {
            this._FUELTRIP_WS.URL = this.FUELTRIP_WS_URL;
            this._FUELTRIP_WS.Connect();
        }
    },
    DisconnectWebSocket : function()
    {
        if(this._Defi_WS !== null)
            this._Defi_WS.Close();
        if(this._SSM_WS !== null)
            this._SSM_WS.Close();
        if(this._Arduino_WS !== null)
            this._Arduino_WS.Close();
        if(this._ELM327_WS !== null)
            this._ELM327_WS.Close();
        if(this._FUELTRIP_WS !== null)
            this._FUELTRIP_WS.Close();
    },
    CheckWebSocketStatus : function()
    {
        this._changeWebSocketIndicator(this._Defi_WS, this.Defi_StatusIndicatorID);
        this._changeWebSocketIndicator(this._SSM_WS, this.SSM_StatusIndicatorID);
        this._changeWebSocketIndicator(this._Arduino_WS, this.Arduino_StatusIndicatorID);
        this._changeWebSocketIndicator(this._ELM327_WS, this.ELM327_StatusIndicatorID);
        this._changeWebSocketIndicator(this._FUELTRIP_WS, this.FUELTRIP_StatusIndicatorID);
    },
    ShowDebugMessage : function()
    {
        if($(this.MessageWindowID).css("display") === "none")
        {
            //Show debug message window
            $(this.MessageWindowID).css("display","inline");                    
        }
        else
        {
            //Hide debug message window
            $(this.MessageWindowID).css("display","none");
        }
    },
    ResetFuelTrip : function()
    {
        if(this._FUELTRIP_WS === null)
        {
            this._appendDebugMessage("FUELTRIP", "ResetFuelTrip() is called. But FUELTRIP_WS is null");
        }
        else if(window.confirm('Reset fuel and trip?'))
        {
            this._FUELTRIP_WS.SendReset();
        };
    },
    DefiArduinoWSIntervalChange : function()
    {
        var interval = $(this.DEFIARDUINOWSInverval_SpinnerID).val();
        if(this._Defi_WS !== null)
            this._Defi_WS.SendWSInterval(interval);
        if(this._Arduino_WS !== null)
            this._Arduino_WS.SendWSInterval(interval);
        localStorage.WSInterval = interval;
    },
    //private
    _initializeWebSocket : function(webSocketObj)
    {
        var self = this;
        webSocketObj.onERRpacketReceived = function(msg)
        {
            self._appendDebugMessage(webSocketObj.ModePrefix, msg);
        };
        webSocketObj.onRESpacketReceived = function(msg)
        {
            self._appendDebugMessage(webSocketObj.ModePrefix, msg);
        };
        webSocketObj.onWebsocketError = function(msg)
        {
            self._appendDebugMessage(webSocketObj.ModePrefix, msg);
        };
        webSocketObj.onWebsocketOpen = function()
        {
            self._appendDebugMessage(webSocketObj.ModePrefix, "Connection started");
            // call _websocketCommunicationOnOpen(webSocketObj) 5(changeable by WaitTimeAfterWebSocketOpenClose) sec after websocket open.
            setTimeout(self._websocketCommunicationOnOpen(webSocketObj), self.WaitTimeAfterWebSocketOpenClose);
        };  
        webSocketObj.onWebsocketClose = function()
        {
            self._appendDebugMessage(webSocketObj.ModePrefix, "Connection closed");
            self._appendDebugMessage(webSocketObj.ModePrefix, "Reconnect after 5sec...");
            setTimeout(
            function(){
                webSocketObj.Connect();
            }, self.WaitTimeAfterWebSocketOpenClose);                
        };
    },
    _appendDebugMessage : function(prefix,message)
    {
        var output_message = prefix + " : "  + message;
        $(this.MessageWindowID).append(output_message + '<br/>');
    },
    _changeWebSocketIndicator : function(webSocketObj, indicatorElementID)
    {
        //Check if indicator element exists or not
        if($(indicatorElementID)[0])
        {
            if(webSocketObj === null)
                $(indicatorElementID).css("color","gray");
            else
            {
                switch(webSocketObj.getReadyState()) 
                { 
                    case 0://CONNECTING
                        $(indicatorElementID).css("color","blue");
                        break;
                    case 1://OPEN
                        $(indicatorElementID).css("color","green");
                        break;
                    case 2://CLOSING
                        $(indicatorElementID).css("color","orange");
                        break;
                    case 3://CLOSED
                        $(indicatorElementID).css("color","red");
                        break;
                    default:
                        // this never happens
                        break;                      
                }
            }
        }
    },
    _websocketCommunicationOnOpen : function(webSocketObj)
    {
        if(webSocketObj.ModePrefix === "DEFI" || webSocketObj.ModePrefix === "ARDUINO")
        {
            for(var paramCodekey in webSocketObj.onVALpacketReceived)
                webSocketObj.SendWSSend(paramCodekey, "true");
            webSocketObj.SendWSInterval(localStorage.WSInterval);
            $(this.DEFIARDUINOWSInverval_SpinnerID).val(localStorage.WSInterval);
        }
        else if (webSocketObj.ModePrefix === "SSM" || webSocketObj.ModePrefix === "ELM327" )
        {
            for(var paramCodekey in webSocketObj.onVALpacketReceived)
            {
                var readMode;
                var convertedParamCodeKey;
                if(webSocketObj.ModePrefix === "SSM")
                {
                    convertedParamCodeKey = this._convertSSMSwitchCodeToNumericCode(paramCodekey);
                    readMode = this.SSM_SlowFastReadFlagList[convertedParamCodeKey];
                }
                else if(webSocketObj.ModePrefix === "ELM327")
                {
                    convertedParamCodeKey = paramCodekey;
                    readMode = this.ELM327_SlowFastReadFlagList[paramCodekey];
                }
                
                if(readMode === "Slow")
                    webSocketObj.SendCOMRead(convertedParamCodeKey, "SLOW", "true");
                else if(readMode === "Fast")
                    webSocketObj.SendCOMRead(convertedParamCodeKey, "FAST", "true");
                else if(readMode === "Slow+Fast")
                {
                    webSocketObj.SendCOMRead(convertedParamCodeKey, "SLOW", "true");
                    webSocketObj.SendCOMRead(convertedParamCodeKey, "FAST", "true");
                }
                else
                    this._appendDebugMessage(convertedParamCodeKey.ModePrefix, "Bug: readMode property is wrong.");
            }
        }
        else if (webSocketObj.ModePrefix === "FUELTRIP")
        {
            //Do nothing.
        }
    },
    _convertSSMSwitchCodeToNumericCode : function(paramCodeKey)
    {
        switch(paramCodeKey){
            case "AT_Vehicle_ID" : 
            case "Test_Mode_Connector" : 
            case "Read_Memory_Connector" : 
                return "Switch_P0x061";
            break;

            case "Neutral_Position_Switch" : 
            case "Idle_Switch" : 
            case "Intercooler_AutoWash_Switch" : 
            case "Ignition_Switch" : 
            case "Power_Steering_Switch" : 
            case "Air_Conditioning_Switch" : 
                return "Switch_P0x062";
            break;

            case "Handle_Switch" : 
            case "Starter_Switch" : 
            case "Front_O2_Rich_Signal" : 
            case "Rear_O2_Rich_Signal" : 
            case "Front_O2_2_Rich_Signal" : 
            case "Knock_Signal_1" : 
            case "Knock_Signal_2" : 
            case "Electrical_Load_Signal" : 
                return "Switch_P0x063";
            break;

            case "Crank_Position_Sensor" : 
            case "Cam_Position_Sensor" : 
            case "Defogger_Switch" : 
            case "Blower_Switch" : 
            case "Interior_Light_Switch" : 
            case "Wiper_Switch" : 
            case "AirCon_Lock_Signal" : 
            case "AirCon_Mid_Pressure_Switch" : 
                return "Switch_P0x064";
            break;

            case "AirCon_Compressor_Signal" : 
            case "Radiator_Fan_Relay_3" : 
            case "Radiator_Fan_Relay_1" : 
            case "Radiator_Fan_Relay_2" : 
            case "Fuel_Pump_Relay" : 
            case "Intercooler_AutoWash_Relay" : 
            case "CPC_Solenoid_Valve" : 
            case "BlowBy_Leak_Connector" :
                return "Switch_P0x065";
            break;

            case "PCV_Solenoid_Valve" : 
            case "TGV_Output" : 
            case "TGV_Drive" : 
            case "Variable_Intake_Air_Solenoid" : 
            case "Pressure_Sources_Change" : 
            case "Vent_Solenoid_Valve" : 
            case "P_S_Solenoid_Valve" : 
            case "Assist_Air_Solenoid_Valve" : 
                return "Switch_P0x066";
            break;

            case "Tank_Sensor_Control_Valve" : 
            case "Relief_Valve_Solenoid_1" : 
            case "Relief_Valve_Solenoid_2" : 
            case "TCS_Relief_Valve_Solenoid" : 
            case "Ex_Gas_Positive_Pressure" : 
            case "Ex_Gas_Negative_Pressure" : 
            case "Intake_Air_Solenoid" : 
            case "Muffler_Control" : 
                return "Switch_P0x067";
            break;

            case "Retard_Signal_from_AT" : 
            case "Fuel_Cut_Signal_from_AT" : 
            case "Ban_of_Torque_Down" : 
            case "Request_Torque_Down_VDC" : 
                return "Switch_P0x068";
            break;

            case "Torque_Control_Signal_1" : 
            case "Torque_Control_Signal_2" : 
            case "Torque_Permission_Signal" : 
            case "EAM_Signal" : 
            case "AT_coop_lock_up_signal" : 
            case "AT_coop_lean_burn_signal" : 
            case "AT_coop_rich_spike_signal" : 
            case "AET_Signal" : 
                return "Switch_P0x069";
            break;

            case "ETC_Motor_Relay" : 
                return "Switch_P0x120";
            break;

            case "Clutch_Switch" : 
            case "Stop_Light_Switch" : 
            case "Set_Coast_Switch" : 
            case "Rsume_Accelerate_Switch" : 
            case "Brake_Switch" : 
            case "Accelerator_Switch" :
                return "Switch_P0x121";
            break;
            
            default :
                return paramCodeKey;
            break;
        }
    }
};
