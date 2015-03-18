
var mousePos = new Vector2();
var screenCenter = new Vector2();


function start()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    totalWidth = canvas.width;
    totalHeight = canvas.height;

    screenCenter.X = totalWidth / 2;
    screenCenter.Y = totalHeight / 2;

    pointList = [];

    var size = 20;
    var spacing = 10;

    var startX = (totalWidth / 2) - (size * 0.5 * spacing);
    var startY = (totalHeight / 2) - (size * 0.5 * spacing);

    var endX = (totalWidth / 2) + (size * 0.5 * spacing);
    var endY = (totalHeight / 2) + (size * 0.5 * spacing);

    for (var x = startX; x < endX; x += spacing)
        for (var y = startY; y < endY; y += spacing)
            pointList.push(new Star(x, y));
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

    this.Size = 1.0;

    this.UpdateAndDraw = function ()
    {
        var distance = screenCenter.LenghtBetween(new Vector2(), this.Pos);

        this.Velocity.X += (-(this.Pos.X - mouseX) / distance);
        this.Velocity.Y += (-(this.Pos.Y - mouseY) / distance);

        this.Pos.X += this.Velocity.X * 0.4;
        this.Pos.Y += this.Velocity.Y * 0.4;


        this.hue = (distance * 0.4) % 360;
        circle(this.Pos.X, this.Pos.Y, 1, "hsl(" + this.hue + ",100%, 70%)");
    }


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


    if (keyDown(87))
        start();

    mousePos.X = mouseX;
    mousePos.Y = mouseY;

    for (var i = 0; i < pointList.length; i++)
    {
        pointList[i].UpdateAndDraw();
    }

}