import FormData from 'form-data';

/* istanbul ignore next */
// @ts-ignore
const root = (typeof self === 'object' && self.window) || global;

// FormData polyfill
// @ts-ignore
if (!root.FormData) {
    // @ts-ignore
    root.FormData = FormData;
}
