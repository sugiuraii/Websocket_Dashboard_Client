/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CircularProgressBar_canvas = function(canvas, img)
{
    // Local value and instances
    var context = canvas.getContext('2d');
    var curr_arcAngle;
        
    // Properties and Default values
    this.offset_angle = 0;
    this.full_angle = 360;
    this.anticlockwise = false;
    this.min = 0;
    this.max = 100;
    this.angle_resolution = 0.5;
    
    this.invert_fill = false;
    
    this.circle_center_x = canvas.width/2;
    this.circle_center_y = canvas.height/2;    
    this.circle_radius = canvas.width/2;
    
    this.offset_x = 0;
    this.offset_y = 0;
    
    this.value = this.min;
    
    //Public methods
    this.draw = function()
    {  
        if ( ! canvas || ! canvas.getContext )
            return false;
        
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
        if (Math.abs(new_arcAngle - curr_arcAngle) < this.angle_resolution)
            return;
        else
            //Update curr_arcAngle
            curr_arcAngle = Math.floor(new_arcAngle/this.angle_resolution) * this.angle_resolution;
        
        var canvas_max_x = canvas.width;
        var canvas_max_y = canvas.height;
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
            end_angle = Math.PI/180*(this.offset_angle - curr_arcAngle);
        }
        else
        {
            start_angle = Math.PI/180*this.offset_angle;
            end_angle = Math.PI/180*(this.offset_angle + curr_arcAngle);
        }
        context.save();

        // reset and clear canvas
        context.clearRect(0,0,canvas_max_x,canvas_max_y); 
        context.beginPath();
        context.moveTo(circle_center_x, circle_center_y);
        context.arc(circle_center_x, circle_center_y, radius, start_angle, end_angle, anticlockwise);
        context.closePath();
        //context.stroke();
        context.clip();

        context.drawImage(img, offset_x, offset_y);
        context.restore();
        
    };    
};

