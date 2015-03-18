'use strict'
var FileIdToAdd = 1;
var lastKeyState = false;
var Blobs = [];

var engine = new Engine('canvas');

var scrollX = 0;
var scrollY = 0;

var scrollXDelta = 0;
var scrollYDelta = 0;


var pullForce = 0.001
var pushForce = 1;


function AddBlobs(text)
{
	var lines = text.split("\n");
		
	for (var i = 0; i < lines.length; i++)
		if (lines[i].length > 5)
			AddBlob(lines[i]);
	
	CalculateSize(Blobs[0])
}

function CalculateSize(item)
{
    if (item.IsFile) return Math.min(2, item.Size * 0.3);
    
    item.Size = 0
	for(var i = 0; i < item.Children.length; i++)
        item.Size += CalculateSize(item.Children[i]);
    
    return item.Size;
}

function AddBlob(text)
{
	var start = text.indexOf(" ");
	var size = -1;
	
	if (start > 0)
		size = parseInt(text.substring(0, start));
		
	if (!(isFinite(size)))
		size = -1;
		
		
	var parts = text.substring(start + 1, text.length).split('\\');
	
	
	var blob = Blobs[0];
	
	for (var i = 0; i < parts.length; i++)
	{
		var nextBlob = blob.GetChild(parts[i]);
		
		if (nextBlob == null)
		{
			nextBlob = new Circle(blob); 
			nextBlob.Name = parts[i];
			blob.Children.push(nextBlob);
			Blobs.push(nextBlob);
			nextBlob.IsFile = i == parts.length - 1;
			nextBlob.Size = (size / 100000);
		}
		
		blob = nextBlob;
	}
}

engine.onLoad = function(){
    Blobs.push(new Circle(null));
    Blobs[0].Name = "C:";
    
    document.addEventListener('mousewheel',  function(e){
        scrollXDelta += e.wheelDeltaX;
        scrollYDelta += e.wheelDeltaY;
        e.returnValue = false;
    })
    
    document.addEventListener('zoom',  function(e){
        console.log(e);
    })
    
    document.addEventListener('keydown',  function(e){
        if (e.keyCode == engine.key.enter)
        {
            var client = new XMLHttpRequest();
            client.open('GET', 'o' + FileIdToAdd + '.txt');
            client.onreadystatechange = function() 
            {
                if (client.readyState == 4)
                    AddBlobs(client.responseText);
            }
            FileIdToAdd++;
            client.send();            
        }
    })
}

