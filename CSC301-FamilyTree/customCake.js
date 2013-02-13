// global constants
// canvas constants
var CANVAS_WIDTH = 785;
var CANVAS_HEIGHT = 340;

// male constantas
var MALE_SQUARE_WIDTH = 50;
var MALE_COLOUR = [132, 112, 255, 1];
var imageMale = 'lib/silMale.jpg';
var highMale = 'lib/silMaleHigh.jpg';
// female constants
var FEMALE_CIRCLE_RADIUS = 25;
var FEMALE_COLOUR = [255, 192, 203, 1];
var imageFem = 'lib/silFem.jpg';
var highFem = 'lib/silFemHigh.jpg';
// Dead person colour constant
var DEAD_COLOUR = "grey";

// scale constants
var ZOOM_FACTOR = -0.01;
var MIN_SCALE = 1;
var MAX_SCALE = 2.8;
var ZOOM_BUTTONFACTOR = -6;

// layout grid constants
var GRID_SIZE = 50;
var FMEMB_OBJECT_INDEX = 0; 
var FMEMB_X_INDEX = 1;
var FMEMB_Y_INDEX = 2;
var LINE_START_X_INDEX = 0;
var LINE_START_Y_INDEX = 1;
var LINE_END_X_INDEX = 2;
var LINE_END_Y_INDEX = 3;

// single grid cell size
var CELL_WIDTH = 50;
var CELL_HEIGHT = 50;

// viewport canvas changes dynamically based on grid size
var VIEWPORT_CANVAS_WIDTH = CELL_WIDTH * GRID_SIZE;
var VIEWPORT_CANVAS_HEIGHT = CELL_HEIGHT * GRID_SIZE;

// layout key constants
var FAMILY_MEMBERS = "fmembers";
var NORM_LINE = "line";
var ADOPTION_LINE = "dottedLine";
var MARRIAGE_LINE = "doubleLine";
var DIVORCE_LINE = "doubleDottedLine";
var COMMON_LAW_LINE = "tripleLine";
var SEPARATED_COMMON_LAW_LINE = "tripleDottedLine";

var DOT_LENGTH = 10;
var DOT_SPACE = 3;

var TEXT_PADDING = 10;
var NAME_PADDING = 5;

//Other constants
 var CANVAS_COLOR = "#d2e9ff";
 var NodeArray = new Array();
 var LIBRARY_PATH = 'lib/';


function Node(shape,member) {
	this.shape = shape;
	this.member = member;
}


MemberNode = Klass(CanvasNode,{
	
	shape : null,
	img : null,
	nameNode: null,
	member: null,
	
	initialize:function(shape, img, nameNode){
		CanvasNode.initialize.call(this);
		
		this.shape = shape;
		this.img = img;
		this.nameNode = nameNode;
		
		this.append(shape, img);
	}
})

/**
 * Draws elements in grid to canvas
 * 
 * The main function to be invoked is layout. This will return an object that looks as follows:
 *
 * fmembers is the key for a 2D array. Each row contains layout info about a single family member. 
 * The first element of a row is the family member object, 
 * the second is the x coordinate in the grid, and the second is the y coordinate
 * line is the key for a 2D array for regular lines. Each row has the x and y coordinate of that line.
 *
 * The following have information layed out exactly the same way as line. There are just different lines
 *
 * layout example
 * {fmembers: 		 [[fmem1,x1,y1],[fmem2,x2,y2],[fmem3,x3,y3]]
 *  line:  			 [[x1s,y1s,x1e,y1e],[x2s,y2s,x2e,y2e],[x3s,y3s,x3e,y3e]]
 *  dottedLine:      [[x1s,y1s,x1e,y1e],[x2s,y2s,x2e,y2e],[x3s,y3s,x3e,y3e]] // adoption
 *  doubleLine:      [[x1s,y1s,x1e,y1e],[x2s,y2s,x2e,y2e],[x3s,y3s,x3e,y3e]] // marriage
 *  doubleDottedLine:[[x1s,y1s,x1e,y1e],[x2s,y2s,x2e,y2e],[x3s,y3s,x3e,y3e]] // divorce
 *  tripleLine:      [[x1s,y1s,x1e,y1e],[x2s,y2s,x2e,y2e],[x3s,y3s,x3e,y3e]] // common law
 *  tripleDottedLine:[[x1s,y1s,x1e,y1e],[x2s,y2s,x2e,y2e],[x3s,y3s,x3e,y3e]] // separated common law
 * }
 * 
 * @param grid - 2D array containing object type and location in canvas
 * @param layout - described above
 * @return void 
 */
