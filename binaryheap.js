class BinaryHeap {
	constructor(compare) {
		this.items = [];
		this.length = 0;
		if (compare) {
			this.compare = compare; // Return positive, negative or 0
		}
	}
	
	push(item) {
		item.index = this.length;
		this.items[item.index] = item;
		this.sortUp(item);
		this.length++;
	}
	
	pop() {
		var item = this.items[0];
		this.length--;
		
		var newitem = this.items[this.length];
		this.items[0] = newitem;
		newitem.index = 0;
		this.sortDown(newitem);
		
		return item;
	}
	
	contains(item) {
		return this.items[item.index] == item;
	}
	
	sortDown(item) {
		var left = item.index * 2 + 1;
		var right = item.index * 2 + 2;
		var index = (this.items[right] && this.compare(this.items[left], this.items[right]) > 0) ? right : left;
		
		while (index < this.length && this.compare(item, this.items[index]) > 0) {
			this.swap(item, this.items[index]);
			
			left = item.index * 2 + 1;
			right = item.index * 2 + 2;
			index = (this.items[right] && this.compare(this.items[left], this.items[right]) > 0) ? right : left;
		}
	}
	
	sortUp(item) {
		var n = item.index;
		
		while (n > 0) {
			var index = ((n + 1) >> 1) - 1;
			var parent = this.items[index];
			
            if (this.compare(item, parent) >= 0) break;
            
			this.swap(item, parent);
            n = index;
		}
	}
	
	swap(itemA, itemB) {
		this.items[itemA.index] = itemB;
		this.items[itemB.index] = itemA;
		var itemAIndex = itemA.index;
		itemA.index = itemB.index;
		itemB.index = itemAIndex;
	}
}