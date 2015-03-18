

PlayerPad = new Pad(true);
OpponentPad = new Pad(false);


function start()
{
	
	ScoreboardName = "facebook";
	
	AddScore(0, "Jeremi Stadler:password");
	
	DownloadScores();
	
}

function ScoresDownloaded(scoreText)
{
	alert(scoreText);
}


function Pad(isLocal) 
{
    this.Location = 0;
    this.IsLocalPlayer = isLocal;


    PadWidth = 20;
    PadHeight = 60;

    this.UpdateAndDraw = function () 
    {


        context2D.fillStyle = "rgba(10, 10, 10, 0.3)";
        context2D.strokeStyle = strokeColor
        context2D.lineWidth = stroke;
        context2D.fillText(text, x, y);
        context2D.strokeText(text, x, y);

        context2D.fillStyle = color;
        context2D.fillRect(x, y, width, height);

    }
}




function update()
{

}