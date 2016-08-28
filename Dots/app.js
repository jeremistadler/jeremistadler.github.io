
'use strict'
var mousePosX = 0;
var mousePosY = 0;


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d', { opaque: true });

var totalWidth = canvas.width = canvas.parentElement.clientWidth;
var totalHeight = canvas.height = canvas.parentElement.clientHeight;

mousePosX = totalWidth / 2;
mousePosY = totalHeight / 2;

window.addEventListener('resize', function(){
  totalWidth = canvas.width = canvas.parentElement.clientWidth;
  totalHeight = canvas.height = canvas.parentElement.clientHeight;

}, false);

window.addEventListener('mousemove', function(ev){
  mousePosX = ev.clientX;
  mousePosY = ev.clientY;
}, false);

canvas.addEventListener('mousedown', function(ev){
  mousePosX = ev.clientX;
  mousePosY = ev.clientY;
}, false);

canvas.addEventListener('mousedown', function(ev){
  mousePosX = ev.clientX;
  mousePosY = ev.clientY;
}, false);

canvas.addEventListener('touchstart', function(ev){
  for (var i = 0; i < ev.changedTouches.length; i++) {
    mousePosX = ev.changedTouches[i].pageX;
    mousePosY = ev.changedTouches[i].pageY;
  }
}, false);

canvas.addEventListener('touchmove', function(ev){
  for (var i = 0; i < ev.changedTouches.length; i++) {
    mousePosX = ev.changedTouches[i].pageX;
    mousePosY = ev.changedTouches[i].pageY;
  }
}, false);


var pointList = [];

var size = 50;
var spacing = 8;

var startX = (totalWidth / 2) - (size * 0.5 * spacing);
var startY = (totalHeight / 2) - (size * 0.5 * spacing);

var endX = (totalWidth / 2) + (size * 0.5 * spacing);
var endY = (totalHeight / 2) + (size * 0.5 * spacing);

for (var x = 0; x < size; x++)
    for (var y = 0; y < size; y++)
        pointList.push({
          x: x * spacing + startX,
          y: y * spacing + startY,
          velX: 0,
          velY: 0,
        });

function draw(){
  window.requestAnimationFrame(draw);

  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  for (var i = 0; i < pointList.length; i++){
    var star = pointList[i];
    var xdiff = Math.abs(star.x);
    var ydiff = Math.abs(star.y);

    var distance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);

    star.velX += (-(star.x - mousePosX) / distance);
    star.velY += (-(star.y - mousePosY) / distance);

    star.x += star.velX * 0.4;
    star.y += star.velY * 0.4;

    var hue = (distance * 0.4) % 360;
    ctx.fillStyle = "hsl(" + hue + ",100%, 70%)";
    ctx.fillRect(star.x, star.y, 2, 2);
  }
}
draw();
