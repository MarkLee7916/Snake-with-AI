"use-strict";

function createPriorityQueue(comparator) {
	var heap = [];
	var size = 0;
	var compare = comparator;

	function leftChild(curr) {
		return 2 * curr + 1;
	}

	function rightChild(curr) {
		return 2 * curr + 2;
	}

	function parent(curr) {
		return Math.floor((curr + 1) / 2) - 1;
	}

	function isValidLeftChild(curr) {
		return leftChild(curr) < size && compare(heap[curr], heap[leftChild(curr)]) > 0;
	}

	function isValidRightChild(curr) {
		return rightChild(curr) < size && compare(heap[curr], heap[rightChild(curr)]) > 0;
	}

	function isValidParent(curr) {
		return curr > 0 && compare(heap[curr], heap[parent(curr)]) < 0
	}

	function floatDown() {
		var curr = 0;
		var min;

		while (isValidLeftChild(curr) || isValidRightChild(curr)) {
			let left = leftChild(curr);
			let right = rightChild(curr);
			
			if (right >= size) {
				min = left;
			} else {
				if (compare(heap[left], heap[right]) < 0) {
					min = left;
				}
				else {
					min = right;
				}
			}	

			swap(curr, min);
			curr = min;
		}
	}

	function floatUp() {
		var curr = size - 1; 

		while (isValidParent(curr)) {
			let parentNode = parent(curr);

			swap(curr, parentNode);
			curr = parentNode;
		}
	}

	function swap(i, j) {
		var temp = heap[i];
		heap[i] = heap[j];
		heap[j] = temp;
	}

	return {
		add(elem) {
			size++;
			heap[size - 1] = JSON.stringify(elem);
			floatUp();
		},

		poll() {
			if (size === 0)
				throw "Can't poll from empty queue";

			var max = heap[0];

			swap(0, size - 1);
			heap.length--;
			size--;
			floatDown();		

			return JSON.parse(max);
		},

		isEmpty() {
			return size === 0;
		}
	};
}
