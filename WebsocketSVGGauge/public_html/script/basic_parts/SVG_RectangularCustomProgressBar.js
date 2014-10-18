/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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