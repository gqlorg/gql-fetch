import path from 'path';
import GQLRequest from './GQLRequest';
import 'abortcontroller-polyfill';
import {
    Maybe,
    IFetchOptions,
    IClientOptions,
    IQueryVariables
} from './types';
import {Observable, Observer} from "rxjs";
import GQLResponse from "./GQLResponse";

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

    public fetchObservable(query: string,
                           variables?: Maybe<IQueryVariables>,
                           options: IFetchOptions = {}): Observable<GQLResponse> {
        return new Observable((observer: Observer<GQLResponse>) => {
            this.fetch(query, variables, options).then((res: any) => {
                observer.next(res);
            }).catch(/* istanbul ignore next */err => observer.error(err)
            ).finally(() => observer.complete());

        });
    }

    public fetch(
        query: string,
        variables?: Maybe<IQueryVariables>,
        options: IFetchOptions = {}): GQLRequest {

        if (!query)
            throw new Error('You must provide query string');

        const headers: any = {
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
            const keys = Object.getOwnPropertyNames(variables);
            // Creates FormData if uploading any file
            for (const n of keys) {
                const x = variables[n];
                if (isBlobLike(x) || (
                    Array.isArray(x) && x.find((v) => isBlobLike(v))
                )) {
                    form = new FormData();
                    break;
                }
            }
            if (form) {
                const parts = [];
                const addPart = (n, x) => {
                    if (isBlobLike(x)) {
                        /* istanbul ignore next */
                        parts.push({
                            name: '$' + n,
                            body: x,
                            filename: path.basename(x.path || x.filename || x.name)
                        });
                        variables[n] = null;
                    } else {
                        parts.push({
                            name: '$' + n,
                            body: x,
                            filename: '',
                            contentType: typeof x !== 'string' ? 'application/json' :
                                /* istanbul ignore next */ '',
                            header: {'content-transfer-encoding': 'utf8'}
                        });
                    }
                };
                for (const n of keys) {
                    const x = variables[n];
                    if (Array.isArray(x) && x.find((v) => isBlobLike(v))) {
                        for (const i of x)
                            addPart(n, i);
                    } else
                        addPart(n, x);

                }
                form.append('payload', JSON.stringify(body));
                for (const part of parts) {
                    // @ts-ignore
                    form.append(part.name, part.body, {
                        filename: part.filename,
                        contentType: part.contentType,
                        header: part.header
                    });
                }
            }
        }

        if (!form)
            headers['Content-Type'] = 'application/json';

        const abortController = new AbortController();
        const opts = {
            method: 'POST',
            headers,
            body: form || JSON.stringify(body),
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

/* istanbul ignore next */
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