function drawGrid(canvas, layout) {
	
	if(canvas.getContext) {	

	//Get context
	var ctxt = canvas.getContext('2d');
	ctxt.clearRect(0,0,canvas.width,canvas.height);
				
	// create an empty GRID_SIZE x GRID_SIZE 2D array only containing familyMembers
	var fmembGrid = new Array(GRID_SIZE);
	for (var i = 0; i < GRID_SIZE; i++){
		fmembGrid[i] = new Array(GRID_SIZE);
	}
	// fetch family members to display
	var members = layout[FAMILY_MEMBERS];
	for (var i = 0; i < members.length; i++){
		// get the grid info
		var member = members[i][FMEMB_OBJECT_INDEX];
		var gridX = members[i][FMEMB_X_INDEX];
		var gridY = members[i][FMEMB_Y_INDEX]; 
		
		// draw to canvas
		// image to be drawn 
		//shape overlays over image 
		var shape = null;
		var img = new Image();
		img.src="";
		// MALE
		if (member.getGender() == MALE){ 
			img.src=imageMale;
			shape = new Rectangle(MALE_SQUARE_WIDTH, MALE_SQUARE_WIDTH);
			// set colour
			shape.fill = "white"; 
		}
		// FEMALE
		else if(member.getGender() == FEMALE){
			img.src=imageFem;
			shape = new Circle (FEMALE_CIRCLE_RADIUS);
			// set colour
			shape.fill = "white";
		}

		//Create image
		var imageGeo = new ImageNode(img);
		imageGeo.dWidth=50;
		imageGeo.dHeight=50;
		imageGeo.id=member.getId();
		imageGeo.centered = true;
		imageGeo.dX=(CELL_WIDTH * gridX) + CELL_WIDTH / 2;
		imageGeo.dY=(CELL_HEIGHT * gridY) + CELL_HEIGHT / 2;
		
		// set the placement
		shape.centered = true;				
		// calculate center of the cell
		shape.x = (CELL_WIDTH * gridX) + CELL_WIDTH / 2; //add one since index starts at 0
		shape.y = (CELL_HEIGHT * gridY) + CELL_HEIGHT / 2;	

		// Add family member name.
		var nameNode = new TextNode(member.getFirstName());
		nameNode.align = "center";
		nameNode.fill = "black";
		nameNode.cy = CELL_HEIGHT - TEXT_PADDING;
		
		//if dead, text color is grey
		if (member.getDateOfDeath() != "") {
			nameNode.fill = DEAD_COLOUR;
		}
		
		
		shape.append( nameNode );
		var memberNode = new MemberNode(shape, imageGeo, nameNode);

		// update the fmembGrid with these fmembers
		fmembGrid[gridX][gridY] = imageGeo;
		
		//Add to global node array
		if (member.familyMember != null) {
			NodeArray.push(new Node(imageGeo, member.familyMember));
			memberNode.member = member.familyMember;
		} else {
			NodeArray.push(new Node(imageGeo, member));
			memberNode.member = member;
		}
		
		memberNode.member.img = memberNode;
		memberNode.member.setImg(memberNode);
		// add it to canvas
		canvas.append(memberNode);

	}

	// all the line keys
	var lineKeys = [NORM_LINE, ADOPTION_LINE, MARRIAGE_LINE, DIVORCE_LINE, COMMON_LAW_LINE, SEPARATED_COMMON_LAW_LINE];
	for (var keyIndex = 0; keyIndex < lineKeys.length; keyIndex++){
		var key = lineKeys[keyIndex];
		// check if line needs to be drawn
		var lines = layout[key];
		if (lines != null){
			
			var prevX = null;
			var prevY = null;
			for (var i = 0; i < lines.length; i++){
				
				gridStartX = lines[i][LINE_START_X_INDEX];
				gridStartY = lines[i][LINE_START_Y_INDEX];
				gridEndX = lines[i][LINE_END_X_INDEX];
				gridEndY = lines[i][LINE_END_Y_INDEX];
				var shapeStart = fmembGrid[gridStartX][gridStartY];
				var shapeEnd = fmembGrid[gridEndX][gridEndY];
				var xStart = (shapeStart == null) ? (CELL_WIDTH * gridStartX) + CELL_WIDTH / 2 : shapeStart.dX;
				var yStart = (shapeStart == null) ? (CELL_HEIGHT * gridStartY) + CELL_HEIGHT / 2 : shapeStart.dY;
				var xEnd = (shapeEnd == null) ? (CELL_WIDTH * gridEndX) + CELL_WIDTH / 2 : shapeEnd.dX;
				var yEnd = (shapeEnd == null) ? (CELL_HEIGHT * gridEndY) + CELL_HEIGHT / 2 : shapeEnd.dY - 25;
				// create the line
				var line = null;
				// choose the line type
				switch (key){
					case NORM_LINE:
						line = new Line(xStart, yStart, xEnd, yEnd);
						break;
						
					case ADOPTION_LINE:
						line = multiLines(xStart, yStart, xEnd, yEnd, 1, true);				
						break;
						
					case MARRIAGE_LINE:
						yEnd = shapeEnd.dY;
						line = multiLines(xStart - 25, yStart, xEnd + 25, yEnd, 2, false);
						break;
						
					case DIVORCE_LINE:
						yEnd = shapeEnd.dY;
						var remarried = false;
						//Fix divorce lines for multiple marriages
						//This part is inefficient. Oh well.
						for (var i = 0;i<NodeArray.length;i++) {
						
						if (NodeArray[i].member.getDivorce() && (shapeStart.id == NodeArray[i].						member.id)) {
						remarried = true;
						}
						
						}
						
						if (remarried) {
						line = multiLines(xStart + 75, yStart, xEnd + 25, yEnd, 2, true);
						} else {
						line = multiLines(xStart - 25, yStart, xEnd + 25, yEnd, 2, true);
						}
						break;
						
					case COMMON_LAW_LINE:
						yEnd = shapeEnd.dY;
						line = multiLines(xStart - 25, yStart, xEnd + 25, yEnd, 3, false);
						break;
						
					case SEPARATED_COMMON_LAW_LINE:
						yEnd = shapeEnd.dY;
						line = multiLines(xStart - 25, yStart, xEnd + 25, yEnd, 3, true);
						break;
				}
				// add to canvas
				canvas.append(line);
			}
		}
	}
	}
}

