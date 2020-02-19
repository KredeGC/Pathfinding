class AStar {
	clear() {
		var open = this.openSet && this.openSet.nodes || [];
		var closed = this.closedSet || [];

		for (var i in open) {
			open[i].clear();
		}
		for (var i in closed) {
			closed[i].clear();
		}

		this.openSet = new BinaryHeap((nodeA, nodeB) => { // Comparison function, compare fCost and hCost
			var diff = nodeA.fCost - nodeB.fCost;
			if (diff == 0) diff = nodeA.hCost - nodeB.hCost;
			return diff;
		});
		this.closedSet = [];
		this.path = [];
    }
    
    clearNoHeap() {
		var open = this.openSet || [];
		var closed = this.closedSet || [];

		for (var i in open) {
			open[i].clear();
		}
		for (var i in closed) {
			closed[i].clear();
		}

		this.openSet = [];
		this.closedSet = [];
		this.path = [];
	}
	
	compute(start, end) {
		this.clear();
		this.openSet.push(start);
		
		while (this.openSet.length > 0) {
			var current = this.openSet.pop();
			this.closedSet.push(current);
			
			if (current == end) {
				this.path = this.retracePath(start, end);
				return this.path;
			}
			
			for (var i in current.neighbors) {
				var neighbor = current.neighbors[i];
				if (this.closedSet.indexOf(neighbor) > -1) continue;
				
				var newCost = current.gCost + neighbor.dist(current); // Distance between start and current
				if (newCost < neighbor.gCost || !this.openSet.contains(neighbor)) {
					neighbor.gCost = newCost;
					neighbor.hCost = this.heuristic(neighbor, end); // The heuristic between current and end
					neighbor.parent = current;
					// console.log(neighbor.x + " " + neighbor.y + " " + neighbor.fCost);
					
					if (!this.openSet.contains(neighbor)) {
						this.openSet.push(neighbor);
					} else {
						this.openSet.sortUp(neighbor);
					}
				}
			}
		}
		
		this.path = [];
		return this.path; // Target is impossible to reach
	}
	
	computeNoHeap(start, end) {
		this.clearNoHeap();
        this.openSet.push(start);
		
		while (this.openSet.length > 0) {
            var currentIndex = 0;
            for (var i in this.openSet) {
                if (this.openSet[i].fCost < this.openSet[currentIndex].fCost) {
                    currentIndex = i;
                }
            }
            var current = this.openSet[currentIndex];
            this.openSet.splice(currentIndex, 1);

			this.closedSet.push(current);
			
			if (current == end) {
				this.path = this.retracePath(start, end);
				return this.path;
			}
			
			for (var i in current.neighbors) {
				var neighbor = current.neighbors[i];
				if (this.closedSet.indexOf(neighbor) > -1) continue;
				
				var newCost = current.gCost + neighbor.dist(current); // Distance between start and current
				if (newCost < neighbor.gCost || this.openSet.indexOf(neighbor) == -1) {
					neighbor.gCost = newCost;
					neighbor.hCost = this.heuristic(neighbor, end); // The heuristic between current and end
					neighbor.parent = current;
					// console.log(neighbor.x + " " + neighbor.y + " " + neighbor.fCost);
					
					if (this.openSet.indexOf(neighbor) == -1) {
						this.openSet.push(neighbor);
					}
				}
			}
		}
		
		this.path = [];
		return this.path; // Target is impossible to reach
	}

	heuristic(node, end) {
		return node.dist(end);
	}
	
	retracePath(start, end) {
		var current = end;
		var path = [];
		while (current.parent) {
			path.unshift(current);
			current = current.parent;
		}
		path.unshift(start)
		return path;
	}
}