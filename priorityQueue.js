"use-strict";

function createPriorityQueue(comparator) {
	var heap = [];
	var size = 0;
	var cmp = comparator;

	function floatDown() {
		var curr = 0;
		var min;

		while ((curr * 2 + 1 < size && (cmp(heap[curr], heap[curr * 2 + 1]) > 0) 
		    || (curr * 2 + 2 < size  && cmp(heap[curr], heap[curr * 2 + 2]) > 0))) {
			let left = curr * 2 + 1;
			let right = curr * 2 + 2;

			if (right >= size) {
				min = left;
			} else {
				if (cmp(heap[left], heap[right]) < 0) {
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

		while (curr > 0 && cmp(heap[curr], heap[Math.floor((curr + 1) / 2) - 1]) < 0) {
			swap(curr, Math.floor((curr + 1) / 2) - 1);
			curr = Math.floor((curr + 1) / 2) - 1;
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