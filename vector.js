class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
    }
	
    get lengthSqr() { return Math.pow(this.x, 2) + Math.pow(this.y, 2); }
	get length() { return Math.sqrt(this.lengthSqr); }
	
	get normal() {
		var len = this.length;
		return new Vector2(this.x / len, this.y / len);
	}
    
    mul(s) { return new Vector2(this.x * s, this.y * s); }
    div(s) { return new Vector2(this.x / s, this.y / s); }

    add(s) { return new Vector2(this.x + s.x, this.y + s.y); }
    sub(s) { return new Vector2(this.x - s.x, this.y - s.y); }

	dot(t) { return this.x * t.x + this.y * t.y; }
	det(t) { return this.x * t.y - this.y * t.x; }

	clone() { return new Vector2(this.x, this.y); }
}