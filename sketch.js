// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain

// Videos
// https://youtu.be/HyK_Q5rrcr4
// https://youtu.be/D8UgRyRnvXU
// https://youtu.be/8Ju_uxJ9v44
// https://youtu.be/_p5IH0L63wo

// Depth-first search
// Recursive backtracker
// https://en.wikipedia.org/wiki/Maze_generation_algorithm

let cols, rows;
let w = 600/25;
let grid = [];
let current;
let stack = [];

var maze_id;
var allGameData = [];

function StartNewGame()
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() 
	{
    if (this.readyState == 4 && this.status == 200) 
		{
			maze_id = JSON.parse(this.responseText).maze_id;			
			console.log(maze_id);
		}
    };
	xhttp.open("POST", "https://ponychallenge.trustpilot.com/pony-challenge/maze", false);
	xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	xhttp.send(JSON.stringify({
							"maze-width":25,
							"maze-height":25,
							"maze-player-name":"rainbow dash",
							"difficulty":10
	}));
  ShowGame();
}

function GetAllGameData()
{	
	$.ajax({
				url: 'https://ponychallenge.trustpilot.com/pony-challenge/maze/c92ef319-e520-4408-9500-6c482486f68b',
				method: 'GET',
				dataType: 'json',
				contentType: 'application/json; charset=utf-8',        
				success: function (data) {
					console.log(data);
					allGameData = data;         
				},
				fail : function( jqXHR, textStatus ) {
					alert( "Request failed: " + textStatus );
				}
			})
}

function ShowGame(maze_id = "c92ef319-e520-4408-9500-6c482486f68b")
{
	console.log(maze_id);
	 var xhttp = new XMLHttpRequest();
	 xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
     document.getElementById("preview").innerHTML  = this.responseText;
    }
  };
  xhttp.open("GET", "https://ponychallenge.trustpilot.com/pony-challenge/maze/"+maze_id+"/print", true);
  xhttp.send();
  GetAllGameData();
  
}

function setup() {
	
	frameRate(5);	
	
  createCanvas(600, 600);
  cols = floor(width / w);
  rows = floor(height / w);
  
  
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[263];
}

function draw() {
  background(100);
  for (let i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  current.visited = true;
  current.highlight();
  // STEP 1
  let next = current.checkNeighbors();
  if (next) {
    next.visited = true;

    // STEP 2
    stack.push(current);

    // STEP 3
    removeWalls(current, next);

    // STEP 4
    current = next;
  } else if (stack.length > 0) {
    current = stack.pop();
  }
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }
  return i + j * cols;
}

function removeWalls(a, b) {
  let x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}