engine.onDraw = function()
{
	// 1. Clear State
	for(var i = 0; i < Blobs.length; i++)
	{
		Blobs[i].NextDeltaX = 0.0;
		Blobs[i].NextDeltaY = 0.0;
	}

	/*for(var i = 0; i < Blobs[0].Children.length; i++)
    {
        CalculateDeltaForces(Blobs[0].Children[i].Children)
        CalculateDeltaPulls(Blobs[0].Children[i].Children)
        walkChildren(Blobs[0].Children[i].Children);
    }*/
    
    scrollX -= (scrollX - scrollXDelta) * 0.4;
    scrollY -= (scrollY - scrollYDelta) * 0.4;
    
    engine.ctx.setTransform(1, 0, 0, 1, 0, 0);
    engine.ctx.translate(engine.width / 2 + scrollX, engine.height / 2 + scrollY);
    
    CalculateDeltaForces(Blobs)
    CalculateDeltaPulls(Blobs)
	
    
	for(var i = 0; i < Blobs.length; i++)
	{
		if (!(isFinite(Blobs[i].NextDeltaX))) Blobs[i].NextDeltaX = 0;
		if (!(isFinite(Blobs[i].NextDeltaY))) Blobs[i].NextDeltaY = 0;
        
        Blobs[i].NextDeltaX = engine.clamp(Blobs[i].NextDeltaX, -10, 10);
        Blobs[i].NextDeltaY = engine.clamp(Blobs[i].NextDeltaY, -10, 10)

        
		Blobs[i].X += Blobs[i].NextDeltaX;
		Blobs[i].Y += Blobs[i].NextDeltaY;
	}
    
   
	engine.ctx.lineWidth = 1;
	

    
	for(var i = 0; i < Blobs.length; i++)
    {
		engine.ctx.strokeStyle = 'hsla(' + ((Blobs[i].Children.length * 10 + 90) % 360) + ', 100%, 50%, 0.8)';
		if (Blobs[i].Parent != null)
		{
			engine.ctx.beginPath();
			engine.ctx.moveTo(Blobs[i].X, Blobs[i].Y);
			engine.ctx.lineTo(Blobs[i].Parent.X, Blobs[i].Parent.Y);
			engine.ctx.stroke();
		}
	}
    
    
    engine.ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
	for(var i = 0; i < Blobs.length; i++)
    {
		engine.ctx.fillStyle = 'hsla(' + ((Blobs[i].Children.length * 10 + 90) % 360) + ', 100%, 50%, 0.8)';
		engine.ctx.beginPath();
		
		engine.ctx.arc(Blobs[i].X, Blobs[i].Y, Blobs[i].Size, 0, 2 * Math.PI, false);
			
		engine.ctx.fill();
		//engine.ctx.stroke();
	}
    
    engine.ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function CalculateDeltaForces(items){
	for(var i = 0; i < items.length; i++)
	{
		if (items[i].Parent == null)
			continue;
	
		for(var ii = 0; ii < items.length; ii++)
		{
			// Don't apply force to itself
			if (i == ii || items[ii].Parent == items[i])
				continue;
		
			var deltaX = items[i].X - items[ii].X;
			var deltaY = items[i].Y - items[ii].Y;
			
			if (deltaX == 0 && deltaY == 0)
			{
				items[i].X++;
				items[ii].X--;
				continue;
			}
            
            var lenghtSquared = deltaX * deltaX + deltaY * deltaY
            var length = Math.sqrt(lenghtSquared)

            deltaX /= length;
            deltaY /= length
			
			// Coulomb's law  [k * (q1 * q2 / r^2)]
			var force = 1 * ((items[i].Size * items[ii].Size) / lenghtSquared);
			
/*
            engine.ctx.strokeStyle = rgba(0, 200, 0, engine.clamp(force * 10, 0, 1))
            engine.ctx.beginPath();
            engine.ctx.moveTo(items[i].X, items[i].Y);
            engine.ctx.lineTo(items[ii].X, items[ii].Y);
            engine.ctx.stroke();
*/

			//Restrict Force to close objects, Could it be exchanged for a curve? or a change in the law above?
			//if (force < 0.001)
				//continue;
			
			deltaX *= force;
			deltaY *= force;
			
			items[i].NextDeltaX += deltaX;
			items[i].NextDeltaY += deltaY;
            
            items[ii].NextDeltaX -= deltaX;
			items[ii].NextDeltaY -= deltaY;
		}
	}
    
}

function CalculateDeltaPulls(items){
	
	// 3. Apply Parent Pull (black lines)
	for(var i = 0; i < items.length; i++)
	{
		if (items[i].Parent == null)
			continue;
			
		var deltaX = items[i].X - items[i].Parent.X;
		var deltaY = items[i].Y - items[i].Parent.Y;
		
        var lenghtSquared = deltaX * deltaX + deltaY * deltaY
        var length = Math.sqrt(lenghtSquared)
        
        deltaX /= length;
        deltaY /= length
        
		var force = -0.0001 * lenghtSquared;
		
   /*     
        if (force < -0.3)
        {
            engine.ctx.fillStyle = "white"
            engine.ctx.fillText(Math.round(force * -1000) / 1000, items[i].X - deltaX * 0.5, items[i].Y - deltaY * 0.5)
        }
        */
        
		deltaX *= force;
		deltaY *= force;
     /*   
        engine.ctx.strokeStyle = 'hsla(' + ((force * 10000 + 180) % 360) + ', 100%, 50%, 0.8)';
        engine.ctx.beginPath();
        engine.ctx.moveTo(items[i].X, items[i].Y);
        engine.ctx.lineTo(items[i].Parent.X, items[i].Parent.Y);
        engine.ctx.stroke();
        */
        
        deltaX = engine.clamp(deltaX, -1, 1);
        deltaY = engine.clamp(deltaY, -1, 1);

		
		items[i].NextDeltaX += deltaX;
		items[i].NextDeltaY += deltaY;

		// Newtons third law of motion: 
		// To every action there is always an equal and opposite reaction
		items[i].Parent.NextDeltaX -= deltaX;
		items[i].Parent.NextDeltaY -= deltaY;
	}
}

function Circle(parent)
{
	this.Parent = parent;
	this.Children = [];

	this.X = 0;
	this.Y = 0;
	
	this.Name = "";
	this.IsFile = false;
	
	if (parent != null)
	{
		var angle = Math.random() * Math.PI * 2;
		this.X = Math.cos(angle) * 40 + parent.X;
		this.Y = Math.sin(angle) * 40 + parent.Y;
	}
	
	this.Size = 10
	
	this.NextDeltaX = 0.0;
	this.NextDeltaY = 0.0;
	
	this.GetChild = function(name)
	{
		for (var i = 0;i < this.Children.length; i++)
			if (this.Children[i].Name == name)
				return this.Children[i];
			
		return null;
	}
}
