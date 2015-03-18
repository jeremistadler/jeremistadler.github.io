
var TargetFps = 30;


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

    canvas.onmousedown = mouseDown;

    theAnimation = setInterval(onUpdate, 1000 / TargetFps);

    StartNetworking();
}

function mouseDown(evt)
{
    ws.send(JSON.stringify({X:evt.x, Y:evt.y}));
}

function onUpdate() 
{
    //context.fillStyle = "rgb(21, 108, 152)";
    //context.fillRect(0, 0, canvas.width, canvas.height);

    context.clearRect(0, 0, WindowWidth, WindowHeight);


    for (var i = 0; i < Actions.length; i++)
    {
        var centerX = Actions[i].X;
        var centerY = Actions[i].Y;
        var radius = Actions[i].Size;
        Actions[i].Size += 3;

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

        var strenght = (0.5 - (Actions[i].Size / 400));

        if (strenght > 0)
        {
            context.fillStyle = 'rgba(255,255,255,' + strenght + ')';
            context.fill();
        }

        strenght = (0.7 - (Actions[i].Size / 400));

        context.lineWidth = 1;
        context.strokeStyle = 'rgba(255,255,255,' + strenght + ')';
        context.stroke();
    }

    if (Actions.length > 0 && Actions[0].Size > 500)
        Actions.shift();
}


function DrawTablets() 
{
    for (var i = 0; i < Users.length; i++) 
    {
        RoundRect(Users[0].OffsetX / 20, Users[0].OffsetY / 20, Users[0].Width / 20, Users[0].Height / 20, 5);
    }
}

function RoundRect(x, y, width, height, radius) 
{
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