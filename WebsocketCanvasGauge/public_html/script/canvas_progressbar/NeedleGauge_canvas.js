/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var NeedleGauge_canvas = function(canvas, img)
{
    // Local value and instances
    var context = canvas.getContext('2d');
    var curr_value;
    
    // Properties and Default values
    this.offset_angle = 0;
    this.full_angle = 360;
    this.anticlockwise = false;
    this.min = 0;
    this.max = 100;
    
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
        var rotation_center_x = this.rotation_center_x;
        var rotation_center_y = this.rotation_center_y;

        var anticlockwise = this.anticlockwise;
        
        var percent = (curr_value - this.min)/(this.max - this.min)*100;
        if(percent>100)
            percent=100;
        else if (percent<0)
            percent=0;
        
        var rotation_angle;
        if(anticlockwise)
        {
            rotation_angle = Math.PI/180*(this.offset_angle - this.full_angle*(percent/100));
        }
        else
        {
            rotation_angle = Math.PI/180*(this.offset_angle + this.full_angle*(percent/100));
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
};
