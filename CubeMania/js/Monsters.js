
/**
 * @constructor
 */
function Slime(x, y)
{
    this.Speed = 0.8 + Math.random() * 0.1;
    this.X = x;
    this.Y = y;

    this.Move = function()
    {
        var targetX = Player.X;
        var targetY = Player.Y;

        var PanDeltaX = (targetX - this.X);
        var PanDeltaY = (targetY - this.Y);

        var val = 1.0 / Math.sqrt((PanDeltaX * PanDeltaX) + (PanDeltaY * PanDeltaY));
        PanDeltaX *= val;
        PanDeltaY *= val;


        var movementX = PanDeltaX * this.Speed;
        var movementY = PanDeltaY * this.Speed;

        var charLeft = (movementX + this.X) - 10;
        var charTop = (movementY + this.Y) - 8;

        var charRight = charLeft + 20;
        var charBottom = charTop + 16;


        this.X += movementX;
        this.Y += movementY;
    }

    this.Update = function ()
    {
        //if (new Date().getTime() > this.MoveTimeout)
        //{
        //    this.MoveTimeout = new Date().getTime() + 1000;
            this.Move();
        //}
    }

    this.Draw = function ()
    {
        DrawCube(this.X, this.Y, 10);
    }
}