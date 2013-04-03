function Tile(map, xIndex, yIndex, index) {
	this.map = map;
	this.spriteIndex = index;
	this.hover = false;
	this.xIndex = xIndex;
	this.yIndex = yIndex;
	this.x = xIndex*map.tileSize;
	this.y = yIndex*map.tileSize;
	this.toDraw = true;
	this.item = null;
	this.solid = index > 2;
	this.entities = [];
	this.solidIndex = 0;
	this.checkSolid = true;
	this.buildingHover = false;
	this.hoverTile = null;
	this.building = null;
}

Tile.prototype.setType = function(index) {
	this.spriteIndex = index;
	this.solid = index > 2;
}

Tile.prototype.setHoverTile = function(index) {
	this.hoverTile = {};
	this.hoverTile.spriteIndex = index;
	this.hoverTile.solid = index > 2;
	this.hoverTile.toDraw = true;
	this.hoverTile.solidIndex = 0;
}

Tile.prototype.setToDraw = function() {
	this.toDraw = true;

	if(this.xIndex < 19)
		this.map.getTileByIndex(this.xIndex+1, this.yIndex).toDraw = true;
	if(this.yIndex > 0)
		this.map.getTileByIndex(this.xIndex, this.yIndex-1).toDraw = true;
	if(this.yIndex < 19)
		this.map.getTileByIndex(this.xIndex, this.yIndex+1).toDraw = true;
	if(this.xIndex < 19 && this.yIndex < 19)
		this.map.getTileByIndex(this.xIndex+1, this.yIndex+1).toDraw = true;
}

Tile.prototype.getFriendlyEntity = function(colony) {
	//if there is a friendly entity at this tile, return it

	for(var i = 0; i < this.entities.length; i++) {
		//if (this.entities[i].username != "enemy" && this.entities[i].spriteBase != "ant_green")
		if(this.entities[i].colony == colony) {
			return this.entities[i];
		}
	}

	return undefined; 
}

Tile.prototype.getEnemyEntity = function(colony) {
	//if there is a friendly entity at this tile, return it

	for(var i = 0; i < this.entities.length; i++) {
		if(this.entities[i].colony != colony) {
			return this.entities[i];
		}
	}

	return undefined; 
}

Tile.prototype.checkForSolidChange = function() {
	var N = this.map.getTileByIndex(this.xIndex, this.yIndex-1);
	var E = this.map.getTileByIndex(this.xIndex+1, this.yIndex);
	var S = this.map.getTileByIndex(this.xIndex, this.yIndex+1);
	var W = this.map.getTileByIndex(this.xIndex-1, this.yIndex);

	var _N = !N.solid << 3;
	var _W = !W.solid << 2;
	var _S = !S.solid << 1;
	var _E = !E.solid;

	var solidIndex = _N | _E | _S | _W;

	if(this.solidIndex != solidIndex)
		this.toDraw = true;
	this.solidIndex = solidIndex;
	this.checkSolid = false;
}

Tile.prototype.checkForSolidChangeOfHover = function() {
	var N = this.map.getTileByIndex(this.xIndex, this.yIndex-1);
	var E = this.map.getTileByIndex(this.xIndex+1, this.yIndex);
	var S = this.map.getTileByIndex(this.xIndex, this.yIndex+1);
	var W = this.map.getTileByIndex(this.xIndex-1, this.yIndex);

	var _N = ((N.hoverTile) ? !N.hoverTile.solid : !N.solid) << 3;
	var _W = ((W.hoverTile) ? !W.hoverTile.solid : !W.solid) << 2;
	var _S = ((S.hoverTile) ? !S.hoverTile.solid : !S.solid) << 1;
	var _E = ((E.hoverTile) ? !E.hoverTile.solid : !E.solid);

	var solidIndex = _N | _E | _S | _W;

	if(this.hoverTile.solidIndex != solidIndex)
		this.hoverTile.toDraw = true;
	this.hoverTile.solidIndex = solidIndex;
}

Tile.prototype.update = function() {
	this.entities = [];

	if(!this.buildingHover && this.hoverTile) {
		this.hoverTile = null;
		this.toDraw = true;
	}

	if(this.checkSolid) {
		this.checkForSolidChange();
	}

	if(this.item) {
		this.item.update();
	}
	this.buildingHover = false;
}

Tile.prototype.draw = function(ctx) {
	if(this.toDraw || (this.hoverTile && this.hoverTile.toDraw)) {
		this.toDraw = false;
		if(this.hoverTile)
			this.hoverTile.toDraw = false;
		this.map.numOfTilesToDraw++;
		var _spriteIndex = this.spriteIndex;
		var _solidIndex = this.solidIndex;
		if(this.hoverTile) {
			_spriteIndex = this.hoverTile.spriteIndex;
			_solidIndex = this.hoverTile.solidIndex;
		}

		if(_spriteIndex == 3) {
			ctx.drawImage(ASSET_MANAGER.getAsset('img/dirt_walls.png'),
			                  _solidIndex*32, 0,  // source from sheet
			                  32, 32,
			                  this.x, this.y,
			                  32, 32);
		}
		else
			ctx.drawImage(this.map.sprites[_spriteIndex], this.x, this.y);

		if(this.item)
			this.item.draw(ctx);
	}
}

