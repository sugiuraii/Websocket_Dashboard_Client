/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CanvasGauge = function(canvas, img)
{
    this.AnimateInterpolate = true;
    'use strict';
    //private
    this._canvas = canvas;
    this._context = canvas.getContext('2d');
    this._img = img;
    this._canvas_width = canvas.width;
    this._canvas_height = canvas.height;     
};

var CanvasGauge1D = function(canvas, img)
{
    'use strict';
    CanvasGauge.call(this, canvas, img);
    //public
    this.min = 0;
    this.max = 100;
    this.invert_fill = false;
    
    this._value = this.min;
    this._previousValue = this._value;
    this._valueSetTimeStamp = window.performance.now();
    this._valueSetIntervalTimeArray = new MovingAverageQueue();
    
    this._requestAnimationFrameID = null;
    this._previousAnimationTimeStamp = window.performance.now();
    
    var self = this;
    Object.defineProperty(this, "value", 
    {
        set : function(val)
        {
            'use strict';
            //Store time stamp rate for interpolation animation.
            var value = Number(val);
            var nowTime = window.performance.now();
            var previousTime = self._valueSetTimeStamp;
            var deltaTime = Number(nowTime) - Number(previousTime);
            //Detect value update rate faster than 1ms is invalid.
            if(deltaTime > 1)
            {
                self._valueSetIntervalTimeArray.add(Number(nowTime) - Number(previousTime));
                self._valueSetTimeStamp = nowTime;
            }
            self._previousValue = self._value;
            self._value = value;
        },
        get : function()
        {
            'use strict';
            return this._value;
        }
    });
    Object.defineProperty(this, "_valueSetIntervalTime",
    {
        get : function()
        {
            'use strict';
            return self._valueSetIntervalTimeArray.getAverage();
        }
    });
};
Object.setPrototypeOf(CanvasGauge1D.prototype, CanvasGauge.prototype);

CanvasGauge1D.prototype.drawOneTime = function()
{
    'use strict';
    this._render(true, this.value);
};

CanvasGauge1D.prototype.drawStart = function()
{
    'use strict';
    this.drawOneTime();
    
    var self = this;
    var drawOneFrame = function(timeStamp)
    {
        var drawVal;
        if(self.AnimateInterpolate)
        {
            var interpolateFactor = (timeStamp - self._valueSetTimeStamp)/self._valueSetIntervalTime;
            if(interpolateFactor > 1)
                interpolateFactor = 1;
            if(interpolateFactor < 0)
                interpolateFactor = 0;
            drawVal = self._previousValue + (self._value - self._previousValue)*interpolateFactor;
            self._render(false, drawVal);
        }
        else
            drawVal = self.value;
        
        self._render(false, drawVal);
        
        self._previousAnimationTimeStamp = timeStamp;
        window.requestAnimationFrame(drawOneFrame);
    };
    
    this.requestAnimationFrameID = requestAnimationFrame(drawOneFrame);
};

CanvasGauge1D.prototype.drawStop = function()
{
    'use strict';
    window.cancelAnimationFrame(this.requestAnimationFrameID);
};

var CircularCanvasProgressBar = function(canvas, img)
{
    CanvasGauge1D.call(this, canvas, img);
    
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
    this.circue_inner_radius = 0;
    this.offset_x = 0;
    this.offset_y = 0;
};
Object.setPrototypeOf(CircularCanvasProgressBar.prototype, CanvasGauge1D.prototype);

/**
 * Calculate bodunding box of pie shape. (To define redraw region).
 * @private
 * @param {type} centerX 
 * @param {type} centerY
 * @param {type} radius
 * @param {type} inner_radius
 * @param {type} startAngle
 * @param {type} endAngle
 * @param {type} anticlockwise
 * @returns {{upperLeftX, upperLeftY, width, height}
 */
