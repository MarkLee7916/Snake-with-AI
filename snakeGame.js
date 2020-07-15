"use-strict";

const HEIGHT = 20;
const WIDTH = 20;

// Constants for changing the direction the snake is moving
const LEFT = [0, -1];
const RIGHT = [0, 1];
const UP = [-1, 0];
const DOWN = [1, 0];

const snake = createSnake();
const goal = createGoal();

initialiseGame();

function initialiseGame() {
	initialiseGridInDOM();
	addGlobalEventListeners();

	runGame();
}

function getNextAIMove(startCoordinate) {
	const path = bestFirstSearch(startCoordinate);
	const move = convertPathToFirstMove(path);

	return move;
}

function convertPathToFirstMove(pathAsMap) {
	var finalMove = getMoveFromPath(pathAsMap);

	if (finalMove === undefined)
		return generateDefaultMove(snake.head());
	else
		return reverseDirection(finalMove);
}

function getMoveFromPath(pathAsMap) {
	const pathAsArray = [];
	var currentCoordinate = JSON.stringify(goal.getGoal());

	while (pathAsMap.get(currentCoordinate) != undefined) {
		let newCoordinate = pathAsMap.get(currentCoordinate);
		let directionChange = subtractCoordinates(JSON.parse(newCoordinate), JSON.parse(currentCoordinate));

		pathAsArray.push(directionChange);
		currentCoordinate = newCoordinate;
	}

	return pathAsArray[pathAsArray.length - 1];
}

function generateDefaultMove(move) {
	if (!snake.hasSnake(addCoordinates(move, UP))) {
		return UP;
	} else if (!snake.hasSnake(addCoordinates(move, LEFT))) {
		return LEFT;
	} else if (!snake.hasSnake(addCoordinates(move, RIGHT))) {
		return RIGHT;
	} else {
		return DOWN;
	}
}

function reverseDirection(coordinate) {
	return coordinate.map(elem => elem * -1);
}

function bestFirstSearch(startingPos) {
	const path = new Map();
	const visited = new Set();
	const gridHeuristic = (pos1, pos2) => computeHeuristic(pos1) - computeHeuristic(pos2);
	const coordinates = createPriorityQueue(gridHeuristic);			
	
	coordinates.add(startingPos);

	while (!coordinates.isEmpty()) {
		let currentPos = coordinates.poll();
		let currentNeighbours = generateNeighbours(currentPos);

		currentNeighbours.forEach(elem => {
			let stringifiedElem = JSON.stringify(elem);

			if (!visited.has(stringifiedElem)) {
				coordinates.add(elem);
				visited.add(stringifiedElem)
				path.set(stringifiedElem, JSON.stringify(currentPos));				
			}
		});

		if (goal.isGoal(currentPos)) {
			return path;
		}
	}

	return path;
}

function computeHeuristic(stringifiedElem) {
	const elem = JSON.parse(stringifiedElem);

	return Math.abs(goal.getGoal()[0] - elem[0]) + Math.abs(goal.getGoal()[1] - elem[1]);
}

function generateNeighbours(coordinate) {
	const neighbours = [];
	const leftNeighbour = wrapAround(addCoordinates(coordinate, LEFT));
	const rightNeighbour = wrapAround(addCoordinates(coordinate, RIGHT));
	const upNeighbour = wrapAround(addCoordinates(coordinate, UP));
	const downNeighbour = wrapAround(addCoordinates(coordinate, DOWN));

	if (!snake.hasSnake(downNeighbour)) {
		neighbours.push(downNeighbour);
	}

	if (!snake.hasSnake(upNeighbour)) {
		neighbours.push(upNeighbour);
	}

	if (!snake.hasSnake(rightNeighbour)) {
		neighbours.push(rightNeighbour);
	}

	if (!snake.hasSnake(leftNeighbour)) {
		neighbours.push(leftNeighbour);
	}

	return neighbours;
}
	
function addGlobalEventListeners() {
	document.addEventListener("keydown", dealWithKeyPress);
	document.querySelector("#reset").addEventListener("click", refreshBrowser);
}

function refreshBrowser() {
	location = location;
}

// Map key press onto action
function dealWithKeyPress(keyPress) {
	const leftArrow = 37;
	const upArrow = 38;
	const rightArrow = 39;
	const downArrow = 40;

	switch (keyPress.keyCode) {
		case upArrow:
			snake.changeDirection(UP);
			break;
		case leftArrow:
			snake.changeDirection(LEFT);
			break;
		case rightArrow:
			snake.changeDirection(RIGHT);
			break;
		case downArrow:
			snake.changeDirection(DOWN);
			break;
	}
}

