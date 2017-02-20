/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function CustomProgressBar_svg()
{
    this.min = 0;
    this.max = 100;
    
    this.value = this.min;
    this._curr_value = this.value;
        
    this.svg_obj = undefined; 
    this.svg_root = undefined;
    
    this._svg_height = undefined;
    this._svg_width = undefined;
    this._clippath_id = undefined;
    this._clippath_content_id = undefined;
 
};

CustomProgressBar_svg.prototype.get_target_tag = function (svg_object_id)
{
    this.svg_obj = document.getElementById(svg_object_id).contentDocument; 
    this.svg_root = this.svg_obj.getElementsByTagName("svg").item(0);

    this._svg_height = this.svg_root.getAttribute("width");
    this._svg_width = this.svg_root.getAttribute("height");    
};
CustomProgressBar_svg.prototype.create_clippath_tag = function (target_element_id)
{
       //Define clipping svg id
    this._clippath_id = this._define_clip_path_id();
    this._clippath_content_id = this._clippath_id +"_content";

    // Append clipping path element
    var d =  this._getSVGPathfromValue();

    var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d",d);
    path.setAttribute("id",this._clippath_content_id);

    var clippath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
    clippath.setAttribute("id",this._clippath_id);
    clippath.appendChild(path);

    this.svg_root.appendChild(clippath);

    //Assiciate clipping path to target element
    var target_element =  this.svg_obj.getElementById(target_element_id);
    target_element.setAttribute("clip-path","url(#" + this._clippath_id + ")");
};
CustomProgressBar_svg.prototype.update = function()
{
    if(this.value !== this._curr_value) //detect value change
    {
        this._curr_value = this.value;
        var new_d = this._getSVGPathfromValue();
        var clip_path = this.svg_root.getElementById(this._clippath_content_id);
        clip_path.setAttribute("d",new_d);
    }
};
CustomProgressBar_svg.prototype._define_clip_path_id = function()
{    
    var clip_path_id;
    do{
        clip_path_id = "circularprogressbar_internal_clippath_" + Math.round(Math.random()*99999);
    }
    while(this.svg_obj.getElementById(clip_path_id) !== null);

    return clip_path_id;
};
CustomProgressBar_svg.prototype._getSVGPathfromValue = function(){
    // Should be overriden by children class method.
    };



