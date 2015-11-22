/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function customprogressbar_initialize(canvas_id, canvas_img_name, value_min, value_max, vertical, invert_direction)
{
    var customprogressbar_canvas = document.getElementById(canvas_id);
    var customprogressbar_img = new Image();
    customprogressbar_img.src = canvas_img_name;

    var customprogressbarobj = new CustomProgressBar_canvas(customprogressbar_canvas, customprogressbar_img);
    customprogressbarobj.vertical = vertical;
    customprogressbarobj.invert_direction = invert_direction;
    customprogressbarobj.min = value_min;
    customprogressbarobj.max = value_max;
    customprogressbarobj.pixel_resolution = 16;

    customprogressbar_img.onload = function(){
        customprogressbarobj.draw();
    };

    return customprogressbarobj;
}

function circularprogressbar_initialize(canvas_id, canvas_img_name, value_min, value_max, offset_angle, full_angle, anticlockwise)
{
    var canvas_elem = document.getElementById(canvas_id);
    var image_elem = new Image();
    image_elem.src = canvas_img_name;

    var canvas_obj = new CircularProgressBar_canvas(canvas_elem,image_elem);
    canvas_obj.offset_angle = offset_angle;
    canvas_obj.full_angle = full_angle;
    canvas_obj.angle_resolution = 3;
    canvas_obj.anticlockwise = anticlockwise;
    canvas_obj.min = value_min;
    canvas_obj.max = value_max;
    image_elem.onload = function(){
        canvas_obj.draw();
    };

    return canvas_obj;
}

function needlegauge_initialize(canvas_id, canvas_img_name, value_min, value_max, offset_angle, full_angle, anticlockwise)
{
    var canvas_elem = document.getElementById(canvas_id);
    var image_elem = new Image();
    image_elem.src = canvas_img_name;

    var canvas_obj = new NeedleGauge_canvas(canvas_elem,image_elem);
    canvas_obj.offset_angle = offset_angle;
    canvas_obj.full_angle = full_angle;
    canvas_obj.anticlockwise = anticlockwise;
    canvas_obj.min = value_min;
    canvas_obj.max = value_max;

    image_elem.onload = function(){
        canvas_obj.draw();
    };

    return canvas_obj;
}

function calc_gear_pos(tacho, speed, neutral_sw)
{
    if (neutral_sw)
        return "N";

    //0除算防止（車両停止時）
    if (speed <= 0)
        return "-";

    var gear_ratio = 1 / 3.9 * tacho * 60 * 0.001992 / speed;

    if (gear_ratio > 4.27)
        return "-";
    else if (gear_ratio > 3.01)
        return 1;
    else if (gear_ratio > 2.07)
        return 2;
    else if (gear_ratio > 1.55)
        return 3;
    else if (gear_ratio > 1.2)
        return 4;
    else if (gear_ratio > 0.95)
        return 5;
    else if (gear_ratio > 0.73)
        return 6;
    else
        return "-";  
};

function updatValueTextLabel(value, elementID, parseDigit)
{
    if(parseFloat(value).toFixed(parseDigit) !== $(elementID).text())
        $(elementID).text(parseFloat(value).toFixed(parseDigit));
};

function updateStringTextLabel(string, elementID)
{
    if(string !== $(elementID).text())
        $(elementID).text(string);
};