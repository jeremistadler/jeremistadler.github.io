
/**
 * @constructor
 */
function Slime(x, y)
{
    this.Speed = 0.8 + Math.random() * 0.1;
    this.Animation = new SpriteAnimator("Sprites/slimesheet.png", 5, 11, true);

    this.SlimeSound = new Audio("hittingmonsters.mp3");

    this.Animation.Add(0, 0, 11, 150 + Math.random() * 50, "right");
    this.Animation.Add(1, 0, 11, 150 + Math.random() * 50, "up");
    this.Animation.Add(2, 0, 11, 150 + Math.random() * 50, "hit");
    this.Animation.Add(3, 0, 11, 150 + Math.random() * 50, "left");
    this.Animation.Add(4, 0, 11, 150 + Math.random() * 50, "down");

    this.Animation.ChangeAnimation("up");

    this.MoveTimeout = new Date().getTime() + 1000;

    this.X = x;
    this.Y = y;

    this.Move = function()
    {
        var targetX = CharacterX;
        var targetY = CharacterY;

        var PanDeltaX = (targetX - this.X);
        var PanDeltaY = (targetY - this.Y);

        var val = 1.0 / Math.sqrt((PanDeltaX * PanDeltaX) + (PanDeltaY * PanDeltaY));
        PanDeltaX *= val;
        PanDeltaY *= val;

        if (val < 0.005)
        {
            //PanDeltaX = Math.random() * 0.5;
            //PanDeltaY = Math.random() * 0.5;
        }

        if (val > 0.005)
        {
            if (Math.random() < 0.3)
            {
                if (val * 10 > 1)
                    this.SlimeSound.volume = 1;
                else
                    this.SlimeSound.volume = val * 10;
                //this.SlimeSound.play();
            }
        }

        var movementX = PanDeltaX * this.Speed;
        var movementY = PanDeltaY * this.Speed;

        var charLeft = (movementX + this.X) - 10;
        var charTop = (movementY + this.Y) - 8;

        var charRight = charLeft + 20;
        var charBottom = charTop + 16;

        for (var i = 0; i < LoadedMap.TileHitbox.length; i++)
        {
            var tile = LoadedMap.TileHitbox[i];

            if (!(charLeft > tile.X + tile.Width ||
                    charRight < tile.X ||
                    charTop > tile.Y + tile.Height ||
                    charBottom < tile.Y))
            {
                if (charLeft < tile.X || charRight > tile.X + tile.Width)
                    movementX = 0;

                if (charTop < tile.Y || charBottom > tile.Y + tile.Height)
                    movementY = 0;
            }
        }

        if (movementX == 0 && movementY == 0)
            this.Animation.ChangeAnimation("up");
        else if (movementX > 0) this.Animation.ChangeAnimation("left");
        else if (movementX < 0) this.Animation.ChangeAnimation("right");
        else if (movementY > 0) this.Animation.ChangeAnimation("up");
        else if (movementY < 0) this.Animation.ChangeAnimation("down");

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
        this.Animation.Draw(this.X, this.Y);
    }
}