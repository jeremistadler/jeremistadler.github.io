
/**
 * @constructor
 */
function GameScreen()
{

    Player = new LocalPlayer();
    Players = [];

    Monsters = [];

    Shots = [];
    Splashes = [];

    Cam = new Camera();
    Cam.Reset();

    Game = this;


    ShowDebugInfo = false;
    DebugText = [];

    LastTime = new Date().getTime();
    this.LastPKeyState = false;



    this.Load = function ()
    {
        StartNetworking();
    }

    this.Update = function ()
    {
        LastTime = new Date().getTime();

        Player.Update();

        for (var i = 0; i < Shots.length; i++)
        {
            Shots[i].X += Shots[i].DirectionX;
            Shots[i].Y += Shots[i].DirectionY;
        }

        for (var i = 0; i < Players.length; i++)
        {
            Players[i].Movement.X += Players[i].Movement.VelocityX;
            Players[i].Movement.Y += Players[i].Movement.VelocityY;
        }


        while (Shots.length > 0 && Shots[0].Timeout < new Date().getTime())
            Shots.shift();

        if (keyDown(KeyboardKey_P) && this.LastPKeyState == false)
            ShowDebugInfo = !ShowDebugInfo;

        this.LastPKeyState = keyDown(KeyboardKey_P);


        if (mouseLastLeftDown == false && mouseLeftDown)
        {
            var vx = mouseX - Cam.ToScreenX(Player.X);
            var vy = mouseY - Cam.ToScreenY(Player.Y);

            var lenght = Math.sqrt(vx * vx + vy * vy);
            vx /= lenght;
            vy /= lenght;

            vx *= 2;
            vy *= 2;

            NewShots.push({ X: Player.X, Y: Player.Y, DirectionX: vx, DirectionY: vy, Player: true, ShooterId: Player.Id });
            Shots.push({ X: Player.X, Y: Player.Y, DirectionX: vx, DirectionY: vy, Timeout: new Date().getTime() + 2000 });
        }

        Cam.Update();
    }



    this.DrawUI = function ()
    {
        var width = 300;
        

        context.beginPath();
        context.rect(WindowWidth - width, 0, width, WindowHeight);

        context.fillStyle = "rgba(80, 80, 80, 0.4)";
        context.fill();

        var rg = context.createLinearGradient(WindowWidth - width, 0, WindowWidth - width, WindowHeight);
        rg.addColorStop(0, 'rgb(35,35,35)');
        rg.addColorStop(0.05, 'rgb(45,45,45)');
        rg.addColorStop(0.95, 'rgb(45,45,45)');
        rg.addColorStop(1, 'rgb(40,40,40)');

        context.beginPath();
        context.rect(WindowWidth - width, 0.5, width, WindowHeight);
        context.fillStyle = rg;
        context.fill();
        context.strokeStyle = "rgba(0, 0, 0, 0.4)";
        context.stroke();



        context.textAlign = 'center';
        context.fillStyle = "rgb(0, 0, 0)";
        context.shadowColor = "rgba(0, 0, 0, 0.6)";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;
        context.shadowBlur = 6;
        context.font = "40px Myriad Pro";
        context.fillText("Player", WindowWidth - width / 2, 70);

        context.shadowBlur = 0;
        context.shadowColor = "rgba(0, 0, 0, 0.9)";
        context.fillStyle = "rgba(0, 0, 0, 0.9)";





    }


    this.Draw = function ()
    {
        DebugText = [];

        DebugText.push("Character X: " + Player.X);
        DebugText.push("Character Y: " + Player.Y);

        context.fillStyle = "rgba(10, 10, 10, 0.4)";
        DrawEllipse(context, Cam.ToScreenX(Player.X) - 12.5, Cam.ToScreenY(Player.Y) + 23, 25, 10);

        context2d.lineWidth = 1;
        context2d.strokeStyle = "rgba(60, 60, 60, 0.7)";
        context2d.fillStyle = "rgba(60, 60, 60, 0.2)";

        for (var i = 0; i < Monsters.length; i++)
            DrawCube(Monsters[i].X, Monsters[i].Y, 7);

        for (var i = 0; i < Shots.length; i++)
            DrawCube(Shots[i].X, Shots[i].Y, 3);

        Player.Draw();

        for (var i = 0; i < Players.length; i++)
            DrawCube(Players[i].Movement.X, Players[i].Movement.Y, 10);

        context2d.fill();
        context2d.stroke();

        this.DrawUI();

        if (ShowDebugInfo)
        {
            context.fillStyle = "#ddd";
            var y = 20;
            for (var i = 0; i < DebugText.length; i++)
            {
                DrawStroke(DebugText[i], 10, y);
                y += 13;
            }
        }
    }
}
