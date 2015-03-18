
var TargetFps = 20;

KeyboardKey_A = 65;
KeyboardKey_S = 83;
KeyboardKey_D = 68;
KeyboardKey_W = 87;

KeyboardKey_Left = 37;
KeyboardKey_Right = 39;
KeyboardKey_Up = 38;
KeyboardKey_Down = 40;

KeyboardKey_Space = 32;
KeyboardKey_Shift = 16;

KeyboardKey_P = 80;



function Load() 
{
	mouseX = 0;
	mouseY = 0;

	canvas = document.getElementById('GameCanvas');
	context = canvas.getContext('2d');
	context2d = context;
	context2D = context;

	WindowWidth = window.innerWidth;
	WindowHeight = window.innerHeight;

	canvas.width = WindowWidth;
	canvas.height = WindowHeight;


	window.onresize = function (event)
	{
		WindowWidth = window.innerWidth;
		WindowHeight = window.innerHeight;

		canvas.width = WindowWidth;
		canvas.height = WindowHeight;
	}

	totalWidth = canvas.width;
	totalHeight = canvas.height;

	keyboard = new Array();
	mouse = new Array();

	mouseLeftDown = false;
	mouseMiddleDown = false;
	mouseRightDown = false;

	mouseLastLeftDown = false;
	mouseLastMiddleDown = false;
	mouseLastRightDown = false;

	document.onkeydown = keyPressed;
	document.onkeyup = keyReleased;

	canvas.onmousedown = mouseDown;
	canvas.onmouseup = mouseUp;
	canvas.onmousemove = mouseMovement;
	
	MyGameScreen = new GameScreen();
	CurrentScreen = MyGameScreen;
	CurrentScreen.Load();

	theAnimation = setInterval(onUpdate, 1000 / TargetFps);
}


function onUpdate() 
{
	//context.fillStyle = "rgb(21, 108, 152)";
	//context.fillRect(0, 0, canvas.width, canvas.height);

	context2D.clearRect(0, 0, WindowWidth, WindowHeight);

	CurrentScreen.Update();
	CurrentScreen.Draw();

	mouseLastLeftDown = mouseLeftDown;
	mouseLastMiddleDown = mouseMiddleDown;
	mouseLastRightDown = mouseRightDown;
}

function mouseDown(event) 
{
	mouse[event.button] = 1;

	if (event.button == 0)
		mouseLeftDown = true;
	else if (event.button == 1)
		mouseMiddleDown = true;
	else if (event.button == 2)
		mouseRightDown = true;
}

function mouseUp(event) 
{
	mouse[event.button] = 0;

	if (event.button == 0)
		mouseLeftDown = false;
	else if (event.button == 1)
		mouseMiddleDown = false;
	else if (event.button == 2)
		mouseRightDown = false;
}

function mouseMovement(event)
{
	if (event.pageX || event.pageY)
	{
		pageX = event.pageX;
		pageY = event.pageY;
	}

	else if (event.clientX || event.clientY)
	{
		pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		pageY = event.clientY + document.body.scrollLeft + document.documentElement.scrollLeft;
	}

	mouseX = pageX - canvas.offsetLeft;
	mouseY = pageY - canvas.offsetTop;
}


function keyDown(key) 
{
	return keyboard[key] == 1;
}

function keyPressed(event) 
{
	keyboard[event.keyCode] = 1;
}

function keyReleased(event) 
{
	keyboard[event.keyCode] = 0;
}


function DrawCube(x, y, size)
{
	size = Math.round(size);
	x = Math.floor(Cam.ToScreenX(x)) + 0.5;
	y = Math.floor(Cam.ToScreenY(y)) + 0.5;

	context2d.moveTo(x - size, y - size);

	context2d.lineTo(x + size, y - size);
	context2d.lineTo(x + size, y + size);
	context2d.lineTo(x - size, y + size);
	context2d.lineTo(x - size, y - size);
}

function DrawStroke(text, x, y)
{
	context.fillStyle = "rgba(10, 10, 10, 0.6)";

	context.fillText(text, x + 1, y);
	context.fillText(text, x, y + 1);
	context.fillText(text, x - 1, y);
	context.fillText(text, x, y - 1);

	context.fillStyle = "rgba(10, 10, 10, 0.5)";

	context.fillText(text, x + 1, y + 1);
	context.fillText(text, x - 1, y + 1);
	context.fillText(text, x + 1, y - 1);
	context.fillText(text, x - 1, y - 1);

	context.fillStyle = "rgba(10, 10, 10, 0.3)";

	context.fillText(text, x + 2, y);
	context.fillText(text, x, y + 2);
	context.fillText(text, x - 2, y);
	context.fillText(text, x, y - 2);

	context.fillStyle = "rgba(10, 10, 10, 0.2)";

	context.fillText(text, x + 2, y + 2);
	context.fillText(text, x - 2, y + 2);
	context.fillText(text, x + 2, y - 2);
	context.fillText(text, x - 2, y - 2);

	context.fillStyle = "rgba(255, 255, 255, 1.0)";
	context.fillText(text, x, y);
}

function DrawEllipse(ctx, x, y, w, h)
{
	var RANDOM_CONSTANT = .5522848;
	ox = (w / 2) * RANDOM_CONSTANT, // control point offset horizontal
	oy = (h / 2) * RANDOM_CONSTANT, // control point offset vertical
	xe = x + w,           			// x-end
	ye = y + h,           			// y-end
	xm = x + w / 2,       			// x-middle
	ym = y + h / 2;       			// y-middle

	ctx.beginPath();
	ctx.moveTo(x, ym);
	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
	ctx.closePath();
	ctx.fill();
}

function RoundRect(x, y, width, height, radius)
{
	width = Math.round(width);
	height = Math.round(height);
	x = Math.floor(x) + 0.5;
	y = Math.floor(y) + 0.5;

	context.beginPath();
	context.moveTo(x + radius, y);
	context.lineTo(x + width - radius, y);
	context.quadraticCurveTo(x + width, y, x + width, y + radius);
	context.lineTo(x + width, y + height - radius);
	context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	context.lineTo(x + radius, y + height);
	context.quadraticCurveTo(x, y + height, x, y + height - radius);
	context.lineTo(x, y + radius);
	context.quadraticCurveTo(x, y, x + radius, y);
	context.closePath();
}