CircularCanvasProgressBar.prototype._calcRedrawBoudingBox = function(centerX, centerY, radius, inner_radius, startAngle, endAngle, anticlockwise)
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
    var inner_arcstartX = centerX + inner_radius*Math.cos(startAngleRadian);
    var inner_arcstartY = centerY + inner_radius*Math.sin(startAngleRadian);
    var inner_arcendX = centerX + inner_radius*Math.cos(endAngleRadian);
    var inner_arcendY = centerY + inner_radius*Math.sin(endAngleRadian);
    
    var xVerticesList = [arcstartX, arcendX, inner_arcstartX, inner_arcendX];
    var yVerticesList = [arcstartY, arcendY, inner_arcstartY, inner_arcendY];
    
    //Add to VerticesList when the arc across 90*n degree
    for(var theta = Math.ceil(startAngle/90)*90 ; theta <= endAngle; theta += 90)
    {
        if(theta % 360 === 0)
        {
            xVerticesList.push(centerX + radius);
            xVerticesList.push(centerX + inner_radius);            
        }
        else if ((theta-180) % 360 === 0)
        {
            xVerticesList.push(centerX - radius);
            xVerticesList.push(centerX - inner_radius);
        }
        
        if ((theta - 90) % 360 === 0)
        {
            yVerticesList.push(centerY + (anticlockwise? -radius:radius));
            yVerticesList.push(centerY + (anticlockwise? -inner_radius:inner_radius));            
        }
        else if ((theta - 270) % 360 === 0)
        {
            yVerticesList.push(centerY + (anticlockwise? radius:-radius));
            yVerticesList.push(centerY + (anticlockwise? inner_radius:-inner_radius));
        }
    }
    
    var maxX = Math.ceil(Math.max.apply(null,xVerticesList));
    var minX = Math.floor(Math.min.apply(null,xVerticesList));
    var maxY = Math.ceil(Math.max.apply(null,yVerticesList));
    var minY = Math.floor(Math.min.apply(null,yVerticesList));
    
    var result = {upperLeftX : minX, upperLeftY : minY, width : maxX-minX, height : maxY-minY};
    return result;
};

//Private methods
CircularCanvasProgressBar.prototype._render = function(forceRender, val)
{  
    'use strict';
    var canvas = this._canvas;
    var context = this._context;
    var img = this._img;

    // Calculate arc angle from value
    var percent = (val - this.min)/(this.max - this.min)*100;
    if(percent < 0)
        percent = 0;
    if(percent > 100)
        percent = 100;

    if(this.invert_fill)
        percent = 100 - percent;

    var new_arcAngle = this.full_angle*(percent/100);
    var previous_arcAngle = this._curr_arcAngle;
    
    // If the angle displacement (new_arcAngle - curr_arcAngle) is below angle resolution, skip redraw
    if ((Math.abs(new_arcAngle - this._curr_arcAngle) < this.angle_resolution) && !forceRender)
        return;
    else
       //Round into angle_resolution
       new_arcAngle = Math.floor(new_arcAngle/this.angle_resolution) * this.angle_resolution;

    var circle_center_x = this.circle_center_x + this.offset_x;
    var circle_center_y = this.circle_center_y + this.offset_y;
    var offset_x = this.offset_x;
    var offset_y = this.offset_y;
    var radius = this.circle_radius;
    var inner_radius = this.circue_inner_radius;

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
    var redrawBound = this._calcRedrawBoudingBox(circle_center_x, circle_center_y, radius, inner_radius, redrawMinAngle, redrawMaxAngle, anticlockwise);
    
    context.save();

    // reset and clear canvas
    if(forceRender)
        context.clearRect(0,0, canvas.width, canvas.height);
    else
        context.clearRect(redrawBound.upperLeftX,redrawBound.upperLeftY , redrawBound.width, redrawBound.height); 
    
    context.beginPath();
    context.arc(circle_center_x, circle_center_y, radius, Math.PI/180*start_angle, Math.PI/180*end_angle, anticlockwise);
    if(inner_radius > 0)
        context.arc(circle_center_x, circle_center_y, inner_radius, Math.PI/180*end_angle, Math.PI/180*start_angle, !anticlockwise);
    else
        context.lineTo(circle_center_x, circle_center_y);
    
    context.closePath();
    context.clip();
    
    var redrawMargin = CircularCanvasProgressBar.prototype.redrawMargin;
    if(forceRender)
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
    else
        context.drawImage(img, redrawBound.upperLeftX - redrawMargin,redrawBound.upperLeftY - redrawMargin, redrawBound.width + 2*redrawMargin, redrawBound.height + 2*redrawMargin,
                               redrawBound.upperLeftX - redrawMargin,redrawBound.upperLeftY - redrawMargin, redrawBound.width + 2*redrawMargin, redrawBound.height + 2*redrawMargin);
                               
    context.restore();
    
    //Finally, update curr_arcAngle
    this._curr_arcAngle = new_arcAngle;    
};    

