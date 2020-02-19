class Map {
    constructor() {
        this.obstacles = [];
    }

    addObstacle(obs) {
        this.obstacles.push(obs);
    }

    deleteObstacle(obs) {
        var i = this.obstacles.indexOf(obs);
        if (i < 0) return false;
        this.obstacles.splice(i, 1);
    }

    intersectObstacles(start, end) {
        var obstacles = this.obstacles;
        for (var o in obstacles) {
            if (this.intersectBox(start, end, obstacles[o])) return true;
        }
        return false
    }

    intersectSegment(nodeA, nodeB, nodeC, nodeD) {
        var denominator = (nodeB.x - nodeA.x) * (nodeD.y - nodeC.y) - (nodeB.y - nodeA.y) * (nodeD.x - nodeC.x);
        var numerator1 = (nodeA.y - nodeC.y) * (nodeD.x - nodeC.x) - (nodeA.x - nodeC.x) * (nodeD.y - nodeC.y);
        var numerator2 = (nodeA.y - nodeC.y) * (nodeB.x - nodeA.x) - (nodeA.x - nodeC.x) * (nodeB.y - nodeA.y);
        
        if (denominator == 0) return numerator1 == 0 && numerator2 == 0;

        var r = numerator1 / denominator;
        var s = numerator2 / denominator;

        if (r >= 0 && r <= 1 && s >= 0 && s <= 1) return true;
        
        return false;
    }

    intersectBox(start, end, obs) { // 4 segments from every corner
        var pos = obs.pos;
        var scl = pos.add(obs.scale);

        var tl = new Vector2(pos.x, pos.y); // Top left
        var tr = new Vector2(scl.x, pos.y); // Top right
        var br = new Vector2(scl.x, scl.y); // Bottom right
        var bl = new Vector2(pos.x, scl.y); // Bottom left
        
        return this.intersectSegment(start, end, tl, tr) || // Top line
            this.intersectSegment(start, end, tr, br) || // Right line
            this.intersectSegment(start, end, bl, br) || // Bottom line
            this.intersectSegment(start, end, tl, bl); // Left line
    }

    drawObstacles(ctx) {
        for (var o in this.obstacles) {
            this.obstacles[o].draw(ctx);
        }
    }
}

class Obstacle {
    constructor(pos, scale) {
        this.pos = pos;
        this.scale = scale;
        this.color = "#666666";
    }

    contains(t) {
        var pos = this.pos
        var scl = pos.add(this.scale); // Scale is relative
        if (t.x >= pos.x && t.x <= scl.x && t.y >= pos.y && t.y <= scl.y) return true;
        return false;
    }

    draw(ctx) {
        var [pos, scale] = [this.pos, this.scale];
        ctx.beginPath();
        ctx.fillStyle = this.color || "#666666";
        ctx.fillRect(pos.x, pos.y, scale.x, scale.y);
    }
}