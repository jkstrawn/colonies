function Colonies() {
    GameEngine.call(this);
}
Colonies.prototype = new GameEngine();
Colonies.prototype.constructor = Colonies;

Colonies.prototype.start = function() {

	this.addGUI(new GuiScreen(this, 640, 0, 'img/gui_main.png'));

	this.aboveGround = new Map(this, 1);
	this.belowGround = new Map(this, 2);
	this.belowGround.setEntrance(0, 0, this.belowGround.getTileByIndex(9,0), this.aboveGround);
	this.map = this.aboveGround;

	for(var y = 0; y <= 4; y++)
	for(var x = 8; x <= 11; x++)
		this.belowGround.tiles[x][y].setType(3);
	for(var y = 0; y <= 3; y++)
	for(var x = 9; x <= 10; x++)
		this.belowGround.tiles[x][y].setType(2);
	
	//add an ant
	var _player = new AntQueen(this, 96, 96, 'temp', 'ant_black', 10, this.map, 'black');
	this.selectEntity(_player);
	this.addEntity(_player);
	
    GameEngine.prototype.start.call(this);
}

Colonies.prototype.update = function() {
    
    GameEngine.prototype.update.call(this);
}

Colonies.prototype.draw = function() {
    GameEngine.prototype.draw.call(this);
}
//*********************************************************************************************************************************************************
function GameEngine() {
    this.entities = [];
	this.GUI = [];
    this.ctx = null;
    this.ctxBG = null;
    this.ctxFG = null;
    this.click = null;
    this.rClick = null;
	this.dblClick = null;
	this.key = [];
	this.keyPress = [];
    this.mouse = null;
	this.mouseTemp = null;
	this.mouseDownEvent = false;
	this.mouseUpEvent = false;
	this.mouseDown = false;
    this.timer = new Timer();
    this.surfaceWidth = null;
    this.surfaceHeight = null;
	this.mouseGui = null;
	this.hotkeys = [];
	this.screenOffsetX = 0;
	this.screenOffsetY = 0;
	this.FPS = 0;
	this.totalTime = 0;
	this.selectedAnt = null;
}

GameEngine.prototype.init = function(ctxBG, ctxFG) {
    console.log('game initialized');
    this.ctx = ctxFG;
    this.ctxBG = ctxBG;
    this.ctxFG = ctxFG;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
	for(var i = 0; i < 4; i++) {
		this.hotkeys[i] = 0;
	}
}

