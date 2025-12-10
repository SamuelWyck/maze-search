const Node = require("./node.js");



class Deque {
    #length;
    constructor(items=null) {
        this.head = null;
        this.tail = null;
        this.#length = 0;

        if (items !== null) {
            for (let item of items) {
                this.push(item);
            }
        }
    };

    get length() {
        return this.#length;
    };

    push(value) {
        this.#length += 1;
        const node = new Node(value);
        if (this.head === null) {
            this.head = node;
            this.tail = this.head;
            return;
        }

        this.tail.next = node;
        node.prev = this.tail;
        this.tail = this.tail.next;
    };

    pushleft(value) {
        this.#length += 1;
        const node = new Node(value);
        if (this.head === null) {
            this.head = node;
            this.tail = this.head;
            return;
        }

        this.head.prev = node;
        node.next = this.head;
        this.head = this.head.prev;
    };

    pop() {
        if (this.head === null) {
            return null;
        }
        if (this.#length === 1) {
            const value = this.head.value;
            this.head = null;
            this.tail = null;
            this.#length -= 1;
            return value;
        }

        this.#length -= 1;
        const oldTail = this.tail;
        this.tail = this.tail.prev;
        this.tail.next = null;
        oldTail.prev = null;
        return oldTail.value;
    };

    popLeft() {
        if (this.head === null) {
            return null
        }
        if (this.#length === 1) {
            const value = this.head.value;
            this.head = null;
            this.tail = null;
            this.#length -= 1;
            return value;
        }

        this.#length -= 1;
        const oldHead = this.head;
        this.head = this.head.next;
        this.head.prev = null;
        oldHead.next = null;
        return oldHead.value;
    };
};



module.exports = Deque;