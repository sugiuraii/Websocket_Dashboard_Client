/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function appendDebugMessage(prefix,message)
 {
     var output_message = prefix + " : "  + message;
     $('#div_message').append(output_message + '<br/>');
 };

function setMeterDefault(defi_ws, ssm_ws, fueltrip_ws)
{
    if(defi_ws !== null)
    {
        defi_ws.onERRpacketReceived = function(msg)
        {
            appendDebugMessage("Defi", msg);
        };
        defi_ws.onRESpacketReceived = function(msg)
        {
            appendDebugMessage("Defi", msg);
        };
        defi_ws.onWebsocketError = function(msg)
        {
            appendDebugMessage("Defi", msg);
        };
        defi_ws.onWebsocketClose = function()
        {
            appendDebugMessage("Defi", "Connection closed");
            appendDebugMessage("Defi", "Reconnect after 5sec...");
            setTimeout(
            function(){
                defi_ws.Connect();
            }, 5000);                
        };
    }
    
    if(ssm_ws !== null)
    {
        ssm_ws.onERRpacketReceived = function(msg)
        {
            appendDebugMessage("SSM", msg);
        };
        ssm_ws.onRESpacketReceived = function(msg)
        {
            appendDebugMessage("SSM", msg);
        };
        ssm_ws.onWebsocketError = function(msg)
        {
            appendDebugMessage("SSM", msg);
        };
        ssm_ws.onWebsocketClose = function()
        {
            appendDebugMessage("SSM", "Connection closed");
            appendDebugMessage("SSM", "Reconnect after 5sec...");
            setTimeout(
            function(){
                ssm_ws.Connect();
            }, 5000);                
        };
    }
    
    if(fueltrip_ws !== null)
    {
        fueltrip_ws.onWebsocketClose = function()
        {
            appendDebugMessage("FUETRIP", "Connection closed");
            appendDebugMessage("FUELTRIP", "Reconnect after 5sec...");
            setTimeout(
            function(){
                fueltrip_ws.Connect();
            }, 5000);                
        };
    }
}

function connectWebSocket(defi_ws, ssm_ws, fueltrip_ws)
{
    if(defi_ws !== null)
    {
        defi_ws.URL = "ws://"+location.hostname+":2012/";
        defi_ws.Connect();
    }
    if(ssm_ws !== null)
    {
        ssm_ws.URL = "ws://"+location.hostname+":2013/";
        ssm_ws.Connect();
    }
    if(fueltrip_ws !== null)
    {
        fueltrip_ws.URL = "ws://"+location.hostname+":2014/";
        fueltrip_ws.Connect();
    }
};

function show_debug_msg()
{
    if($("#div_message").css("display") === "none")
    {
        //Show debug message window
        $("#div_message").css("display","inline");                    
    }
    else
    {
        //Hide debug message window
        $("#div_message").css("display","none");
    }
}

function checkWebsocketStatus(defi_ws, ssm_ws, fueltrip_ws)
{
    if(defi_ws !== null)
    {
        switch(defi_ws.getReadyState()) 
        { 
            case 0://CONNECTING
                $("#defi_status").css("color","blue");
                break;
            case 1://OPEN
                $("#defi_status").css("color","green");
                break;
            case 2://CLOSING
                $("#defi_status").css("color","orange");
                break;
            case 3://CLOSED
                $("#defi_status").css("color","red");
                break;
            default:
                // this never happens
                break;                      
        };
    }
    if(ssm_ws !== null)
    {
        switch(ssm_ws.getReadyState()) 
            {
                case 0:
                    $("#ssm_status").css("color","blue");
                    break;
                case 1:
                    $("#ssm_status").css("color","green");
                    break;
                case 2:
                    $("#ssm_status").css("color","orange");
                    break;
                case 3:
                    $("#ssm_status").css("color","red");
                    break;
                default:
                    // this never happens
                    break;                      
        };
    }
    if(fueltrip_ws !== null)
    {
        switch(fueltrip_ws.getReadyState()) 
        {
                case 0:
                    $("#fueltrip_status").css("color","blue");
                    break;
                case 1:
                    $("#fueltrip_status").css("color","green");
                    break;
                case 2:
                    $("#fueltrip_status").css("color","orange");
                    break;
                case 3:
                    $("#fueltrip_status").css("color","red");
                    break;
                default:
                    // this never happens
                    break;                      
        }
    }
};

function reset_fuel_trip()
{
    if(window.confirm('Reset fuel and trip?'))
    {
        fueltrip_ws.SendReset();
    };
};   