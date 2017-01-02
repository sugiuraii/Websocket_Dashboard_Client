/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CanvasGaugeCommon = function(canvas, img)
{
    'use strict';
    //private
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this._img = img;
    this._canvas_width = canvas.width;
    this._canvas_height = canvas.height;
    
    this._requestAnimationFrameID;
    
    //public
    this.min = 0;
    this.max = 100;
    
    this.invert_fill = false;
    this.value = this.min;
};

CanvasGaugeCommon.prototype.drawOneTime = function()
{
    'use strict';
    this._render();
};

CanvasGaugeCommon.prototype.drawStart = function()
{
    'use strict';
    var self = this;
    this.requestAnimationFrameID = requestAnimationFrame(function()
        {
            self._render();
            self.drawStart();
        });
};

CanvasGaugeCommon.prototype.drawStop = function()
{
    'use strict';
    window.cancelAnimationFrame(this.requestAnimationFrameID);
};

var CircularCanvasProgressBar = function(canvas, img)
{
    CanvasGaugeCommon.call(this, canvas, img);
    
    'use strict';
    // Local value and instances
    this._curr_arcAngle = 0;
    
    // Properties and Default values
    this.offset_angle = 0;
    this.full_angle = 360;
    this.anticlockwise = false;
    
    this.angle_resolution = 0.1;
        
    this.circle_center_x = canvas.width/2;
    this.circle_center_y = canvas.height/2;    
    this.circle_radius = canvas.width/2;
    
    this.offset_x = 0;
    this.offset_y = 0;
};
Object.setPrototypeOf(CircularCanvasProgressBar.prototype, CanvasGaugeCommon.prototype);

//Private methods
CircularCanvasProgressBar.prototype._render = function()
{  
    'use strict';
    var context = this._context;
    var img = this._img;

    // Calculate arc angle from value
    var percent = (this.value - this.min)/(this.max - this.min)*100;
    if(percent < 0)
        percent = 0;
    if(percent > 100)
        percent = 100;

    if(this.invert_fill)
        percent = 100 - percent;

    var new_arcAngle = this.full_angle*(percent/100);

    // If the angle displacement (new_arcAngle - curr_arcAngle) is below angle resolution, skip redraw
    if (Math.abs(new_arcAngle - this._curr_arcAngle) < this.angle_resolution)
        return;
    else
        //Update curr_arcAngle
        this._curr_arcAngle = Math.floor(new_arcAngle/this.angle_resolution) * this.angle_resolution;

    var canvas_max_x = this._canvas_width;
    var canvas_max_y = this._canvas_height;
    var circle_center_x = this.circle_center_x + this.offset_x;
    var circle_center_y = this.circle_center_y + this.offset_y;
    var offset_x = this.offset_x;
    var offset_y = this.offset_y;
    var radius = this.circle_radius;

    var start_angle, end_angle;
    var anticlockwise = this.anticlockwise;

    if(anticlockwise)
    {
        start_angle = Math.PI/180*this.offset_angle;
        end_angle = Math.PI/180*(this.offset_angle - this._curr_arcAngle);
    }
    else
    {
        start_angle = Math.PI/180*this.offset_angle;
        end_angle = Math.PI/180*(this.offset_angle + this._curr_arcAngle);
    }
    context.save();

    // reset and clear canvas
    context.clearRect(0,0,canvas_max_x,canvas_max_y); 
    context.beginPath();
    context.moveTo(circle_center_x, circle_center_y);
    context.arc(circle_center_x, circle_center_y, radius, start_angle, end_angle, anticlockwise);
    context.closePath();
    context.clip();

    context.drawImage(img, offset_x, offset_y);
    context.restore();
};    

var RectangularCanvasProgressBar = function(canvas, img)
{
    'use strict';
    CanvasGaugeCommon.call(this, canvas, img);
    
    //private
    this._curr_Barpixel;
    
    // Properties and Default values
    this.vertical = false;
    this.invert_direction = false;
    this.pixel_resolution = 1;
};
Object.setPrototypeOf(RectangularCanvasProgressBar.prototype, CanvasGaugeCommon.prototype);

RectangularCanvasProgressBar.prototype._render = function()
{   
    'use strict';
    //var canvas = this._canvas;
    var context = this._context;
    var img = this._img;

    var canvas_max_x = this._canvas_width;
    var canvas_max_y = this._canvas_height;

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
    context.clip();

    context.drawImage(img, 0, 0);
    context.restore();
};

var NeedleCanvasGauge = function(canvas, img)
{
    'use strict';
    CanvasGaugeCommon.call(this, canvas, img);

    //private
    this._curr_rotAngle;

    // Properties and Default values
    this.offset_angle = 0;
    this.full_angle = 360;
    this.anticlockwise = false;
    this.angle_resolution = 0.5;
    
    this.rotation_center_x = canvas.width/2;
    this.rotation_center_y = canvas.height/2; 
};
Object.setPrototypeOf(NeedleCanvasGauge.prototype, CanvasGaugeCommon.prototype);

//Public methods
NeedleCanvasGauge.prototype._render = function()
{
    'use strict';
    var context = this._context;
    var img = this._img;

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