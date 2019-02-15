import GQLRequest from './GQLRequest';
import 'abortcontroller-polyfill';
import {
    Maybe,
    IFetchOptions,
    IClientOptions,
    IQueryVariables
} from './types';

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

    public fetch(
        query: string,
        variables?: Maybe<IQueryVariables>,
        options: IFetchOptions = {}): GQLRequest {

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

        let form: Maybe<FormData> = null;
        if (variables) {
            for (const n of Object.getOwnPropertyNames(variables)) {
                const x: any = variables[n];
                if (isBlobLike(x)) {
                    if (!form) {
                        form = form || new FormData();
                        form.append('request', '');
                    }
                    form.append('variable.' + n, x, x.name);
                    variables[n] = null;
                }
            }
            if (form)
                form.set('request', JSON.stringify(body));
        }

        const abortController = new AbortController();
        const opts = {
            method: 'POST',
            headers,
            body: form ? form : JSON.stringify(body),
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

function isBlobLike(x: any) {
    return isBlob(x) || isStream(x);
}

function isBlob(x: any) {
    // @ts-ignore
    return (global.Blob && x instanceof global.Blob) ||
        (Object.prototype.toString.call(x) === '[object Blob]' &&
            typeof x.slice === 'function');
}

function isStream(x: any) {
    return x &&
        typeof x.pipe === 'function' &&
        typeof x._read === 'function';
}
