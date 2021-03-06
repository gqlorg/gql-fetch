
if (!Promise.prototype.finally) {

    Promise.prototype.finally = function(onFinally) {
        return this.then(
            /* onFulfilled */
            res => Promise.resolve(onFinally()).then(() => res),
            /* onRejected */
            /* istanbul ignore next */
            err => Promise.resolve(onFinally()).then(() => {
                throw err;
            })
        );
    };
}
