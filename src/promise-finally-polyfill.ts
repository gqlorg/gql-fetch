// Add `finally()` to `Promise.prototype`
if (!Promise.prototype.finally) {
    Promise.prototype.finally = (onFinally) => {
        return this.then(
            /* onFulfilled */
            res => Promise.resolve(onFinally()).then(() => res),
            /* onRejected */
            err => Promise.resolve(onFinally()).then(() => {
                throw err;
            })
        );
    };
}
