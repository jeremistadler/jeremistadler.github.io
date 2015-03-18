var Engine = function(elemId) {
    'use strict'
    var engine = {}
    var currentFrame = 0;
    var lastFpsUpdate = new Date().getTime();

    engine.fps = 0;
    engine.targetFps = 30;
    engine.drawTimer = null;
    engine.showFps = true;
    engine.clear = true;
    
    engine.ctx = null;
    engine.canvas = null;
    
    engine.onDraw = function(){}
    engine.onLoad = function(){}
    
    var onUpdate = function() {	
        var nowTime = new Date().getTime();
        if (nowTime - lastFpsUpdate > 1000)
        {
            lastFpsUpdate = nowTime;
            engine.fps = currentFrame;
            currentFrame = 0;
        }

        currentFrame++;
        
        if (engine.clear)
            engine.ctx.clearRect(0, 0, engine.width, engine.height)
            
        engine.onDraw();

        if (engine.showFps) {
            engine.ctx.save();
            
            engine.ctx.setTransform(1, 0, 0, 1, 0, 0);
            engine.ctx.font = '9px Helvetica';
            engine.ctx.fillStyle = rgb(255, 255, 255);
            engine.ctx.shadowColor = rgba(0, 0, 0, 0.3);
            engine.ctx.shadowBlur = 2;
            engine.ctx.shadowOffsetY = 1;
            
            if (!engine.clear)
            {
                engine.ctx.shadowColor = rgb(0, 0, 0);
                engine.ctx.shadowBlur = 2;
                engine.ctx.shadowOffsetY = 0;
            }
            
            engine.ctx.fillText("fps: " + engine.fps, 10, 20);
            
            engine.ctx.restore();
        }
    }

    window.addEventListener('load', function() {
      engine.canvas = document.getElementById(elemId);
      engine.ctx = canvas.getContext('2d');

      engine.canvas.width = canvas.parentElement.clientWidth;
      engine.canvas.height = canvas.parentElement.clientHeight;

      engine.width = engine.canvas.width;
      engine.height = engine.canvas.height;

      engine.onLoad();
        
      engine.drawTimer = setInterval(onUpdate, 1000 / engine.targetFps);
    })

    engine.stopUpdate = function() {
      clearInterval(engine.drawTimer);
        engine.drawTimer = null;
    }

    
    engine.key = {
        enter : 13,
        
        up    : 38,
        down  : 40,
        left  : 37,
        right : 39,
        
        space : 32,
        zero  : 48,
        one   : 49,
        two   : 50,
        three : 51,
        four  : 52,
        five  : 53,
        six   : 54,
        seven : 55,
        eight : 56,
        nine  : 57,
        
        w     : 87,
        a     : 65,
        s     : 83,
        d     : 68
    }
    
    
    engine.clamp = function(value, min, max){
     return Math.min(Math.max(value, min), max)   
    }
    
    return engine;    
}

function rgb(r, g, b)
{
  return "rgb(" + r + "," + g + "," + b + ")";
}

function rgba(r, g, b, a)
{
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function hsla(hsla)
{
  return "hsla(" + h + "," + s + "," + l + "," + a + ")";
}
