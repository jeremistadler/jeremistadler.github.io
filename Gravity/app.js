
var mousePos = new Vector2();
var screenCenter = new Vector2();


Stars = [];
Planets = [];
Nebulas = [];

var SunMinimumSize = 150;
var AsteroidMaxSize = 60;

NebulaImages = [];
PlanetImages = [];


function start()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    totalWidth = canvas.width;
    totalHeight = canvas.height;

    screenCenter.X = totalWidth / 2;
    screenCenter.Y = totalHeight / 2;

    NebulaImages = LoadImages('Images/nebula1.png, Images/nebula2.png, Images/nebula3.png, Images/nebula5.png, Images/nebula6.png, Images/nebula7.png');
    PlanetImages = LoadImages('Images/planet1.png, Images/planet2.png, Images/planet3.png');

    Player = new PlayerClass();

    for (var i = 0; i < 200; i++)
        Nebulas.push(new Nebula(
            (0.5 - Math.random()) * totalWidth * 8,
            (0.5 - Math.random()) * totalHeight * 8));


    for (var i = 0; i < 500; i++)
        Stars.push(new Star(-5 + Math.random() * totalWidth, -5 + Math.random() * totalHeight));


    for (var i = 0; i < 300; i++)
        Planets.push(new Planet(
            (0.5 - Math.random()) * totalWidth * 8,
            (0.5 - Math.random()) * totalHeight * 8,
            (Math.random() * 20 + 20)));

    for (var i = 0; i < 100; i++)
        Planets.push(new Planet(
            (0.5 - Math.random()) * totalWidth * 8,
            (0.5 - Math.random()) * totalHeight * 8,
            (Math.random() * 5 + AsteroidMaxSize)));

    for (var i = 0; i < 10; i++)
        Planets.push(new Planet(
            (0.5 - Math.random()) * totalWidth * 8,
            (0.5 - Math.random()) * totalHeight * 8,
            (Math.random() * SunMinimumSize + SunMinimumSize)));

}

function ScoresDownloaded(scoreText)
{
    alert(scoreText);
}


function Star(posX, posY)
{
    this.Pos = new Vector2();
    this.Velocity = new Vector2();

    this.Pos.X = posX;
    this.Pos.Y = posY;
    this.Size = 0.3 + Math.random() * 1.0;


    this.UpdateAndDraw = function()
    {
        this.Pos.Add(MultiplyVectorBy(Player.Velocity, this.Size * 0.005));

        if (this.Pos.X > totalWidth + 6)
            this.Pos.X = -5;

        if (this.Pos.Y > totalHeight + 6)
            this.Pos.Y = -5;


        if (this.Pos.X < -6)
            this.Pos.X = totalWidth + 5;

        if (this.Pos.Y < -6)
            this.Pos.Y = totalHeight + 5;

        context2D.fillRect(this.Pos.X, this.Pos.Y, this.Size, this.Size);
    }

    this.DrawBig = function ()
    {
        context2D.fillRect(this.Pos.X - this.Size, this.Pos.Y - this.Size, this.Size + this.Size * 2, this.Size + this.Size * 2);
    }
}

function Nebula(posX, posY)
{
    this.Pos = new Vector2();
    this.Velocity = new Vector2();

    this.Pos.X = posX;
    this.Pos.Y = posY;

    this.Size = 130 + Math.random() * 200;
    this.Rotation = Math.random() * Math.PI * 2;
    this.Texture = randomAlternative(NebulaImages);

    this.UpdateAndDraw = function()
    {
        var radius = this.Size * 0.5;

        this.Pos.Add(MultiplyVectorBy(Player.Velocity, this.Size * 0.000015));

        context2D.save();
        context2D.translate(Player.Pos.X + this.Pos.X, Player.Pos.Y + this.Pos.Y);
        context2D.rotate(this.Rotation);

        context2D.drawImage(this.Texture, -radius, -radius, this.Size, this.Size);

        context2D.restore();
    }
}



