/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var NeedleGauge_canvas = function(canvas, img)
{
    'use strict';
    //private
    this._canvas = canvas;
    this._img = img;
    this._context = canvas.getContext('2d');
    this._curr_rotAngle;
    this._canvas_width = canvas.width;
    this._canvas_height = canvas.height;

    // Properties and Default values
    this.offset_angle = 0;
    this.full_angle = 360;
    this.anticlockwise = false;
    this.min = 0;
    this.max = 100;
    this.angle_resolution = 0.5;
    
    this.rotation_center_x = canvas.width/2;
    this.rotation_center_y = canvas.height/2; 
    
    this.value = this.min;
};

//Public methods
NeedleGauge_canvas.prototype.draw = function()
{
    'use strict';
    var canvas = this._canvas;
    var context = this._context;
    var img = this._img;
    
    if ( ! canvas || ! canvas.getContext )
        return false;

     // Calculate arc angle from value
    var percent = (this.value - this.min)/(this.max - this.min)*100;
    if(percent < 0)
        percent = 0;
    if(percent > 100)
        percent = 100;
    var new_rotAngle = this.full_angle*(percent/100);

    // If the angle displacement (new_rotAngle - curr_rotAngle) is below angle resolution, skip redraw
    if (Math.abs(new_rotAngle - this._curr_rotAngle) < this.angle_resolution)
        return;
    else
        //Update curr_arcAngle
        this._curr_rotAngle = Math.floor(new_rotAngle/this.angle_resolution) * this.angle_resolution;;

    var canvas_max_x = this._canvas_width;
    var canvas_max_y = this._canvas_height;
    var rotation_center_x = this.rotation_center_x;
    var rotation_center_y = this.rotation_center_y;

    var anticlockwise = this.anticlockwise;
    var rotation_angle;
    if(anticlockwise)
    {
        rotation_angle = Math.PI/180*(this.offset_angle - this._curr_rotAngle);
    }
    else
    {
        rotation_angle = Math.PI/180*(this.offset_angle + this._curr_rotAngle);
    }
    context.save();
    // reset and clear canvas
    context.clearRect(0,0,canvas_max_x,canvas_max_y);

    //実際の画像変換とは逆順に定義していることに注意。
    context.translate(rotation_center_x, rotation_center_y);
    //apply rotation
    context.rotate(rotation_angle);        
    context.translate( -1 * rotation_center_x, -1 * rotation_center_y);

    context.drawImage(img, 0,0);
    context.restore();
};