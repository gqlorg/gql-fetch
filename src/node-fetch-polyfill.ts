import fetch from 'node-fetch';

// @ts-ignore
const root = (typeof self === 'object' && self.window) || global;

// fetch polyfill
// @ts-ignore
if (!root.fetch) {
    // @ts-ignore
    root.fetch = fetch;
}

// Headers polyfill
// @ts-ignore
if (!root.Headers) {
    // @ts-ignore
    root.Headers = fetch.Headers;
}

// Request polyfill
// @ts-ignore
if (!root.Request) {
    // @ts-ignore
    root.Request = fetch.Request;
}

// Response polyfill
// @ts-ignore
if (!root.Response) {
    // @ts-ignore
    root.Response = fetch.Response;
}