//***********************************************************************
function Building(map, type) {
	this.map = map;
	this.type = type;
	this.tiles = [];
	this.hover = false;
	this.xLow =  10000;
	this.xHigh = -10000;
	this.yLow =  10000;
	this.yHigh = -10000;
}

Building.prototype.addTile = function(tile) {
	this.tiles.push(tile);
	if(tile.x < this.xLow)
		this.xLow = tile.x;
	if(tile.x+this.map.tileSize > this.xHigh)
		this.xHigh = tile.x+this.map.tileSize;
	if(tile.y < this.yLow)
		this.yLow = tile.y;
	if(tile.y+this.map.tileSize > this.yHigh)
		this.yHigh = tile.y+this.map.tileSize;
}

Building.prototype.draw = function(ctx) {
	if(this.hover) {
		this.hover = false;

		ctx.translate(0.5, 0.5);
		ctx.strokeRect(this.xLow, this.yLow, (this.xHigh-this.xLow), (this.yHigh-this.yLow));
		ctx.translate(-0.5, -0.5);
	}
}
//***********************************************************************

function Entrance(x, y, tile, map, sprite) {
	this.x = x;
	this.y = y;
	this.tile = tile;
	this.map = map;
	this.sprite = sprite || 0;
	this.otherSide = null;
}

Entrance.prototype.linkEntrance = function(other) {
	this.otherSide = other;
	other.otherSide = this;
}

//********************************************************************
function Map(game, type) {
	this.game = game;
	this.type = type;
	this.tiles = [];
	this.sprites = [];
	this.sprites[1] = ASSET_MANAGER.getAsset('img/grass.png');
	this.sprites[2] = ASSET_MANAGER.getAsset('img/dirt.png');
	this.sprites[3] = ASSET_MANAGER.getAsset('img/dirt_wall.png');
	this.sprites[4] = ASSET_MANAGER.getAsset('img/dirt_solid.png');
	this.sprites[5] = ASSET_MANAGER.getAsset('img/rock.png');
	this.sprites[6] = ASSET_MANAGER.getAsset('img/food_1.png');
	this.sprites[7] = ASSET_MANAGER.getAsset('img/food_2.png');
	this.sprites[8] = ASSET_MANAGER.getAsset('img/food_3.png');
	this.sprites[9] = ASSET_MANAGER.getAsset('img/food_4.png');
	this.setBuldingOutlineState = null;
	this.clicked = false;
	this.tileSize = 32;
	this.numOfTiles = 20;
	this.entrances = [];
	this.buildings = [];

	this.numOfTilesToDraw = 0;

	this.init();
}

Map.prototype.init = function() {
	//create the arrays for the tiles and set them to be grass (index 1)
	for(var x = 0; x < this.numOfTiles; x++) {
		this.tiles[x] = [];
		for(var y = 0; y < this.numOfTiles; y++) {
			this.tiles[x][y] = new Tile(this, x, y, this.type);
			if(Math.floor(Math.random()*10) == 0 && this.type == 1)
				this.tiles[x][y].item = new Item(this.game, this.tiles[x][y].x, this.tiles[x][y].y, "rock", 5, true, false, this);
			if(this.type == 2)
				this.tiles[x][y].setType(4);
		}
	}
}

Map.prototype.setEntrance = function(x, y, tile, map, sprite) {
	var entrance = new Entrance(x, y, tile, map, sprite);
	this.entrances.push(entrance);
	return entrance;
}

Map.prototype.setBuldingOutline = function() {
	var tile = this.setBuldingOutlineState.tile;
	var building = this.setBuldingOutlineState.building;
	//for each tile in the building array create a temp hoverTile to draw instead
	for(var x = 0; x < building[0].length; x++)
	for(var y = 0; y < building.length; y++) {
		var _tile = this.getTileByIndex(x+tile.xIndex, y+tile.yIndex);
		if(_tile && _tile.spriteIndex != 2) {
			if(!_tile.hoverTile || (_tile.hoverTile && _tile.hoverTile.spriteIndex != building[x][y])) {
				_tile.setHoverTile(building[x][y]);
			}
			_tile.buildingHover = true;
		}
	}

	//if the hoverTile is a wall, then check for the solidIndex
	for(var x = 0; x < building[0].length; x++)
	for(var y = 0; y < building.length; y++) {
		var _tile = this.getTileByIndex(x+tile.xIndex, y+tile.yIndex);
		if(_tile && _tile.hoverTile && _tile.hoverTile.spriteIndex == 3)
			_tile.checkForSolidChangeOfHover();
	}
}

