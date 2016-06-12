
var TargetFps = 30;
window.onload = init;



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



function PlayNextSong()
{
    var muted = myAudioPlayer.muted;

    if (NextSong == 0) myAudioPlayer.src = "TheSagaBegins.mp3";
    if (NextSong == 1) myAudioPlayer.src = "AnxiousThoughts.mp3";

    NextSong++;

    if (NextSong > 1)
        NextSong = 0;


    myAudioPlayer.muted = muted;
}


function init()
{
    mouseX = 0;
    mouseY = 0;

    MyGameScreen = new GameScreen();
    MyMenuScreen = new MenuScreen();

    CurrentScreen = MyMenuScreen;

    canvas = document.getElementById('mainCanvas');
    context = canvas.getContext('2d');

    canvas.width = 800;
    canvas.height = 500;

    totalWidth = canvas.width;
    totalHeight = canvas.height;

    keyboard = new Array();
    mouse = new Array();

    mouseLeftDown = false;
    mouseMiddleDown = false;
    mouseRightDown = false;

    document.onkeydown = keyPressed;
    document.onkeyup = keyReleased;

    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
    canvas.onmousemove = mouseMovement;

    Cam.Reset();

    theAnimation = setInterval(onUpdate, 1000 / TargetFps);


    NextSong = 1;
    myAudioPlayer = document.getElementById('audioPlayer');
    myAudioPlayer.addEventListener('ended', PlayNextSong);
}


function onUpdate()
{
    context.fillStyle = "rgb(21, 108, 152)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    CurrentScreen.Update();
    CurrentScreen.Draw();
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
    event.preventDefault();
}

function keyReleased(event)
{
    keyboard[event.keyCode] = 0;
    event.preventDefault();
}
