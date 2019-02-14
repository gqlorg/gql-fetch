import {EventEmitter} from 'events';
import {IPromiseFinally, IPromiseRejected, IPromiseResolved} from "./types";
import GQLResponse from "./GQLResponse";

export default class GQLRequest extends EventEmitter {

    public static readonly EVENT_ABORT = 'abort';
    public static readonly EVENT_COMPLETE = 'complete';

    private readonly _response: Promise<Response>;

    constructor(response: Promise<Response>,
                private _abortController: AbortController) {
        super();
        this._response = response.then((rsp) => {
            this.emit('complete', rsp);
            return rsp;
        });
    }

    get response(): Promise<Response> {
        return this._response;
    }

    get aborted(): boolean {
        return this._abortController.signal.aborted;
    }

    public abort(): void {
        this._abortController.abort();
    }

    public on(event: 'abort' | 'complete', listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    public then(onfulfilled?: IPromiseResolved<GQLResponse>, onrejected?: IPromiseRejected): Promise<GQLResponse | never> {
        return this.response
            .catch(e => {
                if (e.type === 'aborted')
                    this.emit('abort');
                throw e;
            })
            .then(resp =>
                    resp.json().then(data => new GQLResponse(resp, data)),
                onrejected)
            .then(onfulfilled);
    }

    /* istanbul ignore next: No need to test Promise features */
    public catch(onrejected?: IPromiseRejected): Promise<Response | never> {
        return this.response.catch(onrejected);
    }

    /* istanbul ignore next: No need to test Promise features */
    public finally(onfinally?: IPromiseFinally): Promise<Response | never> {
        return this.response.finally(onfinally);
    }

}
