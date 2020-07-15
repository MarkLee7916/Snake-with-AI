function createGoal() {
	var goal = [HEIGHT - 1, WIDTH - 1];

	function getValidCoordinates() {
		const validCoordinates = [];

		for (let row = 0; row < HEIGHT; row++) {
			for (let col = 0; col < WIDTH; col++) {
				if (!snake.hasSnake([row, col])) {
					validCoordinates.push([row, col]);
				}
			}
		}

		return validCoordinates;
	}

	return {
		newGoal() {
			const validCoordinates = getValidCoordinates();

			goal = validCoordinates[randomIntBetween(0, validCoordinates.length)];
		},

		isGoal(coordinate) {
			return isSameCoordinate(goal, coordinate);
		},

		getGoal() {
			return goal;
		}
	};
}

