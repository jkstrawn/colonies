function GUI(game, x, y, sprite) {
    this.game = game;
    this.x = x;
    this.y = y;
	this.sprite = ASSET_MANAGER.getAsset(sprite);
    this.toRemove = false;
	this.hover = false;
	this.clicked = false;
	this.mouseDown = false;
	this.mouseUp = false;
	this.toDraw = true;
	this.z = 0;
	this.divs = [];
}


GUI.prototype.setXandY = function(x, y) {
	this.x = x;
	this.y = y;
}

GUI.prototype.draw = function(ctx) {
	if(this.toDraw) {
	    ctx.drawImage(this.sprite, this.x, this.y);
	    this.toDraw = false;
	}
	/*
	if(this.hover) {
		ctx.strokeRect(this.x, this.y, this.sprite.width, this.sprite.height);
	}
	*/
}

GUI.prototype.isMouseInsideGUI = function(x, y, sprite) {
	if(!game.mouse) return;
	
	var mouseX = game.mouse.x;
	var mouseY = game.mouse.y;
	
	//if func is passed with parameters then use those, otherwise use the parameters of THIS gui
	var _x = (x) ? x : this.x;
	var _y = (y) ? y : this.y;
	var _sprite = (sprite) ? sprite : this.sprite;
	
	if(mouseX >= _x && mouseX <= (_x + _sprite.width) && mouseY >= _y && mouseY <= (_y + _sprite.height)) {
		return true;
	}
	return false;
}

GUI.prototype.update = function () {
	this.mouseDown = false;
	this.clicked = false;
	this.mouseUp = false;
}

GUI.prototype.createLabel = function(id, labelText, x, y) {
	var newLabelDiv = 
		"<div class='texts' id='label"+id+"' style='position:absolute; z-index:30; background: rgba(255, 255, 255, 0.7);'>" +
		"<p>"+labelText+"</p>" +
		"</div>";
	$("#canvasContainer").append(newLabelDiv);

	var canvas = document.getElementById('surface');
	var label = document.getElementById('label'+id);
	label.style.left = (canvas.offsetLeft+x)+"px";
	label.style.top =  (canvas.offsetTop+y)+"px";
	this.divs.push(label);
	return label;
}

GUI.prototype.setLabelXandY = function(label, x, y) {
	var canvas = document.getElementById('surface');
	label.style.left = (canvas.offsetLeft+x)+"px";
	label.style.top =  (canvas.offsetTop+y)+"px";
}

GUI.prototype.mouseDragged = function (x, y) {
}

GUI.prototype.remove = function() {
}

//*****************************************************************************************************************************************************************
function GuiBuilding(game, x, y, parent) {
    GUI.call(this, game, x, y, 'img/rock.png');
    this.parent = parent;

    this.building =[[3,3,3,3,3,3],
    				[3,2,2,2,2,3],
    				[3,2,2,2,2,3],
    				[3,2,2,2,2,3],
    				[3,2,2,2,2,3],
    				[3,3,3,3,3,3]];
}

GuiBuilding.prototype = new GUI();
GuiBuilding.prototype.constructor = GuiBuilding;

GuiBuilding.prototype.draw = function(ctx) {
}

GuiBuilding.prototype.update = function(dt) {
	var _tile = this.game.getTileAtMouse();

	if(this.clicked && _tile) {
		this.game.map.setBuilding();
		this.toRemove = true;
		this.parent.guiToDrag = null;
	}
	if(_tile) {
		this.game.map.setBuldingOutlineState = {tile: _tile, building: this.building, type: 1};
	}
	GUI.prototype.update.call(this, dt);
}

GuiBuilding.prototype.isMouseInsideGUI = function() {
	return true;
}

GuiBuilding.prototype.remove = function() {
	this.parent.guiToDrag = null;
	this.parent.guiSet = true;
}
//*****************************************************************************************************************************************************************
function GuiScreen(game, x, y, sprite) {
    GUI.call(this, game, x, y, sprite);

	this.buttons = [];
    this.texts = [];

	this.createLabel('ants', '0', 82+this.x, 50+this.y);
	this.createLabel('sugar', '0', 82+this.x, 90+this.y);

	this.buttons.push(game.addGUI(new ButtonBuilding(game, x+50, y+150, 'nursery', this, 1, 1)));
}

