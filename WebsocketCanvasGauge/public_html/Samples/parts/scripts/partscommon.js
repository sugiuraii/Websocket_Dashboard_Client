/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function initializeRectangularCanvasProgressBar(canvas_id, canvas_img_name, value_min, value_max, vertical, invert_direction)
{
    var canvas = document.getElementById(canvas_id);
    var img = new Image();
    img.src = canvas_img_name;

    var progressbarObj = new RectangularCanvasProgressBar(canvas, img);
    progressbarObj.vertical = vertical;
    progressbarObj.invert_direction = invert_direction;
    progressbarObj.min = value_min;
    progressbarObj.max = value_max;
    progressbarObj.pixel_resolution = 16;

    img.onload = function(){
        progressbarObj.drawStart();
    };
    
    return progressbarObj;
}

function initializeCircularCanvasProgressBar(canvas_id, canvas_img_name, radius, inner_radius,  value_min, value_max, offset_angle, full_angle, anticlockwise)
{
    var canvas = document.getElementById(canvas_id);
    var img = new Image();
    img.src = canvas_img_name;

    var progressbarObj = new CircularCanvasProgressBar(canvas, img);
    progressbarObj.offset_angle = offset_angle;
    progressbarObj.full_angle = full_angle;
    progressbarObj.angle_resolution = 3;
    progressbarObj.anticlockwise = anticlockwise;
    progressbarObj.min = value_min;
    progressbarObj.max = value_max;
    progressbarObj.circle_radius = radius;
    progressbarObj.circue_inner_radius = inner_radius;
    
    img.onload = function(){
        progressbarObj.drawStart();
    };

    return progressbarObj;
}

function initializeNeedleCanvasGauge(canvas_id, canvas_img_name, value_min, value_max, offset_angle, full_angle, anticlockwise, imgPivotX, imgPivotY)
{
    var canvas = document.getElementById(canvas_id);
    var img = new Image();
    img.src = canvas_img_name;

    var gaugeObj = new NeedleCanvasGauge(canvas,img);
    gaugeObj.offset_angle = offset_angle;
    gaugeObj.full_angle = full_angle;
    gaugeObj.anticlockwise = anticlockwise;
    gaugeObj.min = value_min;
    gaugeObj.max = value_max;
    gaugeObj.img_pivot_x = imgPivotX;
    gaugeObj.img_pivot_y = imgPivotY;

    img.onload = function(){
        gaugeObj.drawStart();
    };

    return gaugeObj;
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

function updatValueTextLabel(value, element_dom, parseDigit)
{
    if(parseFloat(value).toFixed(parseDigit) !== element_dom.textContent)
        element_dom.textContent = parseFloat(value).toFixed(parseDigit);
};

function updateStringTextLabel(string, element_dom)
{
    if(string !== element_dom.textContent)
        element_dom.textContent = string;
};