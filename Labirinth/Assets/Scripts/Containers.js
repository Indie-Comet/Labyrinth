#pragma strict

class Queue {
	private var data : Object[];
	var head : int;
	var tail : int;	
	var size : int;
	function Queue(maxSize : int) {
		size = maxSize;
		data = new Object[maxSize];
		head = 0;
		tail = 0;
	}
	
	function push(a) {
		data[tail++] = a;
		tail = tail % size;
	}
	
	function pop() : Object {
		var a = data[head++];
		head = head % size;
		return a;
	}
	
	function empty() {
		return head == tail;
	}
};
