/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CustomProgressBar_canvas = function(canvas, img)
{
    var context = canvas.getContext('2d');
    var curr_value;
    
    // Properties and Default values
    this.vertical = false;
    this.invert_direction = false;
    this.min = 0;
    this.max = 100;
    
    this.value = this.min;
    
    //Public methods
    this.draw = function()
    {   
        if ( ! canvas || ! canvas.getContext )
            return false;
        
        if (this.value === curr_value)
            return;
        curr_value = this.value;
        
        var canvas_max_x = canvas.width;
        var canvas_max_y = canvas.height;
        var percent = (curr_value - this.min)/(this.max - this.min)*100;
        
        var rect_start_x,rect_start_y,rect_width,rect_height;
        
        if(this.vertical)
        {
            rect_start_x = 0;
            rect_width = canvas_max_x;
            
            if(this.invert_direction)
            {
                rect_start_y = 0;
                rect_height = canvas_max_y*percent/100;
            }
            else
            {
                rect_start_y = canvas_max_y*(1-percent/100);
                rect_height = canvas_max_y*percent/100;

            }
        }
        else
        {
            rect_start_y = 0;
            rect_height = canvas_max_y;
            if(this.invert_direction)
            {
                rect_start_x = canvas_max_x*(1-percent/100);
                rect_width = canvas_max_x*percent/100;
            }
            else
            {
                rect_start_x = 0;
                rect_width = canvas_max_x*percent/100;
            }
        }
        context.save();

        // reset and clear canvas
        context.clearRect(0,0,canvas_max_x,canvas_max_y); 
        context.beginPath();
        context.rect(rect_start_x,rect_start_y,rect_width,rect_height);
        context.closePath();
        //context.stroke();
        context.clip();

        context.drawImage(img, 0, 0);
        context.restore();

    };    
};

