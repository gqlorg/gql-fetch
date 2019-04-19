// @ts-ignore
const root = (typeof self === 'object' && self.window) || global;

// @ts-ignore
if (!root.process) {
    // @ts-ignore
    root.process = {
        env: {DEBUG: undefined},
    };
}
