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


var GaugeDemonstrationSignalGenerator = function()
{
    'use strict';
    /**
     * current value.
     * @private
     */
    this._currentVal = 0;
    /**
     * Countup or down flag (true = countup)
     * @private
     */
    this._valueUp = true;
    
    /**
     * SetInterval ID
     * @private
     */
    this._setIntervalID;
    
    
    /**
     * Max value.
     */
    this.Max = 0;
    /**
     * Min Value.
     */
    this.Min = 100;
    /**
     * Value change cycle in ms.
     */
    this.ValueChangeCycle = 1000;
    /**
     * Value up delta.
     */
    this.ValueUpDelta = 1;
    /**
     * Value down delta.
     */
    this.ValueDownDelta = 1;
    /**
     * Animation delay in ms.
     */
    this.Delay = 1000;
    
    this.ValueSetFunction = function(value){};
};

/**
 * Start demo signal generation for animation.
 */
GaugeDemonstrationSignalGenerator.prototype.Start = function()
{
    this._currentVal = this.Min;
    window.setTimeout(this._process(), this.Delay);
};

/**
 * signal generation
 * @private
 */
GaugeDemonstrationSignalGenerator.prototype._process = function()
{
    var self = this;
    this._setIntervalID = window.setInterval(function()
    {
        self.ValueSetFunction(self._currentVal);

        if(self._valueUp)
        {
            self._currentVal += self.ValueUpDelta;
            if(self._currentVal >= self.Max)
                self._valueUp = false;
        }
        else
        {
            self._currentVal -= self.ValueDownDelta;
            if(self._currentVal <= self.Min)
                self._valueUp = true;
        }
    }, this.ValueChangeCycle);
};