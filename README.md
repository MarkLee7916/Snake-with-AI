# Snake-with-AI
Snake with an optional pathfinding AI

Caveats: Best first search is extremely fast in most cases, however when no path is found it has to do an exhaustive search of the space around it. When the snake is in a state where it keeps searching and can't find the path, this can sometimes cause slowdown. A possible solution could be to shorten the delay times when the algorithm can't find the path.