GuiScreen.prototype = new GUI();
GuiScreen.prototype.constructor = GuiScreen;

GuiScreen.prototype.draw = function(ctx) {
	GUI.prototype.draw.call(this, ctx);
}

GuiScreen.prototype.update = function(dt) {
	GUI.prototype.update.call(this, dt);
}

GuiScreen.prototype.remove = function() {
	for(var i = 0; i < this.buttons.length; i++) {
		this.game.removeGUI(this.buttons[i]);
	}
	for(var i = 0; i < this.divs.length; i++) {
		document.getElementById('canvasContainer').removeChild(this.divs[i]);
	}
}

GuiScreen.prototype.removeButtons = function() {
	console.log(this.buttons.length);
	//this.buttons = [];
}

GuiScreen.prototype.removeButton = function(button) {
    for(var i = 0; i < this.buttons.length; i++) {
		if(this.buttons[i] == button) {
			this.buttons.splice(i, 1);
			console.log("remove");
		}
	}
	this.toDraw = true;
}
//*****************************************************************************************************************************************************************
function Button(game, x, y, type, parent, id) {
    GUI.call(this, game, x, y, 'img/button_' + type + '.png');
    this.type = type;
	this.id = id;
	this.z = 1;
	this.parent = parent;
	this.hoverLabel = null;

	this.toDraw = true;
	//this.spriteHover = ASSET_MANAGER.getAsset('img/button_' + this.type + 'Hover.png');
}

Button.prototype = new GUI();
Button.prototype.constructor = Button;

Button.prototype.update = function() {
	GUI.prototype.update.call(this);
	if(this.hover) {
		if(!this.hoverLabel)
			this.hoverLabel = this.createLabel('name', 'Create Nest', this.game.mouse.x, this.game.mouse.y-20);
		else
			this.setLabelXandY(this.hoverLabel, this.game.mouse.x, this.game.mouse.y-20);
	} else if(this.hoverLabel) {
		document.getElementById('canvasContainer').removeChild(this.hoverLabel);
		this.hoverLabel = null;
		}
}

Button.prototype.draw = function(ctxBG, ctxFG) {
	GUI.prototype.draw.call(this, ctxBG);
	if(this.hover) {
		ctxFG.translate(0.5, 0.5);
		ctxFG.strokeRect(this.x, this.y, 31, 31);
		ctxFG.translate(-0.5, -0.5);
	}
	//ctx.font = "18px '"+"Courier New"+"'";
	//ctx.fillText(this.type, this.x+10, this.y+20);
}
//*****************************************************************************************************************************************************************
function ButtonBuilding(game, x, y, type, parent, id, oneTime) {
    Button.call(this, game, x, y, type, parent, id);

	this.dragging = false;
	this.guiToDrag = null;
	this.guiSet = false;
	this.oneTime = oneTime;
}
ButtonBuilding.prototype = new Button();
ButtonBuilding.prototype.constructor = ButtonBuilding;

ButtonBuilding.prototype.update = function() {
	if(this.hover && this.clicked) {
	//if the mouse is over this ButtonBuilding at this moment
		console.log("clicked to build a building");
		this.guiToDrag = this.game.mouseGui = this.game.addGUI(new GuiBuilding(this.game, this.x, this.y, this));
	}
	if(this.guiToDrag)
		this.guiToDrag.update();
	if(this.guiSet && this.oneTime) {
		this.game.removeGUI(this);
		this.parent.removeButton(this);
	}
	Button.prototype.update.call(this);
}

ButtonBuilding.prototype.draw = function(ctxBG, ctxFG) {
	Button.prototype.draw.call(this, ctxBG, ctxFG);
}
//*****************************************************************************************************************************************************************

//*****************************************************************************************************************************************************************

//*****************************************************************************************************************************************************************

//*****************************************************************************************************************************************************************

//*****************************************************************************************************************************************************************