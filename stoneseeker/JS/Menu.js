

function MenuScreen() 
{
    this.video = document.getElementById('videoPlayer');

    this.SkipImage = new Image();
    this.SkipImage.src = "Pics/skip.png";

    this.SkipText = new Image();
    this.SkipText.src = "Pics/skiptext.png";


    this.Update = function () { }

    this.Draw = function () 
    {
        if (this.video.ended)
        {
            CurrentScreen = MyGameScreen;
            return;
        }

        context.drawImage(this.video, 0, 0, 800, 500);


        if (this.SkipText.width > 0)
        {
            if (mouseLeftDown)
            {
                CurrentScreen = MyGameScreen;
                return;
            }

            if (mouseX > totalWidth - this.SkipText.width && mouseY > totalHeight - this.SkipText.height && mouseX < totalWidth && mouseY < totalHeight)
                context.globalAlpha = 1;
            else
                context.globalAlpha = 0.5;
            
            context.drawImage(this.SkipText, totalWidth - this.SkipText.width, totalHeight - this.SkipText.height);
            context.globalAlpha = 1;
        }
    }

}