
var WindowWidth = 0;
var WindowHeight = 0;

var PanX = 0;
var PanY = 0;

var Zoom = 10.0;

var MouseIsDown = false;
var MousePosX = -1;
var MousePosY = -1;

var LastEquationValues = []
var EquationTextBoxes = []
var EquationFunctions = []
var InfoLabels = []
var Colors = [];

var ShowGrid = true;
var ShowMarkers = true;

function loadCanvas()
{
	canvas = document.getElementById('BackgroundCanvas');
	context2D = canvas.getContext('2d');

	context2D.beginPath();
	context2D.lineCap = 'round';
	context2D.lineWidth = 1;

	WindowWidth = window.innerWidth;
	WindowHeight = window.innerHeight;
	
	canvas.width = WindowWidth;
	canvas.height = WindowHeight;

	PanX = canvas.width / 2;
	PanY = canvas.height / 2;
	
	canvas.onmousedown = function(e) { MouseIsDown = true; MousePosX = e.x; MousePosY = e.y; }
	canvas.onmouseup = function(e) { MouseIsDown = false; }
	
	document.getElementById('GridEnabled').onclick = function(e) { ShowGrid = document.getElementById('GridEnabled').checked; DrawCanvas(); }
	document.getElementById('MarkersEnabled').onclick = function(e) { ShowMarkers = document.getElementById('MarkersEnabled').checked; DrawCanvas(); }

	for (var i = 1; i<=6;i++)
	{
		var color = "hsl(" + ((i * 50) % 360) + ", 80%, 50%)";
		Colors.push(color);
	
		var textBox = document.getElementById('funcTextBox' + i);
		var colorBox = document.getElementById('colorBox' + i);
		var infoColorBox = document.getElementById('infoColorBox' + i);
		var infoLabel = document.getElementById('infoLabel' + i);
		
		LastEquationValues.push("");
		EquationTextBoxes.push(textBox);
		EquationFunctions.push(GetNaN);
		InfoLabels.push(infoLabel);
		
		colorBox.style.backgroundColor = color;
		infoColorBox.style.backgroundColor = color;
	}
	
	setInterval(function() 
	{
		var update = false;
		for (var i = 0; i<EquationTextBoxes.length;i++)
		{
			var text = EquationTextBoxes[i].value;
			if (LastEquationValues[i] != text)
			{
				LastEquationValues[i] = text;
				
				try
				{
					eval("EquationFunctions[" + i + "]=function(x){return " + text + ";};");
					EquationFunctions[i](0);
					EquationTextBoxes[i].style.color = "black";
				}
				catch(err)
				{
					EquationFunctions[i] = GetNaN;
					EquationTextBoxes[i].style.color = "red";
				}
				
				
				if (text == "")
					EquationFunctions[i] = GetNaN;
				
				update = true;
			}
		}
		
		if (update)
			DrawCanvas();
	}, 100);
	
	canvas.onmousemove = function(e)
	{
		if(!MouseIsDown)
		{
			for (var eq = 0; eq < EquationFunctions.length;eq++)
			{
				InfoLabels[eq].innerHTML = EquationFunctions[eq]((e.x - PanX) / Zoom).toFixed(1);
			}
			return;
		}

		PanX += e.x - MousePosX;
		PanY += e.y - MousePosY;
		
		MousePosX = e.x; 
		MousePosY = e.y;
		
		DrawCanvas();
	}
	
	window.onresize = function(event) 
	{
		WindowWidth = window.innerWidth;
		WindowHeight = window.innerHeight;
		
		canvas.width = WindowWidth;
		canvas.height = WindowHeight;
		
		DrawCanvas();
	}
	
	canvas.onmousewheel = function(e)
	{
		if (e.wheelDelta < 0)
			Zoom *= 1 - Math.abs(e.wheelDelta) * 0.001;
		else if (e.wheelDelta > 0)
			Zoom *= 1 + e.wheelDelta * 0.001;
			
		if (Zoom < 0.1)
			Zoom = 0.1;
		
		if (Zoom > 1000 * 1000 * 10)
			Zoom = 1000 * 1000 * 10;
		
		DrawCanvas();
	}
	
	DrawCanvas();
}

