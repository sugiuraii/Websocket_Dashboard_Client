/* 
 * Copyright (c) 2017, Sugiura K.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice, this
 *   list of conditions and the following disclaimer.
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

function CircularCustomProgressBar_svg(svg_object_id, target_element_id)
{   
    //Create svg clipping path    
    this.get_target_tag(svg_object_id);

    // Public properties(Child specific)
    this.offset_angle = 0;
    this.full_angle = 360;
    this.anticlockwise = false;
        
    this.circle_center_x = this._svg_width/2;
    this.circle_center_y = this._svg_height/2;    
    this.circle_radius_x = this._svg_width/2;
    this.circle_radius_y = this._svg_height/2;
    
    //Create svg clipping path    
    this.create_clippath_tag(target_element_id);
};

// Inherit SuperClass
CircularCustomProgressBar_svg.prototype = new CustomProgressBar_svg;

CircularCustomProgressBar_svg.prototype._getSVGPathfromValue = function() //Override
{
    var start_angle;
    //var end_angle;
    var anticlockwise = this.anticlockwise;        
    var val_proportion = (this.value - this.min)/(this.max - this.min);

    start_angle = Math.PI/180*this.offset_angle;

    var angle_length = Math.PI/180*this.full_angle*val_proportion;

    var path_str;
    path_str = this._getPieShapeSVGPath(this.circle_center_x,this.circle_center_y,this.circle_radius_x,this.circle_radius_y,0,start_angle,angle_length,anticlockwise);

    return path_str;

};
CircularCustomProgressBar_svg.prototype._getPieShapeSVGPath = function(x, y, x_radius, y_radius, x_rotation_angle, start_angle, angle_length, anticlockwise)
{
    //SVG arc
    //A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    var path_str;
    var arc_start_x = x + x_radius*Math.cos(start_angle);
    var arc_start_y = y + y_radius*Math.sin(start_angle);

    var arc_long_flag;
    if(angle_length > Math.PI)
        arc_long_flag = 1;
    else
        arc_long_flag = 0;

    var arc_sweep_flag ;
    var arc_end_x,arc_end_y;
    if(anticlockwise)
    {   
        arc_sweep_flag = 0;
        arc_end_x= x + x_radius*Math.cos(start_angle-angle_length);
        arc_end_y= y + y_radius*Math.sin(start_angle-angle_length);
    }
    else
    {
        arc_sweep_flag = 1;
        arc_end_x= x + x_radius*Math.cos(start_angle+angle_length);
        arc_end_y= y + y_radius*Math.sin(start_angle+angle_length);
    }

    path_str = "M" + x + " " + y + " L" + arc_start_x + " " + arc_start_y + " A" + x_radius + " " + y_radius + " " + x_rotation_angle + " " + arc_long_flag + " " + arc_sweep_flag + " " + arc_end_x + " " + arc_end_y + " Z";

    return path_str;
};
