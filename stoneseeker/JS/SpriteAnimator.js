// Author: Jeremi Stadler
// Codeyeti 2012
// License: Creative Commons copyright
// Updated: 2012-11-30

// You are free:
// To Share — to copy, distribute and transmit the work
// To Remix — to adapt the work
// To make commercial use of the work

// Under the following conditions:
// Attribution — You must attribute the work in the manner specified by the author or licensor (but not in any way that suggests that they endorse you or your use of the work.


function SpriteAnimator(imagePath, rows, columns, center) 
{
    this.Rows = rows;
    this.Columns = columns;

    this.Center = center;
    this.CenterX = 0;
    this.CenterY = 0;

    this.ImageWidth = 0;
    this.ImageHeight = 0;

    this.TileWidth = 0;
    this.TileHeight = 0;

    this.StartTime = new Date().getTime();

    this.Animations = [];
    this.CurrentAnimation = null;

    this.Loaded = false;

    var that = this;

    this.SheetImage = new Image();
    this.SheetImage.onload = function ()
    {
        that.Loaded = true;

        that.ImageWidth = that.SheetImage.width;
        that.ImageHeight = that.SheetImage.height;

        that.TileWidth = that.SheetImage.width / that.Columns;
        that.TileHeight = that.SheetImage.height / that.Rows;

        if (that.Center)
        {
            that.CenterX = Math.round(that.TileWidth / 2);
            that.CenterY = Math.round(that.TileHeight / 2);
        }
    }
    this.SheetImage.src = imagePath;


    this.ChangeAnimation = function (name) 
    {
        if (this.CurrentAnimation != null && this.CurrentAnimation.Name == name)
            return;


        this.CurrentAnimation = null;

        for (var i = 0; i < this.Animations.length; i++)
        {
            if (this.Animations[i].Name == name)
            {
                this.CurrentAnimation = this.Animations[i];
                return;
            }
        }
    }

    this.Add = function (row, startColumn, numberOfFrames, frameLenght, name)
    {
        var animation = new AnimationList();
        animation.Name = name;
        animation.FrameLenght = frameLenght;
        animation.StartColumn = startColumn;
        animation.Row = row;
        animation.Frames = numberOfFrames;

        this.Animations.push(animation);

        if (this.CurrentAnimation == null)
            this.CurrentAnimation = animation;
    }

    this.Restart = function () 
    {
        this.StartTime = new Date().getTime();
    }


    this.Draw = function (x, y) 
    {
        if (this.CurrentAnimation == null)
            return;

        if (this.Loaded == false)
            return;


        var currentFrame = (new Date().getTime() - this.StartTime) / this.CurrentAnimation.FrameLenght;
        currentFrame = Math.floor(currentFrame);

        currentFrame = this.CurrentAnimation.StartColumn + (currentFrame % this.CurrentAnimation.Frames);

        var tileWidth = (this.SheetImage.width / this.Columns);
        var tileHeight = (this.SheetImage.height / this.Rows);


        context.drawImage(
            this.SheetImage,

            tileWidth * currentFrame,
            tileHeight * this.CurrentAnimation.Row,

            tileWidth,
            tileHeight,

            Cam.ToScreenX(x) - this.CenterX,
            Cam.ToScreenY(y) - this.CenterY,

            tileWidth,
            tileHeight);

    }

    function AnimationList()
    {
        this.Row = 0;
        this.StartColumn = 0;
        this.Frames = 0;
        this.Name = "";
        this.FrameLenght = 0;
    }
}