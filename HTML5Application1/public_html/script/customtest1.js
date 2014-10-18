/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var _bar1;

onload = function() {
    _bar1 = new CustomProgressBar_canvas("bar1","fukuchan.jpg");
    _bar1.vertical = false;
    _bar1.invert_direction = true;
    _bar1.min = 0;
    _bar1.max = 100;
};

function rangeChange () {
        var val = document.getElementById("value_slider").value;
        _bar1.value = val;
        _bar1.draw();
}


