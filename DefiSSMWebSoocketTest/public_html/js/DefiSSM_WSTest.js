/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var noSupportMessage = "Your browser cannot support WebSocket!";
var ws;

function appendWSMessage(message) {
    $("div#div_ws_message").append(message);
};

function writeVALdata(message){
    $("div#div_val_data").append(message + "<br>" );
};

function writeERRdata(message){
    $("div#div_err_data").text(message);
};

function writeRESdata(message){
    $("div#div_res_data").text(message);
};

function parseIncomingMessage(message){
    var received_json_object = JSON.parse(message);
    switch(received_json_object.mode)
    {
        case ("VAL") :
            writeVALdata(message);
            break;
        case("ERR"):
            writeERRdata(message);
            break;
        case("RES"):
            writeRESdata(message);
            break;
        default:
            appendWSMessage("Unknown mode packet received. " + message + "<br>");
    };
};

function connectSocketServer() {
    var support = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);

    if (support === null) {
        appendWSMessage(noSupportMessage + "<br>");
        return;
    }

    appendWSMessage("* Connecting to server ..<br/>");
    
    // create a new websocket and connect
    ws = new window[support]("ws://" + $("#serveraddress_box").val() + ":" + $("#serverportNo_box").val() + "/");

    // when data is comming from the server, this metod is called
    ws.onmessage = function (evt) {
        parseIncomingMessage(evt.data);
    };

    // when the connection is established, this method is called
    ws.onopen = function () {
        appendWSMessage('* Connection open<br/>');
        $('#sendmessagecontent_box').removeAttr("disabled");
        $('#sendButton').removeAttr("disabled");
        $('#connectButton').attr("disabled", "disabled");
        $('#disconnectButton').removeAttr("disabled");
    };

    // when the connection is closed, this method is called
    ws.onclose = function () {
        appendWSMessage('* Connection closed<br/>');
        $('#sendmessagecontent_box').attr("disabled", "disabled");
        $('#sendButton').attr("disabled", "disabled");
        $('#connectButton').removeAttr("disabled");
        $('#disconnectButton').attr("disabled", "disabled");
    };
};

function sendMessage() {
    if (ws) {
        ws.send($("#sendmessagecontent_box").val());
        $("#sendmessagecontent_box").val("");
    }
};

function disconnectWebSocket() {
    if (ws) {
        ws.close();
    }
};

function connectWebSocket() {
    connectSocketServer();
};

window.onload = function () {
    $('#sendmessagecontent_box').attr("disabled", "disabled");
    $('#sendButton').attr("disabled", "disabled");
    $('#disconnectButton').attr("disabled", "disabled");
};

function input_DEFI_WS_SEND(){
    var obj={
      mode : "DEFI_WS_SEND",
      code : $('#deficode_select').val(),
      flag : $('#deficode_flag').val()
    };
    
    var jsonstr = JSON.stringify(obj);
    
    $('#sendmessagecontent_box').val(jsonstr);
};

function input_DEFI_WS_INTERVAL(){
    var obj={
      mode : "DEFI_WS_INTERVAL",
      interval : $('#interval_DEFI_WS_INTERVAL').val()
    };
    
    var jsonstr = JSON.stringify(obj);
    
    $('#sendmessagecontent_box').val(jsonstr);
};

function input_SSM_COM_READ(){
    var obj={
      mode : "SSM_COM_READ",
      code : $('#ssmcomcode_select').val(),
      read_mode : $('ssmcode_readmode').val(),
      flag : $('#ssmcode_flag').val()
    };
    
    var jsonstr = JSON.stringify(obj);
    
    $('#sendmessagecontent_box').val(jsonstr);
};