/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var svg_obj;
var svg_obj2;
var svg_obj3;

var ws;
var noSupportMessage = "Your browser cannot support WebSocket!";


function appendMessage(message) 
{
    $('body').append(message);
}

function connectSocketServer() 
{
    var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);

    if (support === null) {
        appendMessage("* " + noSupportMessage + "<br/>");
        return;
    }

    appendMessage("* Connecting to server ..<br/>");
    // create a new websocket and connect
    ws = new window[support]('ws://192.168.25.46:2012/');

    // when data is comming from the server, this metod is called
    ws.onmessage = function (evt) 
    {
        //appendMessage("# " + evt.data + "<br />");
        var msg_obj = JSON.parse(evt.data);
        if(msg_obj.mode !== "VAL")
        {
            appendMessage("Invalid mode packet ..<br/>");
            return;
        }
        var i;
                            var val_list = msg_obj.val;

        for ( i = 0; i < val_list.length; i++)
        {
            var val_obj = val_list[i];
                var val_parameter = val_obj[0];
                var val_value = val_obj[1];

                switch (val_parameter)
                {
                    case 'Boost' : $('#Boost_textbox').val(val_value); meter_valuechange(val_value); break;
                    case 'Tacho' : $('#Tacho_textbox').val(val_value); break;
                    case 'Oil_Pres' : $('#Oil_Pres_textbox').val(val_value); break;
                    case 'Fuel_Pres' : $('#Fuel_Pres_textbox').val(val_value); break;
                    case 'Ext_Temp' : $('#Ext_Temp_textbox').val(val_value); break;
                    case 'Oil_Temp' : $('#Oil_Temp_textbox').val(val_value); break;
                    case 'Water_Temp' : $('#Water_Temp_textbox').val(val_value); break;
                    default : appendMessage("* Packet Parse error ..<br/>");
                }
           }
    };

    // when the connection is established, this method is called
    ws.onopen = function () {
        appendMessage('* Connection open<br/>');
        $('#messageInput').attr("disabled", "");
        $('#sendButton').attr("disabled", "");
        $('#connectButton').attr("disabled", "disabled");
        $('#disconnectButton').attr("disabled", "");
    };

    // when the connection is closed, this method is called
    ws.onclose = function () {
        appendMessage('* Connection closed<br/>');
        $('#messageInput').attr("disabled", "disabled");
        $('#sendButton').attr("disabled", "disabled");
        $('#connectButton').attr("disabled", "");
        $('#disconnectButton').attr("disabled", "disabled");
    };
}
function sendMessage() 
{
    if (ws) 
    {
        var messageBox = document.getElementById('messageInput');
        ws.send(messageBox.value);
        messageBox.value = "";
    }
}

function disconnectWebSocket() 
{
    if (ws) 
    {
        ws.close();
    }
}

function connectWebSocket() 
{
    connectSocketServer();
};

window.onload = function () 
{
    $('#messageInput').attr("disabled", "disabled");
    $('#sendButton').attr("disabled", "disabled");
    $('#disconnectButton').attr("disabled", "disabled");
};

onload = function()
{
    svg_obj = new CircularCustomProgressBar_svg("svg_test1","layer6");
    svg_obj.circle_center_x = 122+178.9375;
    svg_obj.circle_center_y = 115+157;
    svg_obj.circle_radius_x = 80;
    svg_obj.circle_radius_y = 80;
    svg_obj.offset_angle = 180;
    svg_obj.full_angle = 180;
    svg_obj.anticlockwise = false;
    svg_obj.max = 2;
    svg_obj.min = -1;
    
    svg_obj2 = new CircularCustomProgressBar_svg("svg_test1","layer5");
    svg_obj2.circle_center_x = 122+178.9375;
    svg_obj2.circle_center_y = 115+157;
    svg_obj2.circle_radius_x = 120;
    svg_obj2.circle_radius_y = 120;
    svg_obj2.offset_angle = 315;
    svg_obj2.full_angle = 45;
    svg_obj2.value = 100;
    svg_obj2.anticlockwise = false;
    svg_obj2.update();
};

function meter_valuechange(val)
{
    svg_obj.value = val;
    svg_obj.update();
    /*
    svg_obj2.value =val;
    svg_obj2.update();
    */

};