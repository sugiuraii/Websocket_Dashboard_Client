/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var _bar1;

onload = function() {
    _bar1 = new NeedleGauge_canvas("bar1","../img/needle1.png",10,5);
    _bar1.anticlockwise=false;
    _bar1.full_angle=270;
    _bar1.offset_angle=135;
    _bar1.min = 0;
    _bar1.max = 100;
};

function rangeChange () {
    var val = document.getElementById("value_slider").value;
    _bar1.value = val;
    _bar1.draw();
}


