function makeCounter(e = 10) {
    // global scope
    let f = 0;
    function changeBy(val) {
        f += val;
    }
    return {
        increment() {
            changeBy(1);
        },

        decrement() {
            changeBy(-1);
        },

        value() {
            return f;
        },
        sum(a) {
            return function sum2(b) {
                return function sum3(c) {
                    // outer functions scope
                    return function sum4(d) {
                        // local scope
                        return (a + b + c + d + e) ^ f;
                    };
                };
            };
        }
    };
}

const counter1 = makeCounter();
const counter2 = makeCounter();

console.log(counter1.value()); // 0.

counter1.increment();
counter1.increment();
console.log(counter1.value()); // 2.

counter1.decrement();
console.log(counter1.value()); // 1.
console.log(counter2.value()); // 0.

console.log(counter1.sum(1)(2)(3)(4)); // 20
console.log(counter1.value()); // 1.

console.log(counter2.sum(1)(2)(3)(4)); // 20
console.log(counter2.value()); // 0.
