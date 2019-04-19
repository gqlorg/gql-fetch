/* istanbul ignore next */
// @ts-ignore
const root = (typeof self === 'object' && self.window) || global;

// Process polyfill
// @ts-ignore
if (!root.process) {
    // @ts-ignore
    root.process = {
        env: {DEBUG: undefined},
    };
}
