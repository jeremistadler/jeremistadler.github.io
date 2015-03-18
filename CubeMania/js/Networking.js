
ws = null;
IsFirstPacket = true;
var lastX = 0;
var lastY = 0;

NewShots = [];

function StartNetworking()
{
	ws = new WebSocket('ws://codeyeti.net:4030/cubemania', 'chat');
	 //ws = new WebSocket('ws://localhost:4030/cubemania', 'chat');

	ws.onopen = function ()
	{
		window.setInterval(function ()
		{
			if (lastX != Player.X || lastY != Player.Y || NewShots.length > 0)
			{
				lastX = Player.X;
				lastY = Player.Y;

				var p = {
					Shots: NewShots,
					Movement:
					{
						X: Player.X,
						Y: Player.Y,
						VelocityX: Player.VelocityX,
						VelocityY: Player.VelocityY
					}
				};

				ws.send(JSON.stringify(p));

				NewShots = [];
			}
		}, 100);
	};

	/*
	ws.onclose = function () {
		alert("OHHH NOES! THE CONNECTION WAS LOST TO LE SERVER!");
	};
	*/

	overflowPacketData = "";

	ws.onmessage = function (evt)
	{
		if (IsFirstPacket)
		{
			IsFirstPacket = false;

			var player = JSON.parse(evt.data);
			Player.Id = player.Id;

			return;
		}

		var recived = JSON.parse(evt.data);

		if (recived.Players != undefined && recived.Players != null)
		{
			for (var i = 0; i < recived.Players.length; i++)
			{
				if (recived.Players[i].Id == Player.Id)
					continue;

				var found = false;

				for (var p = 0; p < Players.length; p++)
				{
					if (Players[p].Id == recived.Players[i].Id)
					{
						Players[p].Movement = recived.Players[i].Movement;
						found = true;
						break;
					}
				}

				if (found == false)
					Players.push(recived.Players[i]);
			}
		}

		if (recived.Monsters != undefined && recived.Monsters != null)
		{
			Monsters = recived.Monsters;
		}

		if (recived.Shots != undefined && recived.Shots != null)
		{
			for (var i = 0; i < recived.Shots.length; i++)
			{
				if (recived.Shots[i].ShooterId == Player.Id)
					continue;

				recived.Shots[i].Timeout = new Date().getTime() + 2000;
				Shots.push(recived.Shots[i]);
			}
		}
	};
}