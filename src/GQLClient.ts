import {Maybe, IFetchOptions, IClientOptions} from './types';
import GQLRequest from './GQLRequest';
import 'abortcontroller-polyfill';

export default class GQLClient {

    private _url: RequestInfo;
    private _headers: Maybe<object>;

    constructor(url: RequestInfo, options: IClientOptions = {}) {
        this._url = url;
        this._headers = options.headers;
    }

    set headers(value: Maybe<object>) {
        this._headers = value;
    }

    get headers(): Maybe<object> {
        return this._headers;
    }

    set url(value: RequestInfo) {
        this._url = value;
    }

    get url(): RequestInfo {
        return this._url;
    }

    public fetch(query: string, variables?: Maybe<object>, options: IFetchOptions = {}): GQLRequest {

        if (!query)
            throw new Error('You must provide query string');

        const headers = {
            'Content-Type': 'application/json',
            ...(this.headers || {}),
            ...(options.headers || {})
        };

        const body = {
            operationName: options.operationName,
            query: String(query),
            variables: variables || null
        };

        const abortController = new AbortController();
        const opts = {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
            redirect: options.redirect || 'follow',
            signal: abortController.signal,
            follow: options.follow,
            timeout: options.timeout,
            compress: options.compress,
            size: options.size,
            agent: options.agent
        };

        const fetchPromise = fetch(this.url, opts);
        return new GQLRequest(fetchPromise, abortController);
    }

}
