# Snake-with-AI
Snake with an optional pathfinding AI.

About: This game is playable by both the user and the AI. The AI can be turned on or off at any time. The AI uses best first search, which is an entirely heuristic based pathfinding algorithm. It's similar to A*, but it doesn't take into account a nodes distance from the starting node as finding shortest paths isn't really what we're looking to do.

Run: Just follow the link in the about section.

Caveats: Best first search is extremely fast in most cases, however when no path is found it has to do an exhaustive search of the space around it. When the snake is in a state where it keeps searching and can't find the path, this can sometimes cause slowdown. A possible solution could be to shorten the delay times when the algorithm can't find the path. I'll most likely update it when I figure out a method that doesn't rely on global state.
