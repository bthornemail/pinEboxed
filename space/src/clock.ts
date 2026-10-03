// The outer function takes a number and returns a function that returns a number
function createClock(initialValue: number): () => number {
    // 'count' is enclosed by the returned inner function
    let count: number = initialValue; 

    return function increment(): number {
        count += 1;
        return count;
    };
}

const myClock = createClock(10);

console.log(myClock()); // Output: 11
console.log(myClock()); // Output: 12