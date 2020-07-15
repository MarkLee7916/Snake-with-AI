"use-strict";

function createSnake() {
	const coordinates = [[1, 0], [0, 0]];
	const moveDirections = [DOWN, DOWN];

	// Move array along to make snake turn properly
	function shiftDirectionArray() {
		for (let i = coordinates.length; i > 0; i--) {
			moveDirections[i] = moveDirections[i - 1];
		}
	}

	function isAboutTurn([row, col]) {
		const newPosition = wrapAround([coordinates[0][0] + row, coordinates[0][1] + col]);
		const endOfTail = coordinates[1];

		return isSameCoordinate(newPosition, endOfTail);
	}

	function arrayContains(array, key) {
		return array.reduce((accum, elem) => accum || isSameCoordinate(elem, key), false);
	}

	return {
		hasSnake(coordinate) {
			return arrayContains(coordinates, coordinate);
		},

		expand() {		
			const tail = coordinates[coordinates.length - 1];
			const tailDirection = moveDirections[moveDirections.length - 1];
			const placeDirection = reverseDirection(tailDirection);

			coordinates.push(wrapAround(addCoordinates(tail, placeDirection)));	
			moveDirections.push(tailDirection);
		},

		changeDirection(direction) {
			if (!isAboutTurn(direction)) {
				moveDirections[0] = direction;
			}
		},

		head() {
			return coordinates[0];
		},

		isDead() {
			const tail = coordinates.slice(1);
			const head = coordinates[0];

			return arrayContains(tail, head);
		},

		moveOneStep() {			
			for (let i = 0; i < coordinates.length; i++) {
				coordinates[i][0] += moveDirections[i][0];
				coordinates[i][1] += moveDirections[i][1];

				coordinates[i] = wrapAround(coordinates[i]);
			}					

			shiftDirectionArray();	
		}
	};
}