function DrawGrid()
{
	var spacing = 20;
	
	var offsetX = 0;
	var offsetY = 0;

	context2D.lineCap = 'square';
	context2D.lineWidth = 1;
	
	offsetX = Math.floor(offsetX) + 0.5; 
	
	var pos = 0.000001;
	
	for (var i = 0; i < 10; i++)
	{
		if (pos * Zoom > 10 && pos * Zoom < 800)
		{
			context2D.beginPath();
			
			spacing = pos * Zoom;
			
			offsetX = (PanX) % (spacing);
			offsetY = (PanY) % (spacing);

			offsetX -= spacing;
			offsetY -= spacing;
			
		
			for (var x = offsetX; x < (WindowWidth + spacing * 2); x += spacing)
			{
				context2D.moveTo(Math.floor(x) + 0.5, 0);
				context2D.lineTo(Math.floor(x) + 0.5, WindowHeight);
			}

			for (var y = offsetY; y < (WindowWidth + spacing * 2); y += spacing)
			{
				context2D.moveTo(0, Math.floor(y) + 0.5);
				context2D.lineTo(WindowWidth, Math.floor(y) + 0.5);
			}
			
			var alpha = (spacing / 100);
			if (alpha < 0) continue;
			if (alpha > 0.4) alpha = 0.4;
			
			context2D.strokeStyle = 'rgba(0, 0, 0, ' + alpha + ')';
			context2D.stroke();
		}
		
		pos *= 10;
	}
}

function DrawMarkers()
{
	context2D.lineCap = 'square';
	context2D.lineWidth = 1;
	context2D.textBaseline = 'middle';
	context2D.font = '11pt Calibri';
	context2D.fillStyle = 'rgba(0, 0, 0, 0.8)';
	context2D.beginPath();
	
	context2D.moveTo(Math.floor(PanX) + 0.5, 0.5);
	context2D.lineTo(Math.floor(PanX) + 0.5, WindowHeight + 0.5);
	
	context2D.moveTo(0, Math.floor(PanY) + 0.5);
	context2D.lineTo(WindowWidth, Math.floor(PanY) + 0.5);
	
	context2D.strokeStyle = 'rgba(0, 0, 0, 0.0)';
	context2D.stroke();

	
	var pos = 10000;
	
	for (var i = 0; i < 10; i++)
	{
		if (pos * Zoom > 5 && pos * Zoom < 4000)
		{	
			context2D.beginPath();
			
			context2D.moveTo(PanX - 3, Math.floor(PanY - pos * Zoom) + 0.5);
			context2D.lineTo(PanX + 4, Math.floor(PanY - pos * Zoom) + 0.5);
			
			context2D.moveTo(PanX - 3, Math.floor(PanY + pos * Zoom) + 0.5);
			context2D.lineTo(PanX + 4, Math.floor(PanY + pos * Zoom) + 0.5);
			
			
			context2D.moveTo(Math.floor(PanX - pos * Zoom) + 0.5, PanY - 3);
			context2D.lineTo(Math.floor(PanX - pos * Zoom) + 0.5, PanY + 4);
			
			context2D.moveTo(Math.floor(PanX + pos * Zoom) + 0.5, PanY - 3);
			context2D.lineTo(Math.floor(PanX + pos * Zoom) + 0.5, PanY + 4);
			
			var alpha = ((pos * Zoom) / 20) - 0.2;
			if (alpha < 0) continue;
			if (alpha > 0.5) alpha = 0.5;
			
			context2D.strokeStyle = 'rgba(0, 0, 0, ' + alpha + ')';
			context2D.fillStyle = 'rgba(0, 0, 0, ' + (alpha * 2) + ')';
			context2D.stroke();
			
			
			context2D.textBaseline = 'middle';
			context2D.textAlign = 'start';
			
			context2D.fillText(pos, PanX + 8, PanY - pos * Zoom);
			context2D.fillText("-" + pos, PanX + 8, PanY + pos * Zoom);
			
			context2D.textBaseline = 'top';
			context2D.textAlign = 'center';
			
			context2D.fillText("-" + pos, PanX - pos * Zoom, PanY + 8);
			context2D.fillText(pos, PanX + pos * Zoom, PanY + 8);
		}
		
		pos /= 10;
	}
}

function DrawGraph()
{
	context2D.lineCap = 'square';
	context2D.lineWidth = 1.5;
	
	for (var eq = 0; eq < EquationFunctions.length;eq++)
	{
		var func = EquationFunctions[eq];
		
		context2D.beginPath();
		
		var firstLine = true;
	
		for	(var i = 0; i < WindowWidth; i++)
		{
			var n = func((i - PanX) / Zoom) * Zoom * -1;
			if (isFinite(n))
			{
				if (firstLine)
				{
					firstLine = false;
					context2D.moveTo(i, n + PanY);
				}
				context2D.lineTo(i, n + PanY);
			}
			else
			firstLine = true;
		}
	
		context2D.strokeStyle = Colors[eq];
		context2D.stroke();
	}
}


function DrawCanvas()
{
	context2D.clearRect(0, 0, WindowWidth, WindowHeight);
	
	if (ShowGrid)
		DrawGrid();
	
	if (ShowMarkers)
		DrawMarkers();
	
	DrawGraph();
}
	

function GetNaN(x)
{
	return Number.NaN;
}


window.onload = loadCanvas;