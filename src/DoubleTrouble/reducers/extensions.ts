
declare global {
    interface Array<T> {
        /**
         * Add an item to the array, and return a copy of the array. The original array is not altered.
         * @param item The item to add.
         */
        append(item: T): Array<T>;
    }
}

Array.prototype.append = function<T>(item: T) {
    const newArray = this.slice();
    newArray.push(item);
    return newArray;
}

export {}