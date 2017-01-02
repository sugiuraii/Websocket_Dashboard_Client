/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function calcPieShapeBoudingBox(centerX, centerY, radius, startAngle, endAngle, anticlockwise)
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

    var xVerticesList = [centerX, arcstartX, arcendX];
    var yVerticesList = [centerY, arcstartY, arcendY];
    
    //Add to VerticesList when the arc across 90*n degree
    for(var theta = Math.ceil(startAngle/90)*90 ; theta <= endAngle; theta += 90)
    {
        if(theta % 360 === 0)
            xVerticesList.push(centerX + radius);
        else if ((theta-180) % 360 === 0)
            xVerticesList.push(centerX - radius);
        
        if ((theta - 90) % 360 === 0)
            yVerticesList.push(centerY + (anticlockwise? -radius:radius));
        else if ((theta - 270) % 360 === 0)
            yVerticesList.push(centerY + (anticlockwise? radius:-radius));
    }
    
    var maxX = Math.ceil(Math.max.apply(null,xVerticesList));
    var minX = Math.floor(Math.min.apply(null,xVerticesList));
    var maxY = Math.ceil(Math.max.apply(null,yVerticesList));
    var minY = Math.floor(Math.min.apply(null,yVerticesList));
    
    var result = {upperLeftX : minX, upperLeftY : minY, width : maxX-minX, height : maxY-minY};
    return result;
};

calcPieShapeBoudingBox(100, 100, 100, 88, 92, false);