		
		/**** Initialize global variables ******/
			// main canvas which is static, does not move or resize
			// this canvas is needed for redraw(to get rid of artifacts)
			var mainCanvas = null;
			var canvas = null;	
			var tempnode = null;
			var tempimg = null;
			var director = null;
			var viewport = null;
			var root = null;
			var viewCanvas = null;
			var builder = null;
			var familyTree = null;
			var layoutManager = null;
			var grid = null;
			var people = null;
			
			// Basically the main method
			function init() {
			canvas = document.getElementById('myCanvas');
			mainCanvas = new Canvas(canvas);
			showTest();
			addEvents();
			
			}
			
			/* changes the family tree */
			function showTest() {
				
				// Remove all elements from the main canvas.
				mainCanvas.removeAllChildren();
				document.getElementById("photo").src = DEFAULT_PHOTO;
				// this canvas contains any object on screen
				// rectangles, circles, lines?(maybe)
				viewCanvas = new Canvas(E.canvas(VIEWPORT_CANVAS_WIDTH, VIEWPORT_CANVAS_HEIGHT));
				viewCanvas.x -= (VIEWPORT_CANVAS_WIDTH / 2) - (CANVAS_WIDTH / 2);
						
				// need this in order to pickup mouse event to pan				
				viewCanvas.pickable = true;
				viewCanvas.fill = CANVAS_COLOR;
						
				// CanvasNode takes care of the mouse handling
				// it takes care of which object is being clicked
				
				viewport = new CanvasNode();
				viewport.pickable = true;
				
				//initiate our family tree graphical builder
				builder = new FamilyTreeBuilder( new FamilyMemberFactoryImpl());
			
				//return designated Sample Tree from selection box
				var selIndex = document.testsel.select1.selectedIndex;
				switch( selIndex ){
					case 1:
						director = new SimplerThanSimplestOfTreesDirector( builder );
						root = "joe";
						break;					
					case  2:
						director = new SimplestOfTreesDirector( builder );
						root = "jane";
						break;
					case  3:
						director = new StillSimplefTreeDirector( builder );
						root = "joe";
						break;
					case  4:
						director = new BoingaTreeDirector( builder );
						root = "Ingmar";
						break;
					case  5:
						director = new PabloTreeDirector( builder );
						root = "Andrea";
						break;
					case  6:
						director = new TashaTreeDirector( builder );
						root = "Michelle";
						break;
					case  7:
						director = new UniquaTreeDirector( builder );
						root = "Daisy";
						break;
					case  8:
						director = new TyroneTreeDirector( builder );
						root = "Tyrona";
						break;
					case  9:
						director = new AustinTreeDirector( builder );
						root = "Jane";
						break;
					default:
						director = new DefaultDirector( builder );
						root = "";
						break;
				};
				
				//build the family tree and the alignment grid
				director.construct();
				familyTree = builder.getResult();
				layoutManager = new LayoutManager( familyTree );
				grid = layoutManager.getGrid(root);

				drawGrid(viewCanvas, grid);
								
				// append the viewCanvas, canvas containing all the objects to viewport CanvasNodes
				viewport.append(viewCanvas);								
				// setup the mouse listeners
				move(viewCanvas);
				
				// display everything on main canvas				
				mainCanvas.append(viewport);
				
				people = grid.fmembers;
				addEvents();
				
				
			}	
				
		/* Adds the events showinfo() and center() on each node */
		function addEvents() {	
				
			if (people.length>0) {
				
				for (var i=0;i<people.length;i++){
				
						var person = people[i];
						
						if (person[0].img != null) {
						person[0].img.addEventListener('click', function(){
							showInfo(this);
						});
						person[0].img.addEventListener('dblclick', function(){
							center(this);
						});
						} else if (person[0].familyMember != null) {
				     	person[0].familyMember.img.addEventListener('click', function(){
							showInfo(this);
						});
						person[0].familyMember.img.addEventListener('dblclick', function(){
							center(this);
						});
						}
						
					}
					
				} 
				
		}
			
			
			//Show information and changes photo of each node 
			function showInfo(node){
				var person;
				if (node.familyMember != null) {
				person = node.familyMember;
				} else if (node.member != null) {
				person = node.member; 
				} else {
				person = node;
				}

				if (tempnode != null) {
				tempnode.img.img.image.src = tempimg;
				}
				tempnode = person;
				tempimg = person.img.img.image.src;
				if (person.getGender() == 'm') {
				person.img.img.image.src = highMale;
				} else {
				person.img.img.image.src = highFem;
				}
				
				document.getElementById("first").value = person.getFirstName();
				document.getElementById("last").value = person.getLastName();
				document.getElementById("dob").value = person.getDateOfBirth();
				document.getElementById("dod").value = person.getDateOfDeath();
				document.getElementById("notes").value = person.getNotes();
				document.getElementById("photo").src = person.getPhoto();
			}
			
			//Adds nodes to the family tree. Currently bugged for complex cases
			function addnode() {
				
				var fname = document.getElementById("nodefirstname").value.toLowerCase();
				var lname = document.getElementById("nodelastname").value.toLowerCase();
				var id = fname.toLowerCase() + " " + lname.toLowerCase();
				var dob = document.getElementById("nodedob").value.toLowerCase();
				var dod = document.getElementById("nodedod").value.toLowerCase();
				var notes = document.getElementById("nodenotes").value.toLowerCase();
				var fatherid = document.getElementById("nodefather").value.toLowerCase();
				var motherid = document.getElementById("nodemother").value.toLowerCase();
				var spouseid = document.getElementById("nodespouse").value.toLowerCase();
				var male = document.getElementById("nodemale").checked;
				var female = document.getElementById("nodefemale").checked;
				var single = document.getElementById("nodesingle").checked;
				var marriage = document.getElementById("nodemarriage").checked;
				var divorce = document.getElementById("nodedivorce").checked;
				var commonlaw = document.getElementById("nodecommonlaw").checked;
				var adopted = document.getElementById("nodeadopted").checked;
				var gender;
				
				if (male) {
				gender=MALE;
				} else if (female) {
				gender=FEMALE;
				}
				
				//Check for basic info
				if (fname != "" && lname != "") {
				
				
				this.director.builder.buildFamilyMember(id,fname,lname,gender,dob,dod,notes);
				
				//Node is married in some way
				if (spouseid != "") {

				if (marriage) {
				
				if (male) {
				this.director.builder.buildMarriage(id,spouseid,MARRIED_STATUS);
				} else if (female) {
				this.director.builder.buildMarriage(spouseid,id,MARRIED_STATUS);
				}
				
				} else if (divorce) {
				
				if (male) {
				this.director.builder.buildMarriage(id,spouseid,DIVORCED_STATUS);
				} else if (female) {
				this.director.builder.buildMarriage(spouseid,id,DIVORCED_STATUS);
				} 
				
				} else if (commonlaw) {
				
				if (male) {
				this.director.builder.buildMarriage(id,spouseid,COMMONLAW_STATUS);
				} else if (female) {
				this.director.builder.buildMarriage(spouseid,id,COMMONLAW_STATUS);
				} 
				
				}
				
				}
				
			 	//Node is a child
				else if (fatherid != "" && motherid != "") {
				
				if (single && adopted) {
				this.director.builder.buildChild(fatherid,motherid,id,true);
				} else if (single) {
				this.director.builder.buildChild(fatherid,motherid,id,false);
				}
				
				}
				
				//Add node by itself 
				else {
				
				root = id;
				
				}
				
				
				
				familyTree = builder.getResult();
				layoutManager = new LayoutManager( familyTree );
				grid = layoutManager.getGrid(root);

				drawGrid(viewCanvas, grid);
				people = grid.fmembers;
				
				addEvents();
				
				}
				

			}
			
			//function for uploading photo
			function preview() {
			
			var img = LIBRARY_PATH + document.getElementById("upload").value;
			if (tempnode != null) {
			tempnode.getPhoto() = img;
			}
			document.getElementById("photo").src = img;
			
			
			}
			
			//Function for centering the node on double click
			function center(node) {
			
			var tempperson = node;
			if (node.member!=null) {
			tempperson=node.member;
			}
			
			
					if (people.length>0) {
					
							for (var i=0;i<people.length;i++){
					
								var person = people[i];

								//Search functionality
								if ((new String (person[0].getId()).toLowerCase()) == (tempperson.getId().toLowerCase())) {
									
									
									viewCanvas.x = (person[1]*CELL_WIDTH*viewCanvas.scale - CANVAS_WIDTH/2 + CELL_WIDTH/2)*(-1);
									viewCanvas.y = (person[2]*CELL_HEIGHT*viewCanvas.scale - CANVAS_HEIGHT/2 + CELL_HEIGHT/2)*(-1);
									showInfo(person[0]);
								
								}
								else if (person[0].familyMember != null) {
									if ((new String(person[0].familyMember.getId()).toLowerCase()) == (tempperson.getId().toLowerCase())) {
									
									
										//person = person[0].familyMember;
										//alert(person[0].familyMember.firstName + " x: " + person[1] + " y: " + person[2]);
										viewCanvas.x = (person[0].familyMember.img.img.dX*viewCanvas.scale - CANVAS_WIDTH/2)*(-1);
										viewCanvas.y = (person[0].familyMember.img.img.dY*viewCanvas.scale - CANVAS_HEIGHT/2)*(-1);
										showInfo(person[0].familyMember);
									}
								}
						}
						
					}
			
			
			
			}
			
			//Search and pan to a certain person
			function search2() {
				var wanted = document.getElementById("searchbox").value;
				grid = layoutManager.getGrid(root);
				
				if (people.length>0) {
					
							for (var i=0;i<people.length;i++){
					
								var person = people[i];

								//Search functionality
								if (wanted != "" && (new String (person[0].getId()).toLowerCase()) == (new String (wanted.toLowerCase()))) {
									
									
									viewCanvas.x = (person[1]*CELL_WIDTH*viewCanvas.scale - CANVAS_WIDTH/2 + CELL_WIDTH/2)*(-1);
									viewCanvas.y = (person[2]*CELL_HEIGHT*viewCanvas.scale - CANVAS_HEIGHT/2 + CELL_HEIGHT/2)*(-1);
									showInfo(person[0]);
								
								}
								else if (wanted != "" && person[0].familyMember != null) {
									if ((new String(person[0].familyMember.getId()).toLowerCase()) == (new String (wanted.toLowerCase()))) {
									
									
										//person = person[0].familyMember;
										//alert(person[0].familyMember.firstName + " x: " + person[1] + " y: " + person[2]);
										viewCanvas.x = (person[0].familyMember.img.img.dX*viewCanvas.scale - CANVAS_WIDTH/2)*(-1);
										viewCanvas.y = (person[0].familyMember.img.img.dY*viewCanvas.scale - CANVAS_HEIGHT/2)*(-1);
										showInfo(person[0].familyMember);
									}
								}
						}
						
					}
				}
				
			
		//function to modify information pane		
		function modify() {
		
		if (tempnode!=null) {
		
		var fname = document.getElementById("first").value;
		var lname = document.getElementById("last").value;
		var dob = document.getElementById("dob").value;
		var dod = document.getElementById("dod").value;
		var notes = document.getElementById("notes").value;
		
		tempnode.setId(fname.toLowerCase() + " " + lname.toLowerCase());
		tempnode.setFirstName(fname);
		tempnode.setLastName(lname);
		tempnode.img.nameNode.text = fname;
		tempnode.setDateOfBirth(dob);
		tempnode.setDateOfDeath(dod);
		
		if (dod != "") {
		tempnode.img.nameNode.fill = DEAD_COLOUR;
		}
		
		tempnode.setNotes(notes);
		
		}
		
		}		
			
