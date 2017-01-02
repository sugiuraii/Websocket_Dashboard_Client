/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var _bar1;
var value;
var FPS=60;

onload = function() {
    //Local variable and instances
    var canvas = document.getElementById("bar1");
    var img = new Image();
    img.src = "../img/fukuchan.jpg";

    _bar1 = new RectangularCanvasProgressBar(canvas, img);
    _bar1.vertical = false;
    _bar1.invert_direction = true;
    _bar1.min = 0;
    _bar1.max = 100;
    _bar1.pixel_resolution = 1;
    
    value=0;
    
    setInterval(function(){
                if(value>100)
                    {
                        value=0;
                    }
                    value+=1;
                    
                _bar1.value = value;
                _bar1.drawOneTime();


                },1000/FPS);
    
};

function rangeChange () {
}


