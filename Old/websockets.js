var noSupportMessage = "Your browser don't support WebSocket!";
var ws;

var DisplayedScoreError = false;
var MyWebsocket = null;

ScoreboardName = "None";
ScoreboardFetchCount = 10;

function ScoresDownloaded(scoreText) { }

function LoadMyWebsocket()
{
    if (MyWebsocket != null)
        return !DisplayedScoreError;

    var WebsocketName = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);

    if (WebsocketName == null)
    {
        if (DisplayedScoreError == false)
        {
            alert(noSupportMessage);
            DisplayedScoreError = true;
        }

        return false;
    }

    MyWebsocket = new window[WebsocketName]('ws://codeyeti.net:4000/' + ScoreboardName);

    return true;
}



function DownloadScores()
{
    if (LoadMyWebsocket() == false)
        return;

    MyWebsocket.onmessage = function (evt)
    {
        ScoresDownloaded(evt.data);
    };

    MyWebsocket.onopen = function ()
    {
        MyWebsocket.send("retrive " + ScoreboardFetchCount);
    };
}


function AddScore(score, name)
{
    MyNewSendScore = score;
    MyNewSendName = name;

    if (LoadMyWebsocket() == false)
        return;

    MyWebsocket.onopen = function ()
    {
        MyWebsocket.send("add " + MyNewSendScore + " " + MyNewSendName);
    };

    
}
