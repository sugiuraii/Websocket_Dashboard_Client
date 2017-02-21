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