var RectangularCanvasProgressBar = function(canvas, img)
{
    'use strict';
    CanvasGauge1D.call(this, canvas, img);
    
    //private
    this._curr_Barpixel = 0;
    
    // Properties and Default values
    this.vertical = false;
    this.invert_direction = false;
    this.pixel_resolution = 1;
};
Object.setPrototypeOf(RectangularCanvasProgressBar.prototype, CanvasGauge1D.prototype);

RectangularCanvasProgressBar.prototype._render = function(forceRender, val)
{   
    'use strict';
    //var canvas = this._canvas;
    var context = this._context;
    var img = this._img;

    var canvas_max_x = this._canvas_width;
    var canvas_max_y = this._canvas_height;

    // Calculate bar pixel from value
    var percent = (val - this.min)/(this.max - this.min)*100;
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
    if ((Math.abs(new_Barpixel - this._curr_Barpixel) < this.pixel_resolution) && !forceRender)
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
    CanvasGauge1D.call(this, canvas, img);

    //private
    this._curr_rotAngle = 0;

    // Properties and Default values
    this.offset_angle = 0;
    this.full_angle = 360;
    this.anticlockwise = false;
    this.angle_resolution = 0.01;
    
    this.rotation_center_x = canvas.width/2;
    this.rotation_center_y = canvas.height/2;
    this.img_pivot_x = canvas.width/2;
    this.img_pivot_y = canvas.height/2;
};
Object.setPrototypeOf(NeedleCanvasGauge.prototype, CanvasGauge1D.prototype);

//Public methods
NeedleCanvasGauge.prototype._render = function(forceRender, val)
{
    'use strict';
    var context = this._context;
    var img = this._img;

     // Calculate arc angle from value
    var percent = (val - this.min)/(this.max - this.min)*100;
    if(percent < 0)
        percent = 0;
    if(percent > 100)
        percent = 100;
    var new_rotAngle = this.full_angle*(percent/100);
    var previous_rotAngle = this._curr_rotAngle;
    
    // If the angle displacement (new_rotAngle - curr_rotAngle) is below angle resolution, skip redraw
    if ((Math.abs(new_rotAngle - this._curr_rotAngle) < this.angle_resolution) && !forceRender)
        return;
    else
        //Round into angle_resolution
        new_rotAngle = Math.floor(new_rotAngle/this.angle_resolution) * this.angle_resolution;;
    
    var imgWidth = img.width;
    var imgHeight = img.height;
    var imgPivotX = this.img_pivot_x;
    var imgPivotY = this.img_pivot_y;
    var rotCenterX = this.rotation_center_x;
    var rotCenterY = this.rotation_center_y;

    var newActualRotAngle;
    var previousActualRotAngle;
    if(this.anticlockwise)
    {
        newActualRotAngle = Math.PI/180*(this.offset_angle - new_rotAngle);
        previousActualRotAngle = Math.PI/180*(this.offset_angle - previous_rotAngle);
    }
    else
    {
        newActualRotAngle = Math.PI/180*(this.offset_angle + new_rotAngle);
        previousActualRotAngle = Math.PI/180*(this.offset_angle + previous_rotAngle); 
    }
    context.save();

    // Clear previous frame with calculating bounding box
    var clearRegionBoundingBox = this._calcRedrawBoudingBox(rotCenterX, rotCenterY, imgPivotX, imgPivotY, imgWidth, imgHeight, previousActualRotAngle);
    context.clearRect(clearRegionBoundingBox.upperLeftX, clearRegionBoundingBox.upperLeftY, clearRegionBoundingBox.width, clearRegionBoundingBox.height);

    //実際の画像変換とは逆順に定義していることに注意。
    context.translate(rotCenterX, rotCenterY);
    //apply rotation
    context.rotate(newActualRotAngle);        
    context.translate( -rotCenterX, -rotCenterY);
    context.drawImage(img, rotCenterX - imgPivotX, rotCenterY - imgPivotY);
    context.restore();
    
    //Finally, update curr_rotangle
    this._curr_rotAngle = new_rotAngle;
};

