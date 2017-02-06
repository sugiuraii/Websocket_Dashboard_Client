/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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