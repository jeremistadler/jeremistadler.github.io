
/**
 * @constructor
 */
function GameScreen()
{
    this.CharacterXSpeed = 2.5;
    this.CharacterYSpeed = 2.0;

    CharacterX = 835;
    CharacterY = 210;

    DebugText = [];
    Cam = new Camera();

    ShowDebugInfo = false;
    LastTime = new Date().getTime();

    this.Monsters = [];

    this.LastPKeyState = false;

    this.Character = new SpriteAnimator("Sprites/yeti.png", 12, 14, true);


    // name, row, startColumn, numberOfFrames, frameLenght
    this.Character.Add(0, 0, 13, 50, "front");
    this.Character.Add(1, 0, 13, 50, "frontleft");
    this.Character.Add(2, 0, 13, 50, "left");
    this.Character.Add(3, 0, 13, 50, "backleft");
    this.Character.Add(4, 0, 13, 50, "back");
    this.Character.Add(5, 0, 13, 50, "backright");
    this.Character.Add(6, 0, 13, 50, "right");
    this.Character.Add(7, 0, 13, 50, "frontright");

    this.Character.Add(0, 0, 13, 30, "runfront");
    this.Character.Add(1, 0, 13, 30, "runfrontleft");
    this.Character.Add(2, 0, 13, 30, "runleft");
    this.Character.Add(3, 0, 13, 30, "runbackleft");
    this.Character.Add(4, 0, 13, 30, "runback");
    this.Character.Add(5, 0, 13, 30, "runbackright");
    this.Character.Add(6, 0, 13, 30, "runright");
    this.Character.Add(7, 0, 13, 30, "runfrontright");

    this.Character.Add(0, 0, 1, 10000, "standfront");
    this.Character.Add(1, 0, 1, 10000, "standfrontleft");
    this.Character.Add(2, 0, 1, 10000, "standleft");
    this.Character.Add(3, 0, 1, 10000, "standbackleft");
    this.Character.Add(4, 0, 1, 10000, "standback");
    this.Character.Add(5, 0, 1, 10000, "standbackright");
    this.Character.Add(6, 0, 1, 10000, "standright");
    this.Character.Add(7, 0, 1, 10000, "standfrontright");

    this.Character.Add(8,  0, 7, 120, "hitfront");
    this.Character.Add(8,  6, 7, 120, "hitfrontleft");
    this.Character.Add(9,  0, 7, 120, "hitleft");
    this.Character.Add(9,  6, 7, 120, "hitbackleft");
    this.Character.Add(10, 0, 7, 120, "hitback");
    this.Character.Add(10, 6, 7, 120, "hitbackright");
    this.Character.Add(11, 0, 7, 120, "hitright");
    this.Character.Add(11, 6, 7, 120, "hitfrontright");


    this.LastVelocityX = 0;
    this.LastVelocityY = 0;

    this.IsPunching = false;
    this.PunchTimeout = new Date().getTime();


    this.Character.ChangeAnimation("standfront");
    this.Map = new MapRenderer("TheIsland");

    this.Monsters.push(new Slime(920, 406));
    this.Monsters.push(new Slime(890, 424));
    this.Monsters.push(new Slime(922.5, 424));
    this.Monsters.push(new Slime(870, 416));

    this.Monsters.push(new Slime(1325, 412));
    this.Monsters.push(new Slime(1300, 418));
    this.Monsters.push(new Slime(1325, 444));
    this.Monsters.push(new Slime(1365, 412));

    this.Monsters.push(new Slime(1580, -200));
    this.Monsters.push(new Slime(1580, -220));
    this.Monsters.push(new Slime(1605, -210));
    this.Monsters.push(new Slime(1555, -192));

    this.Monsters.push(new Slime(1745, -520));
    this.Monsters.push(new Slime(1765, -508));
    this.Monsters.push(new Slime(1752.5, -492));
    this.Monsters.push(new Slime(1710, -492));

    this.Monsters.push(new Slime(1212.5, -614));
    this.Monsters.push(new Slime(1237.5, -608));
    this.Monsters.push(new Slime(1217.5, -586));
    this.Monsters.push(new Slime(1170, -620));

    this.Monsters.push(new Slime(732.5, -1314));
    this.Monsters.push(new Slime(747.5, -1306));
    this.Monsters.push(new Slime(747.5, -1290));
    this.Monsters.push(new Slime(720, -1308));

    this.Monsters.push(new Slime(692.5, -2008));
    this.Monsters.push(new Slime(710, -2008));
    this.Monsters.push(new Slime(697.5, -2042));
    this.Monsters.push(new Slime(727.5, -2010));

    this.Monsters.push(new Slime(350, -2292));
    this.Monsters.push(new Slime(322.5, -2280));
    this.Monsters.push(new Slime(350, -2250));
    this.Monsters.push(new Slime(397.5, -2270));


    this.UIImage = new Image();
    this.UIImage.src = "ui.png";

    this.DirtImage = new Image();
    this.DirtImage.src = "DirtLayer.png";

    this.ChestSound = new Audio("openingchest.wav");
    this.VictorySound = new Audio("victory.wav");

    this.HasWon = false;
    this.VictoryTextTimeout = new Date().getTime();

    this.CurrentMission = "Mission: Find The Chests";


    this.HpImages = [];
    for (var i = 1; i <= 5; i++)
    {
        var img = new Image();
        img.src = "hp" + i + ".png";
        this.HpImages.push(img);
    }

    this.HpImageToHide = 0;

    this.HudImage = new Image();
    this.HudImage.src = "HUD.png";

    Game = this;
    this.Hp = 5;


    this.MissionPosition = 0;
    this.MissionVelocity = 0;
    this.MissionTimeout = new Date().getTime() + 3000;


    this.Update = function ()
    {
        LastTime = new Date().getTime();

        for (var i = 0; i < this.Monsters.length; i++)
            this.Monsters[i].Update();


        if (keyDown(KeyboardKey_P) && this.LastPKeyState == false)
        {
            ShowDebugInfo = !ShowDebugInfo;
        }

        this.LastPKeyState = keyDown(KeyboardKey_P);


        this.UpdatePunch();

        this.UpdateCharacterMovement();


        if (!this.HasWon)
        {
            var lenghtX = 72 - CharacterX;
            var lenghtY = -2018 - CharacterY;

            if (Math.abs(lenghtX) < 30 && Math.abs(lenghtY) < 30)
            {
                this.HasWon = true;

                this.VictorySound.volume = 0.7;
                this.VictorySound.play();

                this.VictoryTextTimeout = LastTime + 4000;

                this.CurrentMission = "Made by Jeremi and Emil Carlsson";


                if (this.MissionPosition < 0 && this.MissionVelocity == 0)
                    this.MissionTimeout = 0;
            }
        }


        Cam.Update();
    }

    this.UpdatePunch = function ()
    {
        if (this.IsPunching && this.PunchTimeout < LastTime)
            this.IsPunching = false;

        if (keyDown(KeyboardKey_Space) && this.IsPunching == false)
        {
			this.Character.Restart();
			this.IsPunching = true;
			this.PunchTimeout = LastTime + 720;
			
			for (var i = this.Monsters.length - 1; i >= 0; i--)
			{
				var x = this.Monsters[i].X;
				var y = this.Monsters[i].Y;
				
				
				
				var charLeft = (CharacterX) - 10;
				var charTop = (CharacterY) - 2;
				
				var charRight = (CharacterX) + 10;
				var charBottom = (CharacterY) + 20;

				charLeft += this.LastVelocityX * 10;
				charRight += this.LastVelocityX * 10;
				
				charTop += this.LastVelocityY * 10;
				charBottom += this.LastVelocityY * 10;

				if (!(charLeft > x + 10 ||
				    charRight < x - 10 ||
				    charTop > y + 10 ||
				    charBottom < y - 10))
					{
						this.Monsters.splice(i, 1);
						
						
					}
			}
				
            for (var i = 0; i < LoadedMap.TileChest.length; i++)
            {
                var lenghtX = (LoadedMap.TileChest[i].X + LoadedMap.TileChest[i].Texture.Width * 0.5) - CharacterX;
                var lenghtY = (LoadedMap.TileChest[i].Y + LoadedMap.TileChest[i].Texture.Height * 0.5) - CharacterY;

                if (Math.abs(lenghtX) < 30 && Math.abs(lenghtY) < 30)
                {
                    this.ChestSound.volume = 0.7;
                    this.ChestSound.play();

                    for (var b = 0; b < LoadedMap.TileBridge.length; b++)
                    {
                        if (LoadedMap.TileBridge[b].Name == LoadedMap.TileChest[i].Name)
                            LoadedMap.TileOpenBridges.push(LoadedMap.TileBridge[b]);
                    }

                    for (var b = LoadedMap.TileBridgeHitbox.length - 1; b >= 0; b--)
                    {
                        if (LoadedMap.TileBridgeHitbox[b].Name == LoadedMap.TileChest[i].Name)
                        {
                            for (var q = 0; q < LoadedMap.TileHitbox.length; q++)
                            {
                                if (LoadedMap.TileHitbox[q].X == LoadedMap.TileBridgeHitbox[b].X &&
                                    LoadedMap.TileHitbox[q].Y == LoadedMap.TileBridgeHitbox[b].Y &&
                                    LoadedMap.TileHitbox[q].Width == LoadedMap.TileBridgeHitbox[b].Width &&
                                    LoadedMap.TileHitbox[q].Height == LoadedMap.TileBridgeHitbox[b].Height)
                                {
                                    LoadedMap.TileHitbox.splice(q, 1);
                                    break;
                                }
                            }

                            LoadedMap.TileOpenBridges.push(LoadedMap.TileBridge[b]);
                        }
                    }


                    LoadedMap.TileChest.splice(i, 1);

                    if (LoadedMap.TileChest.length == 0)
                    {
                        this.CurrentMission = "Find the Magic White Stone in the woods";

                        if (this.MissionPosition < 0 && this.MissionVelocity == 0)
                        {
                            this.MissionTimeout = 0;
                        }
                    }

                    break;
                }
            }
        }
    }

    this.UpdateCharacterMovement = function ()
    {
        var velocityX = 0;
        var velocityY = 0;

        if (keyDown(KeyboardKey_Left) || keyDown(KeyboardKey_A))
            velocityX -= this.CharacterXSpeed;

        if (keyDown(KeyboardKey_Down) || keyDown(KeyboardKey_S))
            velocityY += this.CharacterYSpeed;

        if (keyDown(KeyboardKey_Right) || keyDown(KeyboardKey_D))
            velocityX += this.CharacterXSpeed;

        if (keyDown(KeyboardKey_Up) || keyDown(KeyboardKey_W))
            velocityY -= this.CharacterYSpeed;

        if (keyDown(KeyboardKey_Shift))
        {
            velocityY *= 2;
            velocityX *= 2;
        }

        if (this.IsPunching)
        {
            velocityY = 0;
            velocityX = 0;
        }

        this.UpdateAnimation(velocityX, velocityY);

        if (!(velocityX == 0 && velocityY == 0))
        {
            this.LastVelocityX = velocityX;
            this.LastVelocityY = velocityY;
        }

        if (velocityX != 0 || velocityY != 0)
        {
            var charLeft = (velocityX + CharacterX) - 10;
            var charTop = (velocityY + CharacterY) - 2;

            var charRight = (velocityX + CharacterX) + 10;
            var charBottom = (velocityY + CharacterY) + 20;

            for (var i = 0; i < this.Map.TileHitbox.length; i++)
            {
                var tile = this.Map.TileHitbox[i];

                if (!(charLeft > tile.X + tile.Width ||
                      charRight < tile.X ||
                      charTop > tile.Y + tile.Height ||
                      charBottom < tile.Y))
                {
                    if (charLeft < tile.X || charRight > tile.X + tile.Width)
                        velocityX = 0;

                    if (charTop < tile.Y || charBottom > tile.Y + tile.Height)
                        velocityY = 0;
                }
            }

            CharacterX += velocityX;
            CharacterY += velocityY;
        }
    }

    this.UpdateAnimation = function (x, y)
    {
        var prefix = "";

        if (x == 0 && y == 0)
        {
            x = this.LastVelocityX;
            y = this.LastVelocityY;

            prefix = "stand";
        }

        else if (keyDown(KeyboardKey_Shift))
            prefix = "run";

        if (this.IsPunching)
            prefix = "hit";

        if (x == 0 && y >= 0) this.Character.ChangeAnimation(prefix + "front");
        else if (x < 0 && y > 0)  this.Character.ChangeAnimation(prefix + "frontright");
        else if (x < 0 && y == 0) this.Character.ChangeAnimation(prefix + "right");
        else if (x < 0 && y < 0)  this.Character.ChangeAnimation(prefix + "backright");
        else if (x == 0 && y < 0) this.Character.ChangeAnimation(prefix + "back");
        else if (x > 0 && y < 0)  this.Character.ChangeAnimation(prefix + "backleft");
        else if (x > 0 && y == 0) this.Character.ChangeAnimation(prefix + "left");
        else if (x > 0 && y > 0)  this.Character.ChangeAnimation(prefix + "frontleft");
    }


    this.Draw = function () {
        DebugText = [];

        DebugText.push("Character X: " + CharacterX);
        DebugText.push("Character Y: " + CharacterY);

        context.setTransform(1, 0, 0, 1, 0, 0);

        this.Map.DrawGround();

        this.DrawDirt();

        for (var i = 0; i < this.Monsters.length; i++)
            this.Monsters[i].Draw();

        //context.fillStyle = "rgba(10, 10, 10, 0.4)";
        //DrawEllipse(context, Cam.ToScreenX(CharacterX) - 12.5, Cam.ToScreenY(CharacterY) + 23, 25, 10);

        this.Map.DrawUnderlay();

        this.Character.Draw(Math.round(CharacterX), Math.round(CharacterY));

        this.Map.DrawOverlay();

        for (var i = 0; i < this.HpImages.length; i++)
        {
            var value = (10 - Math.abs(this.HpImageToHide - i)) / 10;

            value -= 0.1;
            if (value > 1) value = 1;
            if (value < 0) value = 0;

            context.globalAlpha = value;
            context.drawImage(this.HpImages[i], 10, 10);
        }
        context.globalAlpha = 1;

        this.HpImageToHide += 0.5;

        if (this.HpImageToHide >= 12)
            this.HpImageToHide = -10;

        

        context.drawImage(this.UIImage, 0, 0);


        if (this.HudImage.width > 0)
        {
            if (this.MissionTimeout < LastTime)
            {
                if (this.MissionPosition <= 0)
                {
                    this.MissionVelocity = 10.0;
                    this.MissionTimeout = LastTime + 8 * 1000;
                }
                else
                {
                    this.MissionVelocity = -1.0;
                    this.MissionTimeout = LastTime + 30 * 1000;
                }
            }

            if (this.MissionVelocity < 0) this.MissionVelocity *= 1.2;
            if (this.MissionVelocity > 0) this.MissionVelocity *= 0.91;

            if (this.MissionPosition >= this.HudImage.height && this.MissionVelocity > 0)
            {
                this.MissionVelocity = 0;
                this.MissionPosition = this.HudImage.height;
            }
            if (this.MissionPosition <= 0 && this.MissionVelocity < 0)
            {
                this.MissionVelocity = 0;
                this.MissionPosition = 0;
            }


            this.MissionPosition += this.MissionVelocity;


            context.drawImage(this.HudImage, (totalWidth - this.HudImage.width), this.MissionPosition - this.HudImage.height);


            var textSize = context.measureText(this.CurrentMission);

            context.font = "14px Verdana";
            this.DrawStroke(this.CurrentMission, ((totalWidth - this.HudImage.width) + this.HudImage.width * 0.5) - textSize.width * 0.5, this.MissionPosition - 70);


            if (this.HasWon && LastTime < this.VictoryTextTimeout)
            {
                context.font = "50px Verdana";
                var textSize = context.measureText("Victory");
                this.DrawStroke("Victory", totalWidth * 0.5 - textSize.width * 0.5, totalHeight * 0.5 - 20);
            }

            if (ShowDebugInfo)
            {
                context.strokeStyle = "rgba(200, 10, 10, 0.7)";
                context.strokeRect(
                    Cam.ToScreenX(CharacterX) - 10,
                    Cam.ToScreenY(CharacterY) + 0,
                    20,
                    20);

                this.Map.DrawBoundingBoxes();

                context.fillStyle = "#ddd";
                var y = 20;
                for (var i = 0; i < DebugText.length; i++)
                {
                    context.fillText(DebugText[i], 10, y);
                    y += 13;
                }
            }
        }
    }

    this.DrawStroke = function (text, x, y) {

        context.fillStyle = "rgba(10, 10, 10, 0.6)";

        context.fillText(text, x + 1, y);
        context.fillText(text, x, y + 1);
        context.fillText(text, x - 1, y);
        context.fillText(text, x, y - 1);

        context.fillStyle = "rgba(10, 10, 10, 0.5)";

        context.fillText(text, x + 1, y + 1);
        context.fillText(text, x - 1, y + 1);
        context.fillText(text, x + 1, y - 1);
        context.fillText(text, x - 1, y - 1);

        context.fillStyle = "rgba(10, 10, 10, 0.3)";

        context.fillText(text, x + 2, y);
        context.fillText(text, x, y + 2);
        context.fillText(text, x - 2, y);
        context.fillText(text, x, y - 2);

        context.fillStyle = "rgba(10, 10, 10, 0.2)";

        context.fillText(text, x + 2, y + 2);
        context.fillText(text, x - 2, y + 2);
        context.fillText(text, x + 2, y - 2);
        context.fillText(text, x - 2, y - 2);

        context.fillStyle = "rgba(255, 255, 255, 1.0)";
        context.fillText(text, x, y);
    }

    this.DrawDirt = function ()
    {
        if (!(this.DirtImage.width) || this.DirtImage.width == 0 || this.DirtImage.height == 0)
            return;

        var x = Cam.ToScreenX(this.DirtImage.width);
        var y = Cam.ToScreenY(this.DirtImage.height);

        while (x < 0) x += this.DirtImage.width;
        while (y < 0) y += this.DirtImage.height;

        x %= this.DirtImage.width;
        y %= this.DirtImage.height;

        context.drawImage(this.DirtImage, x - this.DirtImage.width, y - this.DirtImage.height);

        context.drawImage(this.DirtImage, (x - this.DirtImage.width), (y - this.DirtImage.height) + this.DirtImage.height);

        context.drawImage(this.DirtImage, (x - this.DirtImage.width) + this.DirtImage.width, (y - this.DirtImage.height));
        context.drawImage(this.DirtImage, (x - this.DirtImage.width) + this.DirtImage.width * 2, (y - this.DirtImage.height));

        context.drawImage(this.DirtImage, (x - this.DirtImage.width) + this.DirtImage.width, (y - this.DirtImage.height) + this.DirtImage.height);
        context.drawImage(this.DirtImage, (x - this.DirtImage.width) + this.DirtImage.width * 2, (y - this.DirtImage.height) + this.DirtImage.height);
    }
}


function DrawEllipse(ctx, x, y, w, h)
{
    var RANDOM_CONSTANT = .5522848;
    ox = (w / 2) * RANDOM_CONSTANT, // control point offset horizontal
    oy = (h / 2) * RANDOM_CONSTANT, // control point offset vertical
    xe = x + w,           			// x-end
    ye = y + h,           			// y-end
    xm = x + w / 2,       			// x-middle
    ym = y + h / 2;       			// y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
    ctx.fill();
}

