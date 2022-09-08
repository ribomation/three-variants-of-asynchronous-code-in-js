function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 0;
    if (n === 1) return 1;
    return n * factorial(n - 1);
}

function main(num_invocations = 5) {
    console.time('elapsed time');

    const timer = setInterval(() => {
        const argument = Math.floor(30 * Math.random());
        const result   = factorial(argument);
        console.log('%d! = %d', argument, result);
    }, 1000);

    setTimeout(() => {
        clearInterval(timer);
        console.timeEnd('elapsed time');
    }, (num_invocations + 1) * 1000);
}

main();