Map.prototype.setBuilding = function() {
	var tile = this.setBuldingOutlineState.tile;
	var building = this.setBuldingOutlineState.building;
	var _building = new Building(this, this.setBuldingOutlineState.type);
	this.buildings.push(_building);
	for(var x = 0; x < building[0].length; x++)
	for(var y = 0; y < building.length; y++) {
		var _tile = this.getTileByIndex(x+tile.xIndex, y+tile.yIndex);
		if(_tile && _tile.hoverTile) {
			this.game.addEntity(new Particle(this.game, _tile.x, _tile.y, this, 1));
			_tile.spriteIndex = _tile.hoverTile.spriteIndex;
			_tile.solidIndex = _tile.hoverTile.solidIndex;
			_tile.solid = _tile.hoverTile.solid;
			_tile.building = _building;
			_building.addTile(_tile);
		}
	}
	this.setBuldingOutlineState = null;

	for(var x = 2; x < building[0].length-2; x++)
	for(var y = 2; y < building.length-2; y++) {
		var _tile = this.getTileByIndex(x+tile.xIndex, y+tile.yIndex);
		this.game.addEntity(new Egg(this.game, _tile.x, _tile.y, this, 2000));
	}

	//this.game.addEntity(new Particle(this.game, tile.x, tile.y, this, 1));
}

Map.prototype.checkSolidTiles = function() {
	for(var x = 0; x < this.numOfTiles; x++)
	for(var y = 0; y < this.numOfTiles; y++) {
		this.tiles[x][y].checkForSolidChange();
	}
}

Map.prototype.checkIfOnEntrance = function(entity, tile) {
	for(var i = 0; i < this.entrances.length; i++) {
		var _entrance = this.entrances[i];
		if(tile == _entrance.tile) {
			this.game.map = _entrance.map;
			entity.setTile(_entrance.otherSide.tile);//_entrance.map.getTileByIndex(_entrance.xOut, _entrance.yOut));
			entity.map = _entrance.map;
			_entrance.map.setAllToDraw();
		}
	}
}

Map.prototype.getTileAtLocation = function(x, y) {
	//if the x and y are within range of the map, then return the tile that is under the x & y
	if(x >= 0 && x < this.tileSize*this.numOfTiles && y >= 0 && y < this.tileSize*this.numOfTiles) {
		//since tiles are 32 large, then dividing the x & y by 32 will yeild the correct tile number
		var tileX = Math.floor(x/this.tileSize);
		var tileY = Math.floor(y/this.tileSize);
		return this.tiles[tileX][tileY];
	}
	return false;
}

Map.prototype.getTileByIndex = function(x, y) {
	if(x >= 0 && x < this.numOfTiles && y >= 0 && y < this.numOfTiles)
		return this.tiles[x][y];
	return false;
}

Map.prototype.update = function(x, y) {
	//if there is a tile at this location, then set hover to true
	var _tile = this.getTileAtLocation(x, y);
	if(_tile)
		_tile.hover = true;
	if(this.setBuldingOutlineState)
		this.setBuldingOutline();

	for(var x = 0; x < this.numOfTiles; x++)
	for(var y = 0; y < this.numOfTiles; y++) {
		this.tiles[x][y].update();
	}
	for(var i = 0; i < this.game.entities.length; i++) {
		var _entity = this.game.entities[i];
		if(_entity.map == this && _entity.health)
			this.getTileAtLocation(_entity.x, _entity.y).entities.push(_entity);
	}
	this.setBuldingOutlineState = null;
}

Map.prototype.draw = function(ctx, ctx2) {
	//ctx.drawImage(ASSET_MANAGER.getAsset('img/bigone.png'), 0, 0);
	this.numOfTilesToDraw = 0;
	for(var x = 0; x < this.numOfTiles; x++)
	for(var y = 0; y < this.numOfTiles; y++) {
		var _tile = this.tiles[x][y];
		_tile.draw(ctx);
	}
	for(var i = 0; i < this.entrances.length; i++) {
		var _entrance = this.entrances[i];
		if(_entrance.sprite)
			ctx.drawImage(ASSET_MANAGER.getAsset('img/'+_entrance.sprite+'.png'), _entrance.x, _entrance.y);
	}
	for(var x = 0; x < this.numOfTiles; x++)
	for(var y = 0; y < this.numOfTiles; y++) 
		if(this.tiles[x][y].hover) {
			if(this.tiles[x][y].building)
				this.tiles[x][y].building.hover = true;
			ctx.translate(0.5, 0.5);
			ctx.strokeRect(this.tiles[x][y].x, this.tiles[x][y].y, 31, 31);
			ctx.translate(-0.5, -0.5);
			this.tiles[x][y].hover = false;
			this.tiles[x][y].toDraw = true;
		}
	for(var i = 0; i < this.buildings.length; i++) {
		this.buildings[i].draw(ctx2);
	}
}

Map.prototype.setAllToDraw = function() {
	for(var x = 0; x < this.numOfTiles; x++)
	for(var y = 0; y < this.numOfTiles; y++)
		this.tiles[x][y].toDraw = true;
}
