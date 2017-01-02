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

/**
 * Calculate bodunding box of pie shape. (To define redraw region).
 * @private
 * @param {type} centerX 
 * @param {type} centerY
 * @param {type} radius
 * @param {type} startAngle
 * @param {type} endAngle
 * @param {type} anticlockwise
 * @returns {{upperLeftX, upperLeftY, width, height}
 */
CircularCanvasProgressBar.prototype._calcRedrawBoudingBox = function(centerX, centerY, radius, startAngle, endAngle, anticlockwise)
{
    'use strict';
    var startAngleRadian = Math.PI/180*startAngle;
    var endAngleRadian = Math.PI/180*endAngle;
    
    if(anticlockwise)
    {
        startAngleRadian = -startAngleRadian;
        endAngleRadian = -endAngleRadian;
    }
    
    var arcstartX = centerX + radius*Math.cos(startAngleRadian);
    var arcstartY = centerY + radius*Math.sin(startAngleRadian);
    var arcendX = centerX + radius*Math.cos(endAngleRadian);
    var arcendY = centerY + radius*Math.sin(endAngleRadian);

    var xVerticesList = [centerX, arcstartX, arcendX];
    var yVerticesList = [centerY, arcstartY, arcendY];
    
    //Add to VerticesList when the arc across 90*n degree
    for(var theta = Math.ceil(startAngle/90)*90 ; theta <= endAngle; theta += 90)
    {
        if(theta % 360 === 0)
            xVerticesList.push(centerX + radius);
        else if ((theta-180) % 360 === 0)
            xVerticesList.push(centerX - radius);
        
        if ((theta - 90) % 360 === 0)
            yVerticesList.push(centerY + (anticlockwise? -radius:radius));
        else if ((theta - 270) % 360 === 0)
            yVerticesList.push(centerY + (anticlockwise? radius:-radius));
    }
    
    var maxX = Math.ceil(Math.max.apply(null,xVerticesList));
    var minX = Math.floor(Math.min.apply(null,xVerticesList));
    var maxY = Math.ceil(Math.max.apply(null,yVerticesList));
    var minY = Math.floor(Math.min.apply(null,yVerticesList));
    
    var result = {upperLeftX : minX, upperLeftY : minY, width : maxX-minX, height : maxY-minY};
    return result;
};

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
    var previous_arcAngle = this._curr_arcAngle;
    
    // If the angle displacement (new_arcAngle - curr_arcAngle) is below angle resolution, skip redraw
    if (Math.abs(new_arcAngle - this._curr_arcAngle) < this.angle_resolution)
        return;
    else
       //Round into angle_resolution
       new_arcAngle = Math.floor(new_arcAngle/this.angle_resolution) * this.angle_resolution;

    var circle_center_x = this.circle_center_x + this.offset_x;
    var circle_center_y = this.circle_center_y + this.offset_y;
    var offset_x = this.offset_x;
    var offset_y = this.offset_y;
    var radius = this.circle_radius;

    var start_angle, end_angle;
    var anticlockwise = this.anticlockwise;

    if(anticlockwise)
    {
        start_angle = this.offset_angle;
        end_angle = this.offset_angle - new_arcAngle;
    }
    else
    {
        start_angle = this.offset_angle;
        end_angle = this.offset_angle + new_arcAngle;
    }
    
    //calculate redraw region
    var redrawMaxAngle = Math.max(this.offset_angle + new_arcAngle, this.offset_angle + previous_arcAngle);
    var redrawMinAngle = Math.min(this.offset_angle + new_arcAngle, this.offset_angle + previous_arcAngle);
    var redrawBound = this._calcRedrawBoudingBox(circle_center_x, circle_center_y, radius, redrawMinAngle, redrawMaxAngle, anticlockwise);
    
    context.save();

    // reset and clear canvas
    context.clearRect(redrawBound.upperLeftX,redrawBound.upperLeftY , redrawBound.width, redrawBound.height); 
    context.beginPath();
    context.moveTo(circle_center_x, circle_center_y);
    context.arc(circle_center_x, circle_center_y, radius, Math.PI/180*start_angle, Math.PI/180*end_angle, anticlockwise);
    context.closePath();
    context.clip();

    context.drawImage(img, redrawBound.upperLeftX,redrawBound.upperLeftY , redrawBound.width, redrawBound.height, redrawBound.upperLeftX,redrawBound.upperLeftY , redrawBound.width, redrawBound.height);
    context.restore();
    
    //Finally, update curr_arcAngle
    this._curr_arcAngle = new_arcAngle;    
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
    var previous_Barpixel = this._curr_Barpixel;
    if(this.vertical)
        new_Barpixel = canvas_max_y*percent/100;
    else
        new_Barpixel = canvas_max_x*percent/100;

    // If the pixel displacement (new_Barpixel - curr_Barpixel) is below angle resolution, skip redraw
    if (Math.abs(new_Barpixel - this._curr_Barpixel) < this.pixel_resolution)
        return;
    else
        //Round new_Barpixel into pixel_resolution
        new_Barpixel = Math.floor(new_Barpixel/this.pixel_resolution) * this.pixel_resolution;

    var rect_start_x,rect_start_y,rect_width,rect_height;
    var redraw_start_x, redraw_start_y, redraw_width, redraw_height;
    var skip_draw = false;
    var skip_clear = false;
    
    if(this.vertical)
    {
        rect_start_x = 0;
        redraw_start_x = rect_start_x;
        rect_width = canvas_max_x;
        redraw_width = rect_width;
        
        if(this.invert_direction) // top to bottom
        {
            rect_start_y = 0;
            rect_height =  new_Barpixel;
            if(new_Barpixel > previous_Barpixel) // Increase
            {
                skip_clear = true;
                redraw_start_y = previous_Barpixel;
                redraw_height = new_Barpixel - previous_Barpixel;
            }
            else // Decrease
            {
                skip_draw = true;
                redraw_start_y = new_Barpixel;
                redraw_height = previous_Barpixel - new_Barpixel;
            }
        }
        else // bottom to top
        {
            rect_start_y = canvas_max_y - new_Barpixel;
            rect_height =  new_Barpixel;
            if(new_Barpixel > previous_Barpixel) // Increase
            {
                skip_clear = true;
                redraw_start_y = canvas_max_y - new_Barpixel;
                redraw_height = new_Barpixel - previous_Barpixel;
            }
            else // Decrease
            {
                skip_draw = true;
                redraw_start_y = canvas_max_y - previous_Barpixel;
                redraw_height = previous_Barpixel - new_Barpixel;
            }
        }
    }
    else
    {
        rect_start_y = 0;
        redraw_start_y = rect_start_y;
        rect_height = canvas_max_y;
        redraw_height = rect_height;
        
        if(this.invert_direction) // Right to left
        {
            rect_start_x = canvas_max_x - new_Barpixel;
            rect_width =  new_Barpixel;
            if(new_Barpixel > previous_Barpixel) // Increase
            {
                skip_clear = true;
                redraw_start_x = canvas_max_x - new_Barpixel;
                redraw_width = new_Barpixel - previous_Barpixel;
            }
            else // Decrease
            {
                skip_draw = true;
                redraw_start_x = canvas_max_x - previous_Barpixel;
                redraw_width = previous_Barpixel - new_Barpixel;
            }
        }
        else // Left to right
        {
            rect_start_x = 0;
            rect_width = new_Barpixel;
            if(new_Barpixel > previous_Barpixel) // Increase
            {
                skip_clear = true;
                redraw_start_x = previous_Barpixel;
                redraw_width = new_Barpixel - previous_Barpixel;
            }
            else // Decrease
            {
                skip_draw = true;
                redraw_start_x = new_Barpixel;
                redraw_width = previous_Barpixel - new_Barpixel;
            }
        }
    }
    context.save();

    // reset and clear canvas
    if(!skip_clear)
        context.clearRect(redraw_start_x,redraw_start_y,redraw_width,redraw_height);
    if(!skip_draw)
    {
        context.beginPath();
        context.rect(rect_start_x,rect_start_y,rect_width,rect_height);
        context.closePath();
        context.clip();
        context.drawImage(img, redraw_start_x,redraw_start_y,redraw_width,redraw_height,redraw_start_x,redraw_start_y,redraw_width,redraw_height);
    }
    context.restore();
    
    //Finally, update curr_barpixel
    this._curr_Barpixel = new_Barpixel;
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