/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CustomProgressBar_canvas = function(canvas, img)
{
    'use strict';
    //private
    this._canvas = canvas;
    this._img = img;
    this._context = canvas.getContext('2d');
    this._curr_Barpixel;
    
    // Properties and Default values
    this.vertical = false;
    this.invert_direction = false;
    this.min = 0;
    this.max = 100;
    this.pixel_resolution = 1;
    this.invert_fill = false;
    
    this.value = this.min;
};

//public methods
CustomProgressBar_canvas.prototype.draw = function()
{   
    'use strict';
    var canvas = this._canvas;
    var context = this._context;
    var img = this._img;
    
    if ( ! canvas || ! context )
        return false;

    var canvas_max_x = canvas.width;
    var canvas_max_y = canvas.height;

    // Calculate bar pixel from value
    var percent = (this.value - this.min)/(this.max - this.min)*100;
    if(percent < 0)
        percent = 0;
    if(percent > 100)
        percent = 100;

    if(this.invert_fill)
        percent = 100 - percent;

    var new_Barpixel;
    if(this.vertical)
        new_Barpixel = canvas_max_y*percent/100;
    else
        new_Barpixel = canvas_max_x*percent/100;

    // If the pixel displacement (new_Barpixel - curr_Barpixel) is below angle resolution, skip redraw
    if (Math.abs(new_Barpixel - this._curr_Barpixel) < this.pixel_resolution)
        return;
    else
        //Update curr_arcAngle
        this._curr_Barpixel = Math.floor(new_Barpixel/this.pixel_resolution) * this.pixel_resolution;

    var rect_start_x,rect_start_y,rect_width,rect_height;

    if(this.vertical)
    {
        rect_start_x = 0;
        rect_width = canvas_max_x;

        if(this.invert_direction)
        {
            rect_start_y = 0;
            rect_height =  this._curr_Barpixel;
        }
        else
        {
            rect_start_y = canvas_max_y - this._curr_Barpixel;
            rect_height =  this._curr_Barpixel;

        }
    }
    else
    {
        rect_start_y = 0;
        rect_height = canvas_max_y;
        if(this.invert_direction)
        {
            rect_start_x = canvas_max_x - this._curr_Barpixel;
            rect_width =  this._curr_Barpixel;
        }
        else
        {
            rect_start_x = 0;
            rect_width = this._curr_Barpixel;
        }
    }
    context.save();

    // reset and clear canvas
    context.clearRect(0,0,canvas_max_x,canvas_max_y); 
    context.beginPath();
    context.rect(rect_start_x,rect_start_y,rect_width,rect_height);
    context.closePath();
    //context.stroke();
    context.clip();

    context.drawImage(img, 0, 0);
    context.restore();

};    