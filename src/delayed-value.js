function delayedValue() {
    return new Promise((onSuccess, onFailure) => {
        setTimeout(() => {
            const value = Math.floor(100 * Math.random());
            if (value < 50) {
                onSuccess(value);
            } else {
                onFailure(value);
            }
        }, 1000);
    });
}

console.log('Before invocation')
console.time('Elapsed');

const promise = delayedValue();
promise
    .then(ok => {
        console.log('Success: %d', ok);
    })
    .catch(err => {
        console.log('Failure: %d', err);
    })
    .finally(() => {
        console.timeEnd('Elapsed');
    });
console.log('After invocation');


