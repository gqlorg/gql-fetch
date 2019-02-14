import fetch from 'node-fetch';
// @ts-ignore
if (!global.fetch) {
    // @ts-ignore
    global.fetch = fetch;
    // @ts-ignore
    global.Response = fetch.Response;
    // @ts-ignore
    global.Headers = fetch.Headers;
    // @ts-ignore
    global.Request = fetch.Request;
}

import {getFetch, GQLClient} from './fetch';

export default getFetch;
export {GQLClient};
