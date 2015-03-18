

function LocalPlayer()
{
	this.Id = 0;

	this.X = 0;
	this.Y = 0;

	this.Speed = 4.0;

	this.VelocityX = 0;
	this.VelocityY = 0;

	this.Size = 10;

	this.Update = function ()
	{
		var velocityX = 0;
		var velocityY = 0;

		if (keyDown(KeyboardKey_Left) || keyDown(KeyboardKey_A))
			velocityX -= this.Speed;

		if (keyDown(KeyboardKey_Down) || keyDown(KeyboardKey_S))
			velocityY += this.Speed;

		if (keyDown(KeyboardKey_Right) || keyDown(KeyboardKey_D))
			velocityX += this.Speed;

		if (keyDown(KeyboardKey_Up) || keyDown(KeyboardKey_W))
			velocityY -= this.Speed;

		if (keyDown(KeyboardKey_Shift))
		{
			velocityY *= 2;
			velocityX *= 2;
		}

		this.VelocityX = velocityX;
		this.VelocityY = velocityY;

		this.X += velocityX;
		this.Y += velocityY;
	}

	this.Draw = function ()
	{
		DrawCube(this.X, this.Y, this.Size);
	}
}
