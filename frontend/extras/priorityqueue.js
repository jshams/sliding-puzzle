class MinHeap {
    constructor() {
        this.items = []
    }

    empty() {
        return (this.items.length == 0)
    }

    size() {
        return this.items.length
    }

    lastIndex() {
        return this.items.length - 1
    }

    swap(i1, i2) {
        const placeholder = this.items[i1]
        this.items[i1] = this.items[i2]
        this.items[i2] = placeholder
    }

    push(item) {
        this.items.push(item)
        if (this.size() > 1) {
            this.bubbleUp(this.lastIndex())
        }
    }

    pushItems(items) {
        for (let i = 0; i < items.length; i++) {
            this.push(items[i])
            console.log(this.items)
        }
    }

    getMin() {
        if (!this.empty()) {
            return this.items[0]
        }
    }

    pop() {
        if (this.empty()) { return }
        if (this.size() == 1) {
            return this.items.pop()
        }
        const minItem = this.items[0]
        const lastItem = this.items.pop()
        this.items[0] = lastItem
        if (this.size() > 1) {
            this.bubbleDown(0)
        }
        return minItem
    }

    parentIndex(index) {
        if (index <= 0) { return }
        return Math.floor((index - 1) / 2)
    }

    leftChild(index) {
        return (index * 2) + 1
    }

    rightChild(index) {
        return (index * 2) + 2
    }

    isLeaf(index) {
        return (this.leftChild(index) > this.lastIndex(index))
    }

    bubbleUp(index) {
        if (index <= 0 || index >= this.length) { return }

        const item = this.items[index]
        const parentIndex = this.parentIndex(index)
        const parentItem = this.items[parentIndex]

        if (item < parentItem) {
            this.swap(index, parentIndex)
            this.bubbleUp(parentIndex)
        }
    }

    bubbleDown(index) {
        if (index < 0 || index >= this.length) { return }

        const item = this.items[index]
        const leftIndex = this.leftChild(index)
        const rightIndex = this.rightChild(index)

        let largest = index
        if ((leftIndex <= this.lastIndex()) && (this.items[leftIndex] < item)) {
            largest = leftIndex
        }
        if ((rightIndex <= this.lastIndex()) && (this.items[rightIndex] < this.items[largest])) {
            largest = rightIndex
        }
        if (largest != index) {
            this.swap(index, largest)
            if (!this.isLeaf(largest)) {
                this.bubbleDown(largest)
            }
        }
    }
}