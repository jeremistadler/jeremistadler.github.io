function startSocket() {
    ws = new WebSocket('ws://' + ServerHost + '/perf', 'chat');

    ws.onopen = function ()
    {
        ws.send("PINK IS A GOOD COLOR");
    };

    /*
	ws.onclose = function () {
	    alert("OHHH NOES! THE CONNECTION WAS LOST TO LE SERVER!");
	};
    */

    overflowPacketData = "";

    ws.onmessage = function (evt)
    {
        var overflowIndex = evt.data.lastIndexOf("|end|");
        var nextOverflow = evt.data.substr(overflowIndex + 5);
        var thisPacket = overflowPacketData + evt.data.substr(0, overflowIndex);
        overflowPacketData = nextOverflow;


        var packets = thisPacket.split('|end|');

        for (var p = 0; p < packets.length; p++)
        {
            if (packets[p].length < 4)
                continue;

            var parts = packets[p].split(',');

            if (parts[0] === "list")
            {
                TotalSamples = parseInt(parts[1]);
                var sensorList = parts[2].split("\n");

                for (var i = 0; i < sensorList.length; i++)
                {
                    if ($.trim(sensorList[i]) == "")
                        continue;

                    var c = new Chart(i, sensorList[i]);

                    Charts.push(c);
                }
            }
            else
            {
                var id = parseInt(parts[0]);
                Charts[id].Update(parts, 0);
            }
        }
    };

}


Charts = [];
TotalSamples = 500;

window.onload = function ()
{
    startSocket();
};

function roundRect(ctx, x, y, width, height, radius, fill, stroke)
{
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();

    if (stroke)
        ctx.stroke();
    if (fill)
        ctx.fill();
}

