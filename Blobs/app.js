'use strict'
var FileIdToAdd = 1;
var Blobs = [];

var scrollX = 0;
var scrollY = 0;
var zoom = 1;

var pullForce = 0.001
var pushForce = 1;


var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d', { opaque: true });

var width = canvas.width = canvas.parentElement.clientWidth;
var height = canvas.height = canvas.parentElement.clientHeight;


window.addEventListener('resize', function(){
  width = canvas.width = canvas.parentElement.clientWidth;
  height = canvas.height = canvas.parentElement.clientHeight;

})

function CalculateSize(item) {
    if (item.IsFile) return Math.min(2, item.Size * 0.3);

    var size = 0;
    for (var i = 0; i < item.Children.length; i++)
        size += CalculateSize(item.Children[i]);

    return size;
}

function AddBlobs(text) {
    var lines = text.split("\n");

    for (var i = 0; i < lines.length; i++)
        if (lines[i].length > 5)
            AddBlob(lines[i]);
}

function AddBlob(text) {
    var start = text.indexOf(" ");
    var size = -1;

    if (start > 0)
        size = parseInt(text.substring(0, start));

    if (!(isFinite(size)))
        return;


    var parts = text.substring(start + 1, text.length).split('\\');
    var blob = Blobs[0];

    for (var i = 0; i < parts.length; i++) {
        var nextBlob = blob.GetChild(parts[i]);

        if (nextBlob == null) {
            nextBlob = new Circle(blob);
            nextBlob.Name = parts[i];
            blob.Children.push(nextBlob);
            Blobs.push(nextBlob);
            nextBlob.IsFile = i == parts.length - 1;
            nextBlob.Size = (size / 100000);
            blob.Size = CalculateSize(blob);
        }

        blob = nextBlob;
    }
}

function draw(){
  window.requestAnimationFrame(draw);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, width, height);
  ctx.translate(width / 2 + scrollX, height / 2 + scrollY);


  // 1. Clear State
  for (var i = 0; i < Blobs.length; i++) {
      Blobs[i].NextDeltaX = 0.0;
      Blobs[i].NextDeltaY = 0.0;
  }

  CalculateDeltaForces(Blobs)
  CalculateDeltaPulls(Blobs)


  for (var i = 0; i < Blobs.length; i++) {
      if (!(isFinite(Blobs[i].NextDeltaX))) Blobs[i].NextDeltaX = 0;
      if (!(isFinite(Blobs[i].NextDeltaY))) Blobs[i].NextDeltaY = 0;

      Blobs[i].NextDeltaX = clamp(Blobs[i].NextDeltaX, -10, 10);
      Blobs[i].NextDeltaY = clamp(Blobs[i].NextDeltaY, -10, 10)


      Blobs[i].X += Blobs[i].NextDeltaX;
      Blobs[i].Y += Blobs[i].NextDeltaY;
  }


  ctx.lineWidth = 1;



  for (var i = 0; i < Blobs.length; i++) {
      ctx.strokeStyle = 'hsla(' + ((Blobs[i].Children.length * 10 + 90) % 360) + ', 100%, 50%, 0.8)';
      if (Blobs[i].Parent != null) {
          ctx.beginPath();
          ctx.moveTo(Blobs[i].X, Blobs[i].Y);
          ctx.lineTo(Blobs[i].Parent.X, Blobs[i].Parent.Y);
          ctx.stroke();
      }
  }


  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  for (var i = 0; i < Blobs.length; i++) {
      ctx.fillStyle = 'hsla(' + ((Blobs[i].Children.length * 10 + 90) % 360) + ', 100%, 50%, 0.8)';
      ctx.beginPath();

      ctx.arc(Blobs[i].X, Blobs[i].Y, Blobs[i].Size, 0, 2 * Math.PI, false);

      ctx.fill();
      //ctx.stroke();
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
draw();


Blobs.push(new Circle(null));
Blobs[0].Name = "C:";
Blobs[0].Size = CalculateSize(Blobs[0]);

window.setInterval(function(){
  var client = new XMLHttpRequest();
  client.open('GET', 'o' + FileIdToAdd + '.txt');
  FileIdToAdd++;
  client.onreadystatechange = function() {
      if (client.readyState === 4 && client.status === 200)
          AddBlobs(client.responseText);
  }
  client.send();
}, 1000)

document.addEventListener('mousewheel', function(e) {
    scrollX += e.wheelDeltaX;
    scrollY += e.wheelDeltaY;
    e.returnValue = false;
})

document.addEventListener('zoom', function(e) {
    console.log(e);
});

function CalculateDeltaForces(items) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].Parent == null)
            continue;

        for (var ii = 0; ii < items.length; ii++) {
            // Don't apply force to itself
            if (i === ii || items[ii].Parent === items[i])
                continue;

            var deltaX = items[i].X - items[ii].X;
            var deltaY = items[i].Y - items[ii].Y;

            if (deltaX === 0 && deltaY === 0) {
                items[i].X += (Math.random() - 0.5) * 10;
                continue;
            }

            var lenghtSquared = deltaX * deltaX + deltaY * deltaY
            var length = Math.sqrt(lenghtSquared)

            deltaX /= length;
            deltaY /= length

            // Coulomb's law  [k * (q1 * q2 / r^2)]
            var force = 1 * ((items[i].Size * items[ii].Size) / lenghtSquared);
/*
            ctx.strokeStyle = rgba(0, 200, 0, clamp(force * 100, 0, 1))
            ctx.beginPath();
            ctx.moveTo(items[i].X, items[i].Y);
            ctx.lineTo(items[ii].X, items[ii].Y);
            ctx.stroke();
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

function CalculateDeltaPulls(items) {

    // 3. Apply Parent Pull (black lines)
    for (var i = 0; i < items.length; i++) {
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
                 ctx.fillStyle = "white"
                 ctx.fillText(Math.round(force * -1000) / 1000, items[i].X - deltaX * 0.5, items[i].Y - deltaY * 0.5)
             }
             */

        deltaX *= force;
        deltaY *= force;
        /*
           ctx.strokeStyle = 'hsla(' + ((force * 10000 + 180) % 360) + ', 100%, 50%, 0.8)';
           ctx.beginPath();
           ctx.moveTo(items[i].X, items[i].Y);
           ctx.lineTo(items[i].Parent.X, items[i].Parent.Y);
           ctx.stroke();
           */

        deltaX = clamp(deltaX, -1, 1);
        deltaY = clamp(deltaY, -1, 1);


        items[i].NextDeltaX += deltaX;
        items[i].NextDeltaY += deltaY;

        // Newtons third law of motion:
        // To every action there is always an equal and opposite reaction
        items[i].Parent.NextDeltaX -= deltaX;
        items[i].Parent.NextDeltaY -= deltaY;
    }
}

function Circle(parent) {
    this.Parent = parent;
    this.Children = [];

    this.X = 0;
    this.Y = 0;

    this.Name = "";
    this.IsFile = false;

    if (parent != null) {
        var angle = Math.random() * Math.PI * 2;
        this.X = Math.cos(angle) * 40 + parent.X;
        this.Y = Math.sin(angle) * 40 + parent.Y;
    }

    this.Size = 10

    this.NextDeltaX = 0.0;
    this.NextDeltaY = 0.0;

    this.GetChild = function(name) {
        for (var i = 0; i < this.Children.length; i++)
            if (this.Children[i].Name == name)
                return this.Children[i];

        return null;
    }
}

function rgba(r, g, b, a) {
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}

function clamp(value, min, max){
 return Math.min(Math.max(value, min), max)
}
