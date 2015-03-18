

/**
 * @constructor
 */
function Camera()
{
    this.PosX = 280;
    this.PosY = 110;

    this.ExactPosX = 280;
    this.ExactPosY = 110;

    this.ToScreenX = function(posX)
    {
        return posX + this.PosX;
    }

    this.ToScreenY = function (posY)
    {
        return posY + this.PosY;
    }


    this.ToWorldX = function (posX)
    {
        return posX - this.PosX;
    }

    this.ToWorldY = function (posY)
    {
        return posY - this.PosY;
    }


    this.Reset = function()
    {
        var targetX = (totalWidth / 2) - CharacterX;
        var targetY = (totalHeight / 2) - CharacterY;

        var PanDeltaX = (targetX - this.ExactPosX);
        var PanDeltaY = (targetY - this.ExactPosY);

        this.ExactPosX += PanDeltaX;
        this.ExactPosY += PanDeltaY;

        this.PosX = Math.round(this.ExactPosX);
        this.PosY = Math.round(this.ExactPosY);
    }



    this.Update = function ()
    {
        var targetX = (totalWidth / 2) - CharacterX;
        var targetY = (totalHeight / 2) - CharacterY;

        var PanDeltaX = (targetX - this.ExactPosX) * 0.04;
        var PanDeltaY = (targetY - this.ExactPosY) * 0.04;

        this.ExactPosX += PanDeltaX;
        this.ExactPosY += PanDeltaY;

        this.PosX = Math.round(this.ExactPosX);
        this.PosY = Math.round(this.ExactPosY);
    }
}
