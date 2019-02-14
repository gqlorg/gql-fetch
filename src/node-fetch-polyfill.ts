import fetch from 'node-fetch';

// fetch polyfill
// @ts-ignore
if (!global.fetch) {
    // @ts-ignore
    global.fetch = fetch;
}

// Headers polyfill
// @ts-ignore
if (!global.Headers) {
    // @ts-ignore
    global.Headers = fetch.Headers;
}

// Request polyfill
// @ts-ignore
if (!global.Request) {
    // @ts-ignore
    global.Request = fetch.Request;
}

// Response polyfill
// @ts-ignore
if (!global.Response) {
    // @ts-ignore
    global.Response = fetch.Response;
}
