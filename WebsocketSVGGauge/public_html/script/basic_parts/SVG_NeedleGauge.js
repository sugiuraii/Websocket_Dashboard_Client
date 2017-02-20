/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function NeedleGauge_svg(svg_object_id, target_element_id)
{
    this.max = 100;
    this.min = 0;
    this.value = this.min;
    this._curr_value = this.value;
    
    this.svg_obj = undefined;
    this.svg_root = undefined;
    this._svg_height = undefined;
    this._svg_width = undefined;
    this.svg_target_element = undefined;
    this._original_transform_attribute = undefined;
    
    this._get_target_tag(svg_object_id);
    this._get_original_transform_attribute(target_element_id);
    
    // Properties and Default values
    this.anticlockwise = false;
    this.offset_angle = 0;
    this.full_angle = 360;
    
    this.rotation_center_x = this._svg_width/2;
    this.rotation_center_y = this._svg_width/2;
};

NeedleGauge_svg.prototype._get_target_tag = function (svg_object_id)
{
    this.svg_obj = document.getElementById(svg_object_id).contentDocument; 
    this.svg_root = this.svg_obj.getElementsByTagName("svg").item(0);

    this._svg_height = this.svg_root.getAttribute("width");
    this._svg_width = this.svg_root.getAttribute("height");    
};
NeedleGauge_svg.prototype._get_original_transform_attribute = function(target_element_id)
{
    this.svg_target_element=this.svg_obj.getElementById(target_element_id);
    this._original_transform_attribute = this.svg_target_element.getAttribute("transform");       
};
NeedleGauge_svg.prototype.update = function()
{   
    if(this.value !== this._curr_value)
    {
        this._curr_value = this.value;
        
        var rotation_angle;
        var val_propotion = (this.value - this.min)/(this.max - this.min);
        
        rotation_angle = this.offset_angle + this.full_angle*val_propotion;
        if(this.anticlockwise)
            rotation_angle = -1*rotation_angle;

        var new_attribute;
        if(this._original_transform_attribute === null)
            new_attribute = "rotate(" + rotation_angle + "," + this.rotation_center_x + "," + this.rotation_center_y + ")";
        else
            new_attribute = this._original_transform_attribute + ",rotate(" + rotation_angle + "," + this.rotation_center_x + "," + this.rotation_center_y + ")";
        
        this.svg_target_element.setAttribute("transform",new_attribute);
    }
};