function Planet(posX, posY, size) 
{
    this.Pos = new Vector2();
    this.Velocity = new Vector2();

    this.Pos.X = posX;
    this.Pos.Y = posY;

    this.Size = size;
    this.Rotation = 0;

    this.RotationSpeed = (0.5 - Math.random()) * 0.008;

    if (this.Size < AsteroidMaxSize)
    {
        this.Texture = PlanetImages[0];
    }
    else if(this.Size > SunMinimumSize)
    {
        this.Texture = PlanetImages[2];
    }
    else
    {
        this.Texture = PlanetImages[1];
    }


    this.UpdateAndDraw = function() 
    {
        this.Pos.Add(Player.Velocity);

        this.Rotation += this.RotationSpeed;

        var radius = this.Size * 0.5;

        context2D.save();
        context2D.translate(Player.Pos.X + this.Pos.X, Player.Pos.Y + this.Pos.Y);
        context2D.rotate(this.Rotation);

        context2D.drawImage(this.Texture, -radius, -radius, this.Size, this.Size);

        context2D.restore();
    }
}

function PlayerClass()
{
    this.Pos = new Vector2();
    this.Velocity = new Vector2();

    this.Pos.X = screenCenter.X;
    this.Pos.Y = screenCenter.Y;

    this.Size = 40;
    this.Rotation = 0;
    this.Texture = PlanetImages[0];

    this.UpdateAndDraw = function()
    {
        this.Rotation += this.RotationSpeed;

        var radius = this.Size * 0.5;

        context2D.save();
        context2D.translate(this.Pos.X, this.Pos.Y);
        context2D.rotate(this.Rotation);

        context2D.drawImage(this.Texture, -radius, -radius, this.Size, this.Size);

        context2D.restore();
    }
}

function LenghtBetween(vec1, vec2)
{
    xdiff = Math.abs(vec1.X - vec2.X);
    ydiff = Math.abs(vec1.Y - vec2.Y);

    return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
}


function MultiplyVectors(v1, v2)
{
    var vr = new Vector2();
    vr.X = v1.X * v2.X;
    vr.Y = v1.Y * v2.Y;
    return vr;
}

function MultiplyVectorBy(v1, value)
{
    var vr = new Vector2();
    vr.X = v1.X * value;
    vr.Y = v1.Y * value;
    return vr;
}

function Vector2()
{
    this.X = 0.0;
    this.Y = 0.0;

    this.Substract = function(other)
    {
        this.X -= other.X;
        this.Y -= other.Y;
    }

    this.Add = function(other)
    {
        this.X += other.X;
        this.Y += other.Y;
    }

    this.Lenght = function()
    {
        xdiff = Math.abs(this.X);
        ydiff = Math.abs(this.Y);

        return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    }

    this.LenghtBetween = function (vec1, vec2)
    {
        xdiff = Math.abs(vec1.X - vec2.X);
        ydiff = Math.abs(vec1.Y - vec2.Y);

        return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    }
}


function update()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    totalWidth = canvas.width;
    totalHeight = canvas.height;

    screenCenter.X = totalWidth / 2;
    screenCenter.Y = totalHeight / 2;

    clearScreenWithColor("black");


    mousePos.X = mouseX;
    mousePos.Y = mouseY;

    var movement = new Vector2();
    movement.X += 0.045;
    movement.Y += 0.027;

    context2D.fillStyle = "rgb(255, 255, 255)";


    for (var i = 0; i < Nebulas.length; i++)
        Nebulas[i].UpdateAndDraw();


    for (var i = 0; i < Stars.length; i++)
        Stars[i].UpdateAndDraw(movement);

    context2D.fillStyle = "rgba(255, 255, 255, 0.2)";

    for (var i = 0; i < Stars.length; i++)
        Stars[i].DrawBig();


    if (keyDown(up))
        Player.Velocity.Y++;

    if (keyDown(down))
        Player.Velocity.Y--;

    if (keyDown(left))
        Player.Velocity.X++;

    if (keyDown(right))
        Player.Velocity.X--;


    for (var i = 0; i < Planets.length; i++)
        Planets[i].UpdateAndDraw();


    for (var i1 = 0; i1 < Planets.length; i1++) 
    {
        for (var i2 = 0; i2 < Planets.length; i2++) 
        {
            var r = (LenghtBetween(Planets[i1].Pos, Planets[i2].Pos));
            var f = (Planets[i1].Size * Planets[i2].Size) / (r*r));

            var movement = Planets[i1].Pos - Planets[i2].Pos


        }
    }


    Player.UpdateAndDraw();
}