function Chart(id, name)
{
    var holderName = "canvas" + id;
    $("#container").append('<canvas id="' + holderName + '" ></canvas>');

    this.canvas = document.getElementById(holderName);
    this.ctx = this.canvas.getContext("2d");

    this.Width = $("#container").width() - 60;
    this.Height = 300;

    this.canvas.width = this.Width;
    this.canvas.height = this.Height;

    this.AreaWidth = 0;
    this.AreaHeight = 0;

    this.Id = id;
    this.Name = name;
    this.UnitName = "Usage";
    this.PostFix = "";

    this.DataX = [];
    this.SensorNames = [];

    this.marginTop = 55;
    this.marginBottom = 40;
    this.marginLeft = 50;
    this.marginRight = 230;

    this.DeltaX = 0;
    this.DeltaY = 0;

    this.Max = 100;
    this.Min = 0;

    this.SensorCount = 0;
    this.DataCount = 0;

    this.IsOverlapping = false;
    this.IsFlipping = false;
    this.IsFlippingBack = false;
    this.FlipRotation = 0;
    this.flipTimer = null;
    this.flipCanvas = null;


    var instance = this;


    this.canvas.onclick = function ()
    {
        instance.StartFlip();
    };

    this.StartFlip = function()
    {
        this.IsFlipping = true;
        this.FlipRotation = 0;
        this.IsFlippingBack = false;

        if (this.flipTimer != null)
            window.clearInterval(this.flipTimer)

        this.flipCanvas = renderToCanvas(this.Width, this.Height, function (ctx)
        {
            var tempctx = instance.ctx;
            instance.ctx = ctx;
            instance.DrawGraph();
            instance.ctx = tempctx;
        });

        this.flipTimer = setInterval(instance.OnFlipTick, 20);
    }

    this.DrawGraph = function ()
    {
        this.DrawGrid();

        if (this.IsOverlapping) this.DrawOverlapping();
        else this.DrawStacked();

        this.DrawLabels();
        this.DrawOverlayGrid();
    }

    this.OnFlipTick = function ()
    {
        instance.Draw();
    }

    var renderToCanvas = function (width, height, renderFunction)
    {
        var buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;
        renderFunction(buffer.getContext('2d'));
        return buffer;
    };


    this.Update = function (raw, pos)
    {
        if (raw.length < 5)
            return;

        this.SensorCount = parseInt(raw[1 + pos]);
        var valuesCount = parseInt(raw[2 + pos]);
        this.Max = parseFloat(raw[3 + pos]);
        this.PostFix = raw[4 + pos];

        var i = 5 + pos;

        this.SensorNames = [];
        for (var q = 0; q < this.SensorCount; q++) {
            this.SensorNames.push(raw[i]);
            i++;
        }


        var newArrays = [];


        for (var y = 0; y < this.SensorCount; y++)
        {
            newArrays.push([]);

            for (var x = 0; x < valuesCount; x++)
                newArrays[y].push(parseFloat(raw[i++]));
        }

        for (var x = 0; x < valuesCount; x++)
        {
            var total = 0;
            var newColumn = [];

            for (var y = 0; y < this.SensorCount; y++)
            {
                total += newArrays[y][x];
                newColumn.push(total);
            }

            this.DataX.push(newColumn);
        }



        for (; this.DataX.length > TotalSamples;)
        {
            this.DataX.splice(0, 1);
        }


        this.DataCount = this.DataX.length;
        this.DeltaX = (this.Width - (this.marginLeft + this.marginRight)) / (TotalSamples - 1);
        this.DeltaY = ((this.Height - (this.marginTop + this.marginBottom)) / this.Max) - 0.005;

        this.AreaWidth = this.Width - (this.marginLeft + this.marginRight);
        this.AreaHeight = this.Height - (this.marginTop + this.marginBottom);

        this.Draw();
    };


    this.Draw = function()
    {
        this.ctx.clearRect(0, 0, this.Width, this.Height);

        if (this.IsFlipping)
        {
            this.ctx.save();

            if (this.IsFlippingBack)
                this.FlipRotation--;
            else
                this.FlipRotation++;

            this.ctx.globalAlpha = 1 / this.FlipRotation;

            this.ctx.drawImage(this.flipCanvas, 0, 0);
            this.ctx.globalAlpha = 1;

            if (this.IsFlippingBack == false && this.FlipRotation > 10)
            {
                this.IsFlippingBack = true;
                this.IsOverlapping = !this.IsOverlapping;

                this.flipCanvas = renderToCanvas(this.Width, this.Height, function (ctx)
                {
                    var tempctx = instance.ctx;
                    instance.ctx = ctx;
                    instance.DrawGraph();
                    instance.ctx = tempctx;
                });
            }
            else if (this.IsFlippingBack == true && this.FlipRotation <= 0)
            {
                this.FlipRotation = 0;
                this.IsFlipping = false;
                window.clearInterval(this.flipTimer);

                this.ctx.clearRect(0, 0, this.Width, this.Height);
                this.DrawGraph();
            }
        }
        else
        {
            this.DrawGraph();
        }
    }

    this.DrawGrid = function ()
    {
        var rows = 6;
        var rowHeight = this.AreaHeight / 5;

        this.ctx.beginPath();

        var y = this.marginTop;

        for (var i = 0; i < rows; i++)
        {
            this.ctx.moveTo(this.marginLeft + 0.5, Math.round(y) + 0.5);
            this.ctx.lineTo(this.marginLeft + this.AreaWidth - 0.5, Math.round(y) + 0.5);

            y += rowHeight;
        }

        this.ctx.lineCap = 'square';
        this.ctx.strokeStyle = "rgb(20,20,20)";
        this.ctx.stroke();
    };

    this.DrawOverlayGrid = function ()
    {
        this.ctx.beginPath();

        this.ctx.moveTo(this.marginLeft - 0.5, this.marginTop);
        this.ctx.lineTo(this.marginLeft - 0.5, this.AreaHeight + this.marginTop);

        this.ctx.moveTo(this.marginLeft + this.AreaWidth - 0.5, this.marginTop);
        this.ctx.lineTo(this.marginLeft + this.AreaWidth - 0.5, this.AreaHeight + this.marginTop);

        this.ctx.lineCap = 'square';
        this.ctx.strokeStyle = "rgb(20,20,20)";
        this.ctx.stroke();
    };


    this.DrawOverlapping = function ()
    {
        var startX = Math.floor(this.marginLeft + this.AreaWidth) - ((this.DataCount - 1) * this.DeltaX);

        var totals = [];

        for (var x = 0; x < this.DataX.length; x++)
            totals.push(0);


        for (var currentSensor = 0; currentSensor < this.SensorCount; currentSensor++)
        {
            this.ctx.beginPath();

            this.ctx.moveTo(startX, this.Height - this.marginBottom);
            this.ctx.lineTo(startX, (this.Height - this.marginBottom) - this.DeltaY * this.DataX[0][currentSensor] - totals[i]);

            for (var i = 0; i < this.DataCount; i++)
            {
                var y = (this.Height - this.marginBottom) - (this.DeltaY * (this.DataX[i][currentSensor] - totals[i]));
                var x = startX + this.DeltaX * i;

                totals[i] = this.DataX[i][currentSensor];

                x = Math.floor(x) - 0.5;
                y = Math.floor(y) + 0.5;

                this.ctx.lineTo(x, y);
            }

            this.ctx.lineTo(this.marginLeft + this.AreaWidth, this.Height - this.marginBottom);
            this.ctx.lineTo(startX, this.Height - this.marginBottom);

            this.ctx.lineCap = 'round';
            this.ctx.lineWidth = 1;

            this.ctx.strokeStyle = "hsla(" + ((currentSensor * 25 + this.Id * 70 + 50) % 360) + ", 60%, 50%, 1)";
            this.ctx.fillStyle = "hsla(" + ((currentSensor * 25 + this.Id * 70 + 50) % 360) + ", 60%, 50%, 0.2)";

            this.ctx.stroke();
            this.ctx.fill();
        }
    }

    this.DrawStacked = function ()
    {
        var startX = (this.marginLeft + this.AreaWidth) - ((this.DataCount - 1) * this.DeltaX);

        for (var currentSensor = 0; currentSensor < this.SensorCount; currentSensor++)
        {
            this.ctx.beginPath();

            this.ctx.moveTo(startX, (this.Height - this.marginBottom) - this.DeltaY * this.DataX[0][currentSensor]);


            for (var i = 0; i < this.DataCount; i++)
            {
                var y = (this.Height - this.marginBottom) - (this.DeltaY * this.DataX[i][currentSensor]);
                var x = startX + this.DeltaX * i;

                x = Math.floor(x) - 0.5;
                y = Math.floor(y) + 0.5;

                this.ctx.lineTo(x, y);
            }
            if (currentSensor > 0)
            {
                for (var i = this.DataCount - 1; i >= 0; i--)
                {
                    var y = (this.Height - this.marginBottom) - (this.DeltaY * this.DataX[i][currentSensor - 1]);
                    var x = startX + this.DeltaX * i;

                    x = Math.round(x) - 0.5;
                    y = Math.round(y) + 0.5;

                    this.ctx.lineTo(x, y);
                }
            }
            else
            {
                this.ctx.lineTo(this.marginLeft + this.AreaWidth, this.Height - this.marginBottom);
                this.ctx.lineTo(startX, this.Height - this.marginBottom);
            }

            this.ctx.lineCap = 'round';
            this.ctx.lineWidth = 1;

            this.ctx.strokeStyle = "hsla(" + ((currentSensor * 25 + this.Id * 70 + 50) % 360) + ", 60%, 30%, 1)";
            this.ctx.fillStyle = "hsla(" + ((currentSensor * 25 + this.Id * 70 + 50) % 360) + ", 60%, 50%, 0.5)";

            this.ctx.stroke();
            this.ctx.fill();
        }

    };

    this.DrawLabels = function ()
    {
        this.ctx.font = '16px Helvetica, Arial';
        this.ctx.fillStyle = "rgb(30,30,30)"
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.Name, this.Width / 2, 30);
        this.ctx.textAlign = "left";

        var lastValue = 0;

        for (var i = 0; i < this.SensorNames.length; i++) {
            var x = this.Width - this.marginRight + 20;
            var y = 30 + (this.SensorNames.length - i) * 15;

            var value = this.DataX[this.DataCount - 1][i] - lastValue;
            lastValue = this.DataX[this.DataCount - 1][i];

			this.ctx.font =  '12px Helvetica, Arial';
			this.ctx.fillStyle = "rgb(30,30,30)"
			this.ctx.fillText(this.SensorNames[i] + ": " + (Math.round(value * 10) / 10) + " " + this.PostFix, x + 20, y);


			this.ctx.fillStyle = "hsla(" + ((i * 25 + this.Id * 70 + 50) % 360) + ", 60%, 50%, 0.9)";
			this.ctx.strokeStyle = "rgb(30, 30, 30)"
			roundRect(this.ctx, x + 0.5, y - 8.5, 10, 10, 3, true, true);
			
		}
		this.ctx.fillStyle = "rgb(30, 30, 30)"

        var spacing = this.AreaWidth / 5;

        for (var i = 0; i < 5; i++)
        {
            var time = Math.round(Math.round((TotalSamples / 2) / (i+1)));
			this.ctx.fillText((time + " sec."),Math.floor(i * spacing + this.marginLeft), this.AreaHeight + this.marginTop + 15);
        }
    };


}