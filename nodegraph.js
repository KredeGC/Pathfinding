class NodeGraph {
    constructor(map, w, h, pad = 3) {
        this.setMap(map);
        this.setSize(w, h);
        this.setPadding(pad);
        this.nodes = [];
    }

    generate() { // This is very slow and should only be done once per map load
        var pad = this.padding;

        for (var i in this.map.obstacles) {
            var obs = this.map.obstacles[i];
            var [x, y] = [obs.pos.x - pad, obs.pos.y - pad]; // Add padding to the obstacle in order to avoid collision
            var [w, h] = [x + obs.scale.x + pad * 2, y + obs.scale.y + pad * 2];

            this.addNode(x, y);
            this.addNode(w, y);
            this.addNode(w, h);
            this.addNode(x, h);
        }

        this.connectNodes();
    }

    trim() { // Remove redundant nodes
        var deletion = []; // Wish there was a better way to do this but what can you do
        
        for (var i in this.nodes) {
            var node = this.nodes[i];
            if (node.neighbors.length == 2 && node.neighbors[0].neighbors.indexOf(node.neighbors[1]) > -1) {
                deletion.push(i); // If the node has 2 neighbors that are already connected
            }
        }

        for (var i = deletion.length - 1; i >= 0; i--) {
            this.deleteNode(deletion[i]); // Workaround for splicing itself
        }
    }

    setSize(w, h) {
        this.width = w;
        this.height = h;
    }

    setMap(map) {
        this.map = map;
    }

    setPadding(pad) {
        this.padding = pad;
    }

    clearNodes() {
        for (var i in this.nodes) {
            this.nodes[i].neighbors = [];
        }
        this.nodes = [];
    }

    connectNodes() {
        for (var i in this.nodes) {
            this.connectNeighbors(this.nodes[i]);
        }
    }

    connectNeighbors(node) {
        this.disconnectNeighbors(node);
        
        for (var i in this.nodes) {
            var neighbor = this.nodes[i];
            if (node == neighbor) continue;
            if (!this.map.intersectObstacles(node, neighbor)) node.neighbors.push(neighbor);
        }
    }

    disconnectNeighbors(node) {
        for (var i in node.neighbors) {
            var neighbors = node.neighbors[i].neighbors;
            var n = neighbors.indexOf(node);
            if (n < 0) continue;
            neighbors.splice(n, 1);
        }
        node.neighbors = [];
    }

    addNode(x, y) {
        if (!this.checkNode(x, y)) {
            var node = new GraphNode(x, y);
            this.nodes.push(node);
            return node;
        }
        return false;
    }

    deleteNode(i) {
        if (i < 0 || i >= this.nodes.length) return false;
        this.disconnectNeighbors(this.nodes[i]);
        this.nodes.splice(i, 1);
        return true;
    }

    checkNode(x, y) {
        if (x < 0 || y < 0 || x > this.width || y > this.height) return true; // Outside of bounds
        var pos = new Vector2(x, y);
        
        for (var i in this.nodes) { // Check if a node exists at this position
            var node = this.nodes[i];
            if (x == node.x && y == node.y) return true;
        }

        for (var i in this.map.obstacles) { // Check if it's within an obstacle
            if (this.map.obstacles[i].contains(pos)) return true;
        }

        return false;
    }

    drawNodes() {
        /*for (var i in this.nodes) {
            var node = this.nodes[i];

            for (var c in node.neighbors) {
                var neighbor = node.neighbors[c];
                ctx.beginPath();
                ctx.moveTo(neighbor.x, neighbor.y);
                ctx.lineTo(node.x, node.y);
                ctx.strokeStyle = "#00FF00";
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }*/
        
        for (var i in this.nodes) {
            var node = this.nodes[i];
            ctx.beginPath();
            ctx.fillStyle = "#00AA00";
            ctx.fillRect(node.x - this.padding, node.y - this.padding, this.padding * 2, this.padding * 2);
            ctx.stroke();
        }
    }
}

class GraphNode extends Vector2 {
	constructor(x, y) {
		super();
		this.parent		= undefined;
		this.index		= undefined;
        
		this.x			= x;
		this.y			= y;
		this.gCost		= 0;
		this.hCost		= 0;
		this.neighbors	= [];
	}
	
	get fCost() { return this.gCost + this.hCost; }
	
	dist(neighbor) { return this.sub(neighbor).length; }
	distSqr(neighbor) { return this.sub(neighbor).lengthSqr; }

	clear() {
		this.parent	= undefined;
		this.index	= undefined;
		this.gCost	= 0;
		this.hCost	= 0;
	}
}