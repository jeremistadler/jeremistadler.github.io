
ws = null;

Users = [];
Actions = [];

function StartNetworking()
{
	ws = new WebSocket('ws://codeyeti.net:4040/multiscreen', 'chat');
	 //ws = new WebSocket('ws://localhost:4040/multiscreen', 'chat');

	ws.onopen = function ()
	{

	};

	
	ws.onclose = function () {
		alert("OHHH NOES! THE CONNECTION WAS LOST TO LE SERVER!");
	};
	

	ws.onmessage = function (evt)
	{
		var recived = JSON.parse(evt.data);

		if (recived.Users != undefined && recived.Users != null)
		{
		    Users = recived.Users;
		}

		if (recived.Action != undefined && recived.Action != null)
		{
		    recived.Action.Size = 1;
		    Actions.push(recived.Action);
		}
	};
}