/**
 * Calculate rotated coodinate with center point.
 * @private
 * @param {number} x input X.
 * @param {number} y input Y.
 * @param {number} centerX center point X.
 * @param {number} centerY center point Y.
 * @param {number} angle Rotation angle in radian.
 * @returns {x:number y:number} Result rotated coordinate.
 */
NeedleCanvasGauge.prototype._rotationCoordinate = function(x, y, centerX, centerY, angle)
{
    'use strict';
    var x1, y1;
    x1 = x - centerX;
    y1 = y - centerY;
    
    var x2, y2;
    x2 = Math.cos(angle) * x1 - Math.sin(angle) * y1;
    y2 = Math.cos(angle) * y1 + Math.sin(angle) * x1;
    
    var x3, y3;
    x3 = x2 + centerX;
    y3 = y2 + centerY;
    
    var result = { x: x3, y: y3};
    return result;
};

/**
 * Calculate redraw bouding box.
 * @private
 * @param {number} rotCenterX
 * @param {number} rotCenterY
 * @param {number} imgPivotX
 * @param {number} imgPivotY
 * @param {number} imgWidth
 * @param {number} imgHeight
 * @param {number} angle
 * @returns {NeedleCanvasGauge1D.prototype._calcRedrawBoudingBox.result}
 */
NeedleCanvasGauge.prototype._calcRedrawBoudingBox = function(rotCenterX, rotCenterY, imgPivotX, imgPivotY, imgWidth, imgHeight, angle)
{
    'use strict';
    //Rotated upper left
    var rotatedULpt = this._rotationCoordinate(rotCenterX - imgPivotX, rotCenterY - imgPivotY, rotCenterX, rotCenterY, angle);
    //Rotated lower left
    var rotatedLLpt = this._rotationCoordinate(rotCenterX - imgPivotX, rotCenterY - imgPivotY + imgHeight, rotCenterX, rotCenterY, angle);
    //Rotated upper right
    var rotatedURpt = this._rotationCoordinate(rotCenterX - imgPivotX + imgWidth, rotCenterY - imgPivotY, rotCenterX, rotCenterY, angle);
    //Rotated lower right
    var rotatedLRpt = this._rotationCoordinate(rotCenterX - imgPivotX + imgWidth, rotCenterY - imgPivotY + imgHeight, rotCenterX, rotCenterY, angle);

    //Calculate bouding box
    var maxX = Math.max(rotatedULpt.x, rotatedLLpt.x, rotatedURpt.x, rotatedLRpt.x);
    var minX = Math.min(rotatedULpt.x, rotatedLLpt.x, rotatedURpt.x, rotatedLRpt.x);
    var maxY = Math.max(rotatedULpt.y, rotatedLLpt.y, rotatedURpt.y, rotatedLRpt.y);
    var minY = Math.min(rotatedULpt.y, rotatedLLpt.y, rotatedURpt.y, rotatedLRpt.y);
    
    //Round into integer
    maxX = Math.ceil(maxX);
    minX = Math.floor(minX);
    maxY = Math.ceil(maxY);
    minY = Math.floor(minY);
    
    var result = {upperLeftX : minX, upperLeftY : minY, width : maxX-minX, height : maxY-minY};
    return result;
};

/**
 * drawimg() margin of CircularCanvasProgressBar.
 * @type Number
 */
CircularCanvasProgressBar.prototype.redrawMargin = 0;

/**
 * Queue with averaging function.
 * @returns {Queue}
 */
var MovingAverageQueue = function()
{
    'use strict';
    this.StoreLength = 3;
    this.__a = new Array();
};

MovingAverageQueue.prototype.add = function(val)
{
    'use strict';
    //Discard one oldest item
    if(this.__a.length === this.StoreLength)
        this.__a.shift();
    
    this.__a.push(Number(val));
};

MovingAverageQueue.prototype.getMedian = function()
{
    'use strict';
    var temp = this.__a.sort(function(a,b){return a-b;});
    var length = temp.length;
    var half = (temp.length/2)|0;
    
    if (length === 0)
        return 1;
    
    if(length % 2)
        return temp[half];
    else
        return (temp[half-1] + temp[half])/2;
};

MovingAverageQueue.prototype.getAverage = function()
{
    'use strict';
    var i;
    var length = this.__a.length;
    var temp = 0;
    for(i=0; i < length; i++)
        temp+=this.__a[i];
    
    if (length === 0)
        return 1;
    
    return temp/length;
};