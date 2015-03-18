// Jeremi Stadler 2012


/**
 * @constructor
 */
function MapRenderer(mapName)
{
    this.SheetImage = new Image();
    this.SheetImage.src = mapName + ".png";

    this.Loaded = false;

    this.Textures = [];

    this.TileGround = [];
    this.TileOver = [];
    this.TileHitbox = [];
    this.TileSpawn = [];
    this.TileChest = [];
    this.TileBridge = [];
    this.TileBridgeHitbox = [];
    this.TileOnTop = [];

    this.TileOpenBridges = [];


    this.OverlayIndex = 0;
    LoadedMap = this;


    this.Load = function (rawData)
    {
        var values = rawData.split(',');
        var textureCount = parseInt(values[0], 10);
        var index = 1;


        for (var i = 0; i < textureCount; i++)
        {
            var tex = new SpriteTexture();
            var parts = values[index].split(' ');

            tex.Id = i;
            tex.X = parseInt(parts[1]);
            tex.Y = parseInt(parts[2]);
            tex.Width = parseInt(parts[3]);
            tex.Height = parseInt(parts[4]);

            this.Textures.push(tex);
            index++;
        }

        while (index < values.length - 1)
        {
            var layerName = values[index];
            index++;

            var tilesCount = parseInt(values[index], 10);
            index++;

            var tiles = [];
            var isTexture = false;

            if (layerName == "ground" ||
                layerName == "overlay" ||
                layerName == "bridge" ||
                layerName == "chest" ||
                layerName == "alwaysontop")
                isTexture = true;

            for (var i = 0; i < tilesCount; i++)
            {
                var tileName = values[index];
                index++;

                var parts = values[index].split(' ');
                index++;

                if (isTexture)
                {
                    var tile = new SpriteTile();

                    tile.X = parseInt(parts[0], 10);
                    tile.Y = parseInt(parts[1], 10);

                    tile.TextureIndex = parseInt(parts[2], 10);
                    tile.Texture = this.Textures[tile.TextureIndex];

                    tile.Name = tileName;

                    tiles.push(tile);
                }
                else
                {
                    var tile = new BoundingBox();

                    tile.X = parseInt(parts[0], 10);
                    tile.Y = parseInt(parts[1], 10);

                    tile.Width = parseInt(parts[2], 10);
                    tile.Height = parseInt(parts[3], 10);

                    tile.Name = tileName;

                    tiles.push(tile);
                }
            }


            if (layerName == "ground")
                tiles.forEach(function (tile) { LoadedMap.TileGround.push(tile) });

            else if (layerName == "hitbox")
                tiles.forEach(function (tile) { LoadedMap.TileHitbox.push(tile) });

            else if (layerName == "overlay")
                tiles.forEach(function (tile) { LoadedMap.TileOver.push(tile) });

            else if (layerName == "spawn")
                tiles.forEach(function (tile) { LoadedMap.TileSpawn.push(tile) });

            else if (layerName == "chest")
                tiles.forEach(function (tile) { LoadedMap.TileChest.push(tile) });

            else if (layerName == "bridge")
                tiles.forEach(function (tile) { LoadedMap.TileBridge.push(tile) });

            else if (layerName == "bridgehitbox")
            {
                tiles.forEach(function (tile) { LoadedMap.TileBridgeHitbox.push(tile) });
                tiles.forEach(function (tile) { LoadedMap.TileHitbox.push(tile) });
            }

            else if (layerName == "alwaysontop")
                tiles.forEach(function (tile) { LoadedMap.TileOnTop.push(tile) });

            else
                alert("Unknown layer: " + layerName);
        }
       


        this.TileOver.sort(function (a, b) { return a.Y - b.Y });

        this.Loaded = true;
    }


    this.MapDownloaded = function ()
    {
        if (this.readyState != 4)
            return;

        if (this.status == 0)
        {
            window.location = "http://boxgame.codeyeti.net/";
            return;
        }

        if (this.status != 200)
        {
            alert("Something went wrong while loading the map: could not find the map error " + this.status);
        }

        LoadedMap.Load(this.responseText);
    }


    this.DrawGround = function()
    {
        if (!this.Loaded)
            return;

        DebugText.push("MapTile 0 Screen Pos X: " + Cam.ToScreenX(this.TileGround[0].X));
        DebugText.push("MapTile 0 Screen Pos Y: " + Cam.ToScreenY(this.TileGround[0].Y));

        for (var i = 0; i < this.TileGround.length; i++)
        {
            var tex = this.TileGround[i].Texture;

            context.drawImage(
                this.SheetImage,

                tex.X,
                tex.Y,

                tex.Width,
                tex.Height,

                Cam.ToScreenX(this.TileGround[i].X),
                Cam.ToScreenY(this.TileGround[i].Y),

                tex.Width,
                tex.Height);
        }
    }

    this.DrawUnderlay = function ()
    {
        if (!this.Loaded)
            return;


        for (var i = 0; i < this.TileChest.length; i++)
        {
            var tex = this.TileChest[i].Texture;

            context.drawImage(
                this.SheetImage,

                tex.X,
                tex.Y,

                tex.Width,
                tex.Height,

                Cam.ToScreenX(this.TileChest[i].X),
                Cam.ToScreenY(this.TileChest[i].Y),

                tex.Width,
                tex.Height);
        }

        for (var i = 0; i < this.TileOpenBridges.length; i++)
        {
            var tex = this.TileOpenBridges[i].Texture;

            context.drawImage(
                this.SheetImage,

                tex.X,
                tex.Y,

                tex.Width,
                tex.Height,

                Cam.ToScreenX(this.TileOpenBridges[i].X),
                Cam.ToScreenY(this.TileOpenBridges[i].Y),

                tex.Width,
                tex.Height);
        }


        var characterBottom = CharacterY + Game.Character.TileHeight;

        for (var i = 0; i < this.TileOver.length; i++)
        {
            var tex = this.TileOver[i].Texture;

            if (characterBottom < this.TileOver[i].Y + tex.Height)
            {
                this.OverlayIndex = i;
                return;
            }

            context.drawImage(
                this.SheetImage,

                tex.X,
                tex.Y,

                tex.Width,
                tex.Height,

                Cam.ToScreenX(this.TileOver[i].X),
                Cam.ToScreenY(this.TileOver[i].Y),

                tex.Width,
                tex.Height);
        }
    }

    this.DrawOverlay = function()
    {
        if (!this.Loaded)
            return;

        for (var i = this.OverlayIndex; i < this.TileOver.length; i++)
        {
            var tex = this.TileOver[i].Texture;

            context.drawImage(
                this.SheetImage,

                tex.X,
                tex.Y,

                tex.Width,
                tex.Height,

                Cam.ToScreenX(this.TileOver[i].X),
                Cam.ToScreenY(this.TileOver[i].Y),

                tex.Width,
                tex.Height);
        }

        for (var i = 0; i < this.TileOnTop.length; i++)
        {
            var tex = this.TileOnTop[i].Texture;

            context.drawImage(
                this.SheetImage,

                tex.X,
                tex.Y,

                tex.Width,
                tex.Height,

                Cam.ToScreenX(this.TileOnTop[i].X),
                Cam.ToScreenY(this.TileOnTop[i].Y),

                tex.Width,
                tex.Height);
        }

    }

    this.DrawBoundingBoxes = function ()
    {
        if (!this.Loaded)
            return;

        context.fillStyle = "rgba(10, 10, 10, 0.1)";
        context.strokeStyle = "rgba(10, 10, 10, 0.6)";

        for (var i = 0; i < this.TileHitbox.length; i++)
        {
            context.fillRect(
                Cam.ToScreenX(this.TileHitbox[i].X),
                Cam.ToScreenY(this.TileHitbox[i].Y),

                this.TileHitbox[i].Width,
                this.TileHitbox[i].Height);

        }


        for (var i = 0; i < this.TileHitbox.length; i++)
        {
            context.strokeRect(
                Cam.ToScreenX(this.TileHitbox[i].X),
                Cam.ToScreenY(this.TileHitbox[i].Y),

                this.TileHitbox[i].Width,
                this.TileHitbox[i].Height);

        }
    }



    var client = new XMLHttpRequest();
    client.onreadystatechange = this.MapDownloaded;
    client.open('GET', mapName + '.txt');
    client.send();

    /**
 * @constructor
 */
    function SpriteTexture()
    {
        this.X = 0;
        this.Y = 0;

        this.Width = 0;
        this.Height = 0;

        this.Id = 0;
    }
    /**
 * @constructor
 */
    function SpriteTile()
    {
        this.X = 0;
        this.Y = 0;

        this.Texture = null;
        this.TextureIndex = 0;

        this.Name = "";
    }

    /**
 * @constructor
 */
    function BoundingBox()
    {
        this.X = 0;
        this.Y = 0;

        this.Width = 0;
        this.Height = 0;

        this.Name = "";
    }
}