GameEngine.prototype.start = function() {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function() {
    var getXandY = function(e) {
        var x =  e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
        return {x: x, y: y};
    }
    
    var that = this;
    
    this.ctx.canvas.addEventListener("click", function(e) {
        that.click = getXandY(e);
        e.stopPropagation();
        e.preventDefault();
    }, false);

    $("body").on("mousemove", ".texts", function(e) {
		that.mouse = getXandY(e);
	});
/*
    this.ctx.canvas.addEventListener("rightClick", function(e) {
        that.click = getXandY(e);
        e.stopPropagation();
        e.preventDefault();
    }, false);

	$("#mainCanvas").rightClick( function(e) {
		var canvas = document.getElementById('mainCanvas');
		var x = e.pageX - canvas.offsetLeft - 32;
		var y = e.pageY - canvas.offsetTop - 32;
		console.log(x + ", " + y);
		character.setWaypoint(x, y);
    });
*/	
    this.ctx.canvas.addEventListener("mousemove", function(e) {
        that.mouse = getXandY(e);
    }, false);
	
    this.ctx.canvas.addEventListener("mousedown", function(e) {
		that.mouseDownEvent = true;
        that.mouseDown = true;
        that.mouseTemp = that.mouse;
    }, false);	
	
    this.ctx.canvas.addEventListener("mouseup", function(e) {
        that.mouseDown = false;
		that.mouseUpEvent = true;
    }, false);
	
    this.ctx.canvas.addEventListener("dblclick", function(e) {
        //that.dblClick = true;

//*********************************************************************************************************************
        that.dblClick = getXandY(e);
        that.click = null;
        e.stopPropagation();
        e.preventDefault();

        //socket.emit('dblClick', that.dblClick.x, that.dblClick.y);
//***********************************************************************************************************************
    }, false);
	
	document.getElementById("canvasContainer").addEventListener("keydown", function(e) {
		if(that.getKey(e.keyCode) == -1) {
		//if the key is NOT already in the list then add it
			that.key.push(e.keyCode);
		}
    }, false);
	
	document.getElementById("canvasContainer").addEventListener("keyup", function(e) {
		var index = that.getKey(e.keyCode);
		if(index >= 0) {
		//if the key is in the list then remove it
			that.key.splice(index, 1);
		}
		that.keyPress.push(e.keyCode);
    }, false);
}

GameEngine.prototype.rightClick = function(x, y) {
	this.rClick = {x: x, y: y};
}

GameEngine.prototype.setHotkey = function(index, value) {
	this.hotkeys[index] = value;
}

GameEngine.prototype.addItem = function(name, x, y, size) {
	this.itemList.addItem(name, x, y, size);
}

GameEngine.prototype.addEntity = function(entity) {
    this.entities.push(entity);
}

GameEngine.prototype.getKey = function(keyCode) {
	for(var i = 0; i < this.key.length; i++) {
		if(this.key[i] == keyCode) {
			return i;
		}
	}
	return -1;
}

GameEngine.prototype.getKeyPress = function(keyCode) {
	for(var i = 0; i < this.keyPress.length; i++) {
		if(this.keyPress[i] == keyCode) {
			return i;
		}
	}
	return -1;
}

GameEngine.prototype.addGUI = function(element) {
    this.GUI.push(element);
	return this.GUI[this.GUI.length-1];
}

GameEngine.prototype.removeGUI = function(element) {
    for(var i = 0; i < this.GUI.length; i++) {
		if(this.GUI[i] == element) {
			this.GUI.splice(i, 1);
		}
	}
}

GameEngine.prototype.selectEntity = function(entity) {
	if(this.selectedAnt)
		this.selectedAnt.deselect();
	this.selectedAnt = entity;
	this.selectedAnt.select();
}

GameEngine.prototype.getTileAtMouse = function() {
	var _tile = this.map.getTileAtLocation(this.mouse.x, this.mouse.y);
	if(_tile)
		return _tile;
	return false;
}

GameEngine.prototype.draw = function(callback) {
    //this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    //this.ctx.save();
    this.ctxFG.clearRect(0, 0, this.ctxFG.canvas.width, this.ctxFG.canvas.height);

    this.ctx.translate(Math.round(this.screenOffsetX), Math.round(this.screenOffsetY));

    this.map.draw(this.ctxBG, this.ctxFG);
	
	for(var z = 0; z < 3; z++) {
	//Go through the lists 3 times and only draw them if they have the z index
		for (var i = 0; i < this.entities.length; i++) {
			if(this.entities[i].z == z && this.entities[i].map == this.map) {
				this.entities[i].draw(this.ctx, this.ctxFG);
			}
		}
	}
    this.ctx.restore();
	
	for(var z = 0; z < 3; z++) {
		for (var i = 0; i < this.GUI.length; i++) {
			if(this.GUI[i].z == z) {
				this.GUI[i].draw(this.ctxBG, this.ctxFG);
			}
		}
	}
    if (callback) {
        callback(this);
    }
}

GameEngine.prototype.update = function() {
	this.FPS++;
    var entitiesCount = this.entities.length;
    //var selectedEntities = [];
    var selectedEntity;
	var hoverEntity = null;
	var guiClick = false;
	var dt = this.clockTick*1000;
	var screenX = Math.round(this.screenOffsetX);
	var screenY = Math.round(this.screenOffsetY);
	
	this.totalTime += dt;
	if(this.totalTime > 1000) {
		console.log("FPS: " + this.FPS + "  tilesToDraw: " + this.map.numOfTilesToDraw + "  entities: " + this.entities.length);
		this.FPS = 0;
		this.totalTime = 0;
	}
	
	//if a key has been released
	for(var i = 0; i < this.keyPress.length; i++) {
		switch(this.keyPress[i]) {
			case this.hotkeys[0]:
				break;
			case this.hotkeys[1]:
				break;
			case this.hotkeys[2]:
				break;
			case this.hotkeys[3]:
				break;
			case 70:
				var _tile = this.map.getTileAtLocation(Math.floor(Math.random()*625), Math.floor(Math.random()*625));
				_tile.item = new Item(this, _tile.x, _tile.y, "food", 5 + Math.floor(Math.random()*4), false, true, this.map);
				_tile.toDraw = true;
				break;
			case 77:
				var _tile = this.map.getTileAtLocation(Math.floor(Math.random()*625), Math.floor(Math.random()*625));
				var _player = new Player(this, _tile.x, _tile.y, 'enemy', 'ant_red', 10, this.map, 'red');
				this.addEntity(_player);
				break;
		}
	}
	
	//if there are keys being pressed
	for(var i = 0; i < this.key.length; i++) {
	//for each key in the list
		switch(this.key[i]) {
			case this.hotkeys[0]:
				break;
			case this.hotkeys[1]:
				break;
			case this.hotkeys[2]:
				break;
			case this.hotkeys[3]:
				break;
		}
	}


    for(var i = 0; i < entitiesCount; i++) {
	//for each entity update it and (if its a player) check if the mouse is over it
        var _entity = this.entities[i];
        
        if(!_entity.removeFromWorld) {
            _entity.update(dt);
        }
    }

    
    
    //remove any entities that have been flagged to be removed
    for(var i = this.entities.length-1; i >= 0; --i) {
        if(this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }

    //if the game has started then update the map with the mouse coords
    if(this.mouse) {
    	this.aboveGround.update(this.mouse.x-screenX, this.mouse.y-screenY);
    	this.belowGround.update(this.mouse.x-screenX, this.mouse.y-screenY);
    }

	//delete any screens that need to be removed
    for(var i = this.GUI.length-1; i >= 0; --i) {
		var _GUI = this.GUI[i];
        if(_GUI && _GUI.toRemove) {
			_GUI.remove();
			this.removeGUI(_GUI);
        }
    }
	
	//Handle mouse-over and clicking for the GUIs, and updating them
    for(var i = 0; i < this.GUI.length; i++) {
		var _GUI = this.GUI[i];
		if(this.mouseUpEvent) {
			_GUI.mouseUp = true;
		}		
		if(_GUI.isMouseInsideGUI()) {
			_GUI.hover = true;
			if(this.mouseDownEvent) {
				_GUI.mouseDown = true;
			}
			if(this.click) {
				_GUI.clicked = true;
				guiClick = true;
			}
		} else {
			_GUI.hover = false;
		}
		if(_GUI.guiToDrag) {
		//dont click on the world if a bulding is being dragged
			guiClick = true;
		}
        _GUI.update();
    }
	
	//if the mouse has moved while pressing down
	if(this.mouse && this.mouseDown && (this.mouse.x != this.mouseTemp.x || this.mouse.y != this.mouseTemp.y)) {
		var xMove = this.mouseTemp.x - this.mouse.x;
		var yMove = this.mouseTemp.y - this.mouse.y;
		for (var i = 0; i < this.GUI.length; i++) {
			this.GUI[i].mouseDragged(xMove, yMove);
		}
		this.mouseTemp = this.mouse;
	}

	//when the user has clicked in the game
	if(this.click) {
		if(!guiClick) {
		//if the mouse is not clicked on a gui
			var _tile = this.map.getTileAtLocation(this.click.x, this.click.y);
			if(_tile) {
				//See if there is a friendly
				var friendly = _tile.getFriendlyEntity(this.selectedAnt.colony);

				if(friendly) {
					if(this.selectedAnt == friendly)
						this.map.checkIfOnEntrance(this.selectedAnt, _tile);
					//Switch to the friendly entity on the tile
					this.selectEntity(friendly);
				} else {
					if(_tile.building)
						console.log(_tile.building.type);
				}
			}
		}
	}

	//when the user double-clicks
	if(this.dblClick) {
		var _tile = this.map.getTileAtLocation(this.dblClick.x, this.dblClick.y);
		if(this.selectedAnt.currentTile == _tile && this.map == this.aboveGround && (_tile.item == null || _tile.item.solid)) {
		//create belowGround opening
			_tileToDrawOn = this.map.getTileByIndex(_tile.xIndex-1, _tile.yIndex-1);
			var entrance = this.map.setEntrance(_tileToDrawOn.x, _tileToDrawOn.y, _tile, this.belowGround, 'colony_entrance');
			entrance.linkEntrance(this.belowGround.entrances[0]);
		} else if(_tile.item != null && !_tile.item.solid) {
			this.selectedAnt.grabItem(_tile.item);
		}
	}

	//when the user has right clicked
	if(this.rClick) {
		if(!guiClick) {
			var _tile = this.map.getTileAtLocation(this.rClick.x, this.rClick.y);
			if(_tile) {
				this.selectedAnt.setDestinationTile(_tile);
			}
		} else {
			if(this.mouseGui)
				this.mouseGui.toRemove = true;
		}
		
	}
}

GameEngine.prototype.loop = function() {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
    this.click = null;
    this.rClick = null;
	this.dblClick = null;
	this.mouseDownEvent = false;
	this.mouseUpEvent = false;
	this.keyPress = [];
}

//************************************************************************************************************************************************************
function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.lastTime = 0;
}

Timer.prototype.tick = function() {
    var currentTime = Date.now();
    var deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    
    var gameDelta = Math.min(deltaTime, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

//************************************************************************************************************************************************************
function AssetManager() {
    //console.log("test2");
    this.successCount = 0;
    this.errorCount = 0;
    this.cache = {};
    this.downloadQueue = [];
}

AssetManager.prototype.queueDownload = function(path) {
    this.downloadQueue.push(path);
}

AssetManager.prototype.downloadAll = function(callback) {
    if (this.downloadQueue.length === 0) {
        callback();
    }
    
    for (var i = 0; i < this.downloadQueue.length; i++) {
        var path = this.downloadQueue[i];
        var img = new Image();
        var that = this;
        img.addEventListener("load", function() {
            console.log(this.src + ' is loaded');
            that.successCount += 1;
            if (that.isDone()) {
                callback();
            }
        }, false);
        img.addEventListener("error", function() {
            that.errorCount += 1;
            if (that.isDone()) {
                callback();
            }
        }, false);
        img.src = path;
        this.cache[path] = img;
    }
}

AssetManager.prototype.getAsset = function(path) {
    return this.cache[path];
}

AssetManager.prototype.isDone = function() {
    return (this.downloadQueue.length == this.successCount + this.errorCount);
}
/*
AssetManager.prototype.getAssetPortion = function(path, newWidth, newHeight, startX, startY) {
	var imgObj = this.cache[path];
	//set up canvas for thumbnail
	var tnCanvas = document.createElement('canvas');
	var tnCanvasContext = canvas.getContext('2d');
			 
	tnCanvas.width = newWidth;
	tnCanvas.height = newHeight;

	//create buffer canvas
	var bufferCanvas = document.createElement('canvas');
	var bufferContext = bufferCanvas.getContext('2d');
	 
	bufferCanvas.width = imgObj.width;
	bufferCanvas.height = imgObj.height;
	bufferContext.drawImage(imgObj, 0, 0);
			 
	tnCanvasContext.drawImage(bufferCanvas, startX,startY,newWidth, newHeight,0,0,newWidth,newHeight);
	return tnCanvas.toDataURL();   
}
*/

//*********************************************************************************************************************************************************
window.requestAnimFrame = (function() {
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
})();

var canvasFG = document.getElementById('surface');
var canvasBG = document.getElementById('background');
var ctxFG = canvasFG.getContext('2d');
var ctxBG = canvasBG.getContext('2d');
var game = new Colonies();

var ASSET_MANAGER = new AssetManager();

//Entities
ASSET_MANAGER.queueDownload('img/ant_black.png');
ASSET_MANAGER.queueDownload('img/ant_black_princess.png');
ASSET_MANAGER.queueDownload('img/ant_black_queen.png');
ASSET_MANAGER.queueDownload('img/ant_black_soldier.png');
ASSET_MANAGER.queueDownload('img/ant_green.png');
ASSET_MANAGER.queueDownload('img/ant_green_princess.png');
ASSET_MANAGER.queueDownload('img/ant_green_queen.png');
ASSET_MANAGER.queueDownload('img/ant_green_soldier.png');
ASSET_MANAGER.queueDownload('img/ant_red.png');
ASSET_MANAGER.queueDownload('img/ant_red_princess.png');
ASSET_MANAGER.queueDownload('img/ant_red_queen.png');
ASSET_MANAGER.queueDownload('img/ant_red_soldier.png');
ASSET_MANAGER.queueDownload('img/ant_egg.png');
ASSET_MANAGER.queueDownload('img/larvae.png');
ASSET_MANAGER.queueDownload('img/ant_black_big.png');
ASSET_MANAGER.queueDownload('img/ant_black_big_walk.png');
ASSET_MANAGER.queueDownload('img/ant_black_walk.png');
ASSET_MANAGER.queueDownload('img/ant_green_walk.png');

//Terrain
ASSET_MANAGER.queueDownload('img/dirt.png');
ASSET_MANAGER.queueDownload('img/dirt_wall.png');
ASSET_MANAGER.queueDownload('img/dirt_walls.png');
ASSET_MANAGER.queueDownload('img/dirt_solid.png');
ASSET_MANAGER.queueDownload('img/grass.png');
ASSET_MANAGER.queueDownload('img/colony_entrance.png');

//Items
ASSET_MANAGER.queueDownload('img/rock.png');
ASSET_MANAGER.queueDownload('img/food_1.png');
ASSET_MANAGER.queueDownload('img/food_2.png');
ASSET_MANAGER.queueDownload('img/food_3.png');
ASSET_MANAGER.queueDownload('img/food_4.png');

//GUI
ASSET_MANAGER.queueDownload('img/gui_main.png');
ASSET_MANAGER.queueDownload('img/button_nursery.png');
ASSET_MANAGER.queueDownload('img/smoke_tan.png');

$(document).ready( function() {
	$("#surface").rightClick( function(e) {
		var x = e.pageX - canvasFG.offsetLeft;
		var y = e.pageY - canvasFG.offsetTop;
		game.rightClick(x, y);
    });
});

ASSET_MANAGER.downloadAll(function() {
    game.init(ctxBG, ctxFG);
    game.start();
});