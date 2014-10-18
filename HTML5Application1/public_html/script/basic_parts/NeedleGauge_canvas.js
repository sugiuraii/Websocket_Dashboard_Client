/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var NeedleGauge_canvas = function(canvas_id, image_name, img_shaft_x, img_shaft_y)
{
    // Local variables and instances
    var canvas = document.getElementById(canvas_id);
    var context = canvas.getContext('2d');
    var img = new Image();
    img.src = image_name;
    var shaft_x = img_shaft_x;
    var shaft_y = img_shaft_y;
    var curr_value;
    
    // Properties and Default values
    this.anticlockwise = false;
    this.max = 100;
    this.min = 0;
    this.offset_angle = 0;
    this.full_angle = 360;
    this.rotation_center_x = canvas.width/2;
    this.rotation_center_y = canvas.height/2;
    
    this.value = this.min;
    
    //Public methods
    this.draw = function()
    {  
        if ( ! canvas || ! canvas.getContext )
            return false;

        if (curr_value === this.value)
            return;
        curr_value = this.value;
                
        var canvas_max_x = canvas.width;
        var canvas_max_y = canvas.height;
        var percent = (curr_value - this.min)*(this.max - this.min)/100;
                
        var rotation_angle;
        if(this.anticlockwise)
        {
            rotation_angle = Math.PI/180*(this.offset_angle - this.full_angle/100*percent);
        }
        else
        {
            rotation_angle = Math.PI/180*(this.offset_angle + this.full_angle/100*percent);
        }
        context.save();
        // reset and clear canvas
        context.clearRect(0,0,canvas_max_x,canvas_max_y);
        
        //実際の画像変換とは逆順に定義していることに注意。
        context.translate(this.rotation_center_x, this.rotation_center_y);
        context.translate(shaft_x, shaft_y);     
        //apply rotation
        context.rotate(rotation_angle);        
        context.translate( -1 * shaft_x, -1 * shaft_y);
        
        context.drawImage(img, 0,0);
        context.restore();
    };
};
