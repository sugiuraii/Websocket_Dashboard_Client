/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var _bar1;
var value;
var FPS=60;

onload = function() {
    var canvas = document.getElementById("bar1");
    var img = new Image();
    img.src = "../img/needle1.png";
    
    _bar1 = new NeedleCanvasGauge(canvas, img);
    _bar1.anticlockwise=false;
    _bar1.full_angle=270;
    _bar1.offset_angle=135;
    _bar1.min = 0;
    _bar1.max = 100;
    _bar1.img_pivot_x = 10;
    _bar1.img_pivot_y = 5;
    
    value=0;
    
    setInterval(function()
    {
        if(value>100)
            {
                value=0;
            }
            value+=1;

        _bar1.value = value;
        _bar1.drawOneTime();


    },1000/FPS);

};
