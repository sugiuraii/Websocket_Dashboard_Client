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

function RectangularCustomProgressBar_svg(svg_object_id, target_element_id)
{   
    //Create svg clipping path    
    this.get_target_tag(svg_object_id);
    
    // Public properties(Child specific)
    this.vertical = false;
    this.invert_direction = false;
    
    this.rectangle_offset_x = 0;
    this.rectangle_offset_y = 0;
    this.rectangle_width = this._svg_width;
    this.rectangle_height = this._svg_height;
    
    //Create svg clipping path    
    this.create_clippath_tag(target_element_id);
};

// Inherit SuperClass
RectangularCustomProgressBar_svg.prototype = new CustomProgressBar_svg;

RectangularCustomProgressBar_svg.prototype._getSVGPathfromValue = function() //Override
{
    var val_proportion = (this.value - this.min)/(this.max - this.min);
    var ul_x,ul_y,lr_x,lr_y;
    
    if(this.vertical)
    {
        ul_x = this.rectangle_offset_x;
        lr_x = this.rectangle_offset_x + this.rectangle_width;

        if(this.invert_direction)
        {
            ul_y = this.rectangle_offset_y + this.rectangle_height * (1-val_proportion);
            lr_y = this.rectangle_offset_y + this.rectangle_height;
        }
        else
        {
            ul_y = this.rectangle_offset_y;
            lr_y = this.rectangle_offset_y + this.rectangle_height * val_proportion;
        }
    }
    else
    {
        ul_y = this.rectangle_offset_y;
        lr_y = this.rectangle_offset_y + this.rectangle_height;

        if(this.invert_direction)
        {
            ul_x = this.rectangle_offset_x + this.rectangle_width * (1 - val_proportion);
            lr_x = this.rectangle_offset_x + this.rectangle_width;
        }
        else
        {
            ul_x = this.rectangle_offset_x;
            lr_x = this.rectangle_offset_x + this.rectangle_width * val_proportion;
        }
    }
  

    var path_str;
    path_str = this._getRectShapeSVGPath(ul_x,ul_y,lr_x,lr_y);

    return path_str;

};

RectangularCustomProgressBar_svg.prototype._getRectShapeSVGPath = function(ul_x,ul_y,lr_x,lr_y)
{
    var path_str;
    path_str = "M" + ul_x + "," + ul_y + " L" + lr_x + "," + ul_y + " L" + lr_x + "," + lr_y + " L" + ul_x + "," + lr_y + " Z";
    return path_str;
};