async function runGame() {
	var running = true;
	var move = undefined;
	var isAIRunning = false;
	var paused = false;

	addLocalClickListenersForRunGame(toggleAI, pause);

	while (running) {
		if (!paused) {
			if (isAIRunning) {
				move = getNextAIMove(snake.head());
				snake.changeDirection(move);
			}

			snake.moveOneStep();
			handleGoalCapture();
			paintGridInDOM();	
			handleSnakeDeath(gameOver);		
		}

		await delay();
	}

	function toggleAI(clickable) {
		var button = clickable.target;

		if (isAIRunning) {
			isAIRunning = false;
			button.style.color = "white";
		}
		else {
			isAIRunning = true;
			button.style.color = "#00BFFF";
		}
	}

	function gameOver() {
		alert("Game over!");
		running = false;
	}

	function pause(clickable) {
		const pauseButton = clickable.target;

		if (!paused) {
			paused = true;
			pauseButton.innerHTML = "Resume";
		}
		else {
			paused = false;
			pauseButton.innerHTML = "Pause";
		}
	}
}

function addLocalClickListenersForRunGame(toggleAI, pause) {
	document.querySelector("#toggle-ai").addEventListener("click", toggleAI);
	document.querySelector("#pause").addEventListener("click", pause);
}

function handleSnakeDeath(gameOver) {
	if (snake.isDead()) {
		gameOver();
	}
}

function handleGoalCapture() {
	const head = snake.head();

	if (goal.isGoal(head)) {
		snake.expand();
		goal.newGoal();
	}
}

function delay() {
	return new Promise(resolve => {
		setTimeout(resolve, 40);
	});
}

function paintGridInDOM() {
	for (let row = 0; row < HEIGHT; row++) {
		for (let col = 0; col < WIDTH; col++) {
			paintTile(row, col);
		}
	}
}

function paintTile(row, col) {
	const SNAKE_COLOR = "#00BFFF";
	const GOAL_COLOR = "#CD5C5C";
	const BACKGROUND_COLOR = "#fed8b1";

	if (snake.hasSnake([row, col])) {
		paintTileInDOM(SNAKE_COLOR, row, col);
	} else if (goal.isGoal([row, col])) {
		paintTileInDOM(GOAL_COLOR, row, col);
	} else {
		paintTileInDOM(BACKGROUND_COLOR, row, col);
	}
}

function paintTileInDOM(color, row, col) {
	const tileDOM = getTileInDOM(row, col);

	tileDOM.style.backgroundColor = color;
}

function getTileInDOM(row, col) {
	const gridDOM = document.querySelector("#grid");
	const rowDOM = gridDOM.rows[row];
	const tileDOM = rowDOM.cells[col];

	return tileDOM;
}

// Dynamically generate HTML for a plain grid
function initialiseGridInDOM() {
	const gridDOM = document.querySelector("#grid");

	for (let row = 0; row < HEIGHT; row++) {
		let newRow = createEmptyRowInDOM(row);
		gridDOM.append(newRow);
	}

	paintGridInDOM();
}	

function createEmptyRowInDOM(row) {
	const newRow = document.createElement("tr");
	newRow.className = "row";

	for (let col = 0; col < WIDTH; col++)  {
		let newTile = createEmptyTileInDOM(row, col);
		newRow.append(newTile);
	}

	return newRow;
}

function createEmptyTileInDOM(row, col) {
	const newTile = document.createElement("td");

	newTile.className = "tile";

	return newTile;
}

function wrapAround([row, col]) {
	if (row === HEIGHT) {
		row = 0;
	} 
	
	if (row < 0) {
		row = HEIGHT - 1;	 
	} 
	
	if (col === WIDTH) {
		col = 0;
	} 
	
	if (col < 0) {
		col = WIDTH - 1;
	}

	return [row, col];
}

// Generates a random integer whose value lies between lower and upper
function randomIntBetween(lower, upper) {
	return Math.floor(Math.random() * (upper - lower)) + lower;
}

function addCoordinates([row1, col1], [row2, col2]) {
	return [row1 + row2, col1 + col2];
}

function subtractCoordinates([row1, col1], [row2, col2]) {
	return [row1 - row2, col1 - col2]; 
}

function isSameCoordinate([row1, col1], [row2, col2]) {
	return row1 === row2 && col1 === col2;
}
