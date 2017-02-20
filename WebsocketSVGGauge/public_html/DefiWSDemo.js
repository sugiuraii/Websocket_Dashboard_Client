/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var svg_obj;

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
    ws = new window[support]('ws://192.168.25.32:2012/');

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
        
        meter_valuechange(msg_obj.val.Boost);

    };

    // when the connection is established, this method is called
    ws.onopen = function () {
        appendMessage('* Connection open<br/>');
        $('#messageInput').attr("disabled", "");
        $('#sendButton').attr("disabled", "");
        $('#connectButton').attr("disabled", "disabled");
        $('#disconnectButton').attr("disabled", "");
        
        //Enable boost
        var boost_enable_msg = "{\"mode\":\"DEFI_WS_SEND\",\"code\":\"Boost\",\"flag\":\"true\"}";
        ws.send(boost_enable_msg);
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
    initialize_gauge();
};

function meter_valuechange(val)
{
    $("#gauge_frame1")[0].contentWindow.set_value(val);
};