/*
 * // layout key constants
var FAMILY_MEMBERS = "fmembers";
var NORM_LINE = "line";
var ADOPTION_LINE = "dottedLine";
var MARRIAGE_LINE = "doubleLine";
var DIVORCE_LINE = "doubleDottedLine";
var COMMON_LAW_LINE = "tripleLine";
var SEPARATED_COMMON_LAW_LINE = "tripleDottedLine";
 */

function multiLines (xStart, yStart, xEnd, yEnd, numOfLines, dotted){
	var lineNodes = new CanvasNode();
	// horizontal line
	if (yStart == yEnd){
		if (dotted){
			if (numOfLines == 1){
				lineNodes.append(genHorizontalDottedLine(xStart, yStart, xEnd, yEnd));
			}
			else if (numOfLines == 2){
				lineNodes.append(genHorizontalDottedLine(xStart, yStart - numOfLines, xEnd, yEnd - numOfLines));
				lineNodes.append(genHorizontalDottedLine(xStart, yStart + numOfLines, xEnd, yEnd + numOfLines));
			}
			else if (numOfLines == 3){
				lineNodes.append(genHorizontalDottedLine(xStart, yStart - numOfLines, xEnd, yEnd - numOfLines));
				lineNodes.append(genHorizontalDottedLine(xStart, yStart, xEnd, yEnd));
				lineNodes.append(genHorizontalDottedLine(xStart, yStart + numOfLines, xEnd, yEnd + numOfLines));
			}
			else {
				// we only support up to triple lines
			}
		}
		else{
			if (numOfLines == 1){
				lineNodes.append(new Line(xStart, yStart, xEnd, yEnd));
			}
			else if (numOfLines == 2){
				lineNodes.append(new Line(xStart, yStart - numOfLines, xEnd, yEnd - numOfLines));
				lineNodes.append(new Line(xStart, yStart + numOfLines, xEnd, yEnd + numOfLines));
			}
			else if (numOfLines == 3){
				lineNodes.append(new Line(xStart, yStart - numOfLines, xEnd, yEnd - numOfLines));
				lineNodes.append(new Line(xStart, yStart, xEnd, yEnd));
				lineNodes.append(new Line(xStart, yStart + numOfLines, xEnd, yEnd + numOfLines));
			}
			else {
				// we only support up to triple lines
			}
		}
	}
	// vertical line
	else if (xStart == xEnd){
		if (dotted){
			if (numOfLines == 1){
				lineNodes.append(genVerticalDottedLine(xStart, yStart, xEnd, yEnd));
			}
			else if (numOfLines == 2){
				lineNodes.append(genVerticalDottedLine(xStart - numOfLines, yStart, xEnd - numOfLines, yEnd));
				lineNodes.append(genVerticalDottedLine(xStart + numOfLines, yStart, xEnd + numOfLines, yEnd));
			}
			else if (numOfLines == 3){
				lineNodes.append(genVerticalDottedLine(xStart - numOfLines, yStart, xEnd - numOfLines, yEnd));
				lineNodes.append(genVerticalDottedLine(xStart, yStart, xEnd, yEnd));
				lineNodes.append(genVerticalDottedLine(xStart + numOfLines, yStart, xEnd + numOfLines, yEnd));
			}
			else {
				// we only support up to triple lines
			}
		}
		else{
			if (numOfLines == 1){
				lineNodes.append(new Line(xStart, yStart, xEnd, yEnd));
			}
			else if (numOfLines == 2){
				lineNodes.append(new Line(xStart - numOfLines, yStart, xEnd - numOfLines, yEnd));
				lineNodes.append(new Line(xStart + numOfLines, yStart, xEnd + numOfLines, yEnd));
			}
			else if (numOfLines == 3){
				lineNodes.append(new Line(xStart - numOfLines, yStart, xEnd - numOfLines, yEnd));
				lineNodes.append(new Line(xStart, yStart, xEnd, yEnd));
				lineNodes.append(new Line(xStart + numOfLines, yStart, xEnd + numOfLines, yEnd));
			}
			else {
				// we only support up to triple lines
			}
		}
	}
	else{
		// should not happen -_-; 
		// no diagonal lines
	}
	return lineNodes; 
}

function genHorizontalDottedLine(xStart, yStart, xEnd, yEnd){
	var lineNode = new CanvasNode();
	var delta = xEnd;
	for (var i = 0; i < Math.abs(xEnd - xStart)/(DOT_LENGTH + DOT_SPACE); i++){
		var dot = new Line(delta, yStart, delta + DOT_LENGTH, yEnd);
		delta += DOT_LENGTH + DOT_SPACE;
		lineNode.append(dot);
	}
	return lineNode;
}

function genVerticalDottedLine(xStart, yStart, xEnd, yEnd){
	var lineNode = new CanvasNode();
	var delta = yStart;
	for (var i = 0; i < Math.abs(yEnd - yStart)/(DOT_LENGTH + DOT_SPACE); i++){
		var dot = new Line(xStart, delta, xEnd, delta + DOT_LENGTH);
		delta += DOT_LENGTH + DOT_SPACE;
		lineNode.append(dot);
	}
	return lineNode;
}


//this class allows the moving of the item to happen
function move (item) {
	this.item = item;
	var th = this;
	
	//action for mouse clicking event. determine if
	//user is moving the item.
	this.item.addEventListener("mousedown", 
		function (ev) {
		    th.dragX = this.root.mouseX;
		    th.dragY = this.root.mouseY;
		    // check which item is being clicked
		   	th.dragging = th.item.underCursor && th.item.contains(th.item.root.target);
		    return false;
		}
	);
	
	//action for mouse move event. if the mouse button is held
	//then proceed to drag the item.
	this.item.addEventListener("mousemove", 
		function (ev) {
			if (th.dragging) {
				var dx = this.root.mouseX - th.dragX;
				var dy = this.root.mouseY - th.dragY;
				th.dragX = this.root.mouseX;
				th.dragY = this.root.mouseY;
				// check that mouse is in a valid space
				// ie, within canvas
				if (th.dragX == null) {
					dx = 0;
					th.dragging = false;
				}
				if (th.dragY == null){
					dy = 0;	
					th.dragging = false;
				}
				// update the position of the selected item ie, target
				th.item.x += dx;
				th.item.y += dy;
		    }
		    return false;
		}
	);
			
	//remove all dragging flags when mouse button is release
	this.item.addEventListener("mouseup", 
		function (ev) {
		    th.dragging = false;
			return false;
		}
	);
}
/*
function zoom (canvas){
	this.canvas = canvas;
	var th = this;
		
	this.canvas.addEventListener("DOMMouseScroll", 
		function (ev) {
			if (th.canvas.scale + ev.detail * ZOOM_FACTOR > MIN_SCALE &&
				th.canvas.scale + ev.detail * ZOOM_FACTOR < MAX_SCALE)
			{
				th.canvas.scale += ev.detail * ZOOM_FACTOR;
			} 
			return false;
		}
	, true);	
}
*/

function zoom2 (val) {
	var tempy = viewCanvas.y + viewCanvas.height;
	
	if ((viewCanvas.scale + (-1)*(val * ZOOM_FACTOR) > MIN_SCALE) &&
				(viewCanvas.scale + (-1)*(val * ZOOM_FACTOR) < MAX_SCALE))
			{
	
		viewCanvas.x -= (ZOOM_BUTTONFACTOR* ZOOM_FACTOR)*viewCanvas.width/2*val;
		
		viewCanvas.scale += ZOOM_BUTTONFACTOR * ZOOM_FACTOR * val;
		}
	
}
