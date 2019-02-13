import {EventEmitter} from 'events';
import {IPromiseFinally, IPromiseRejected, IPromiseResolved} from "./types";
import GQLResponse from "./GQLResponse";

export default class GQLRequest extends EventEmitter {

    public static readonly EVENT_ABORT = 'abort';
    public static readonly EVENT_COMPLETE = 'complete';

    private _response: Promise<Response>;

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

    public then(onfulfilled?: IPromiseResolved<GQLResponse>, onrejected?: IPromiseRejected): Promise<GQLResponse | never> {
        return this.response.then(resp =>
                resp.json().then(data => new GQLResponse(resp, data)),
            onrejected).then(onfulfilled);
    }

    public catch(onrejected?: IPromiseRejected): Promise<Response | never> {
        return this.response.catch(onrejected);
    }

    public finally(onfinally?: IPromiseFinally): Promise<Response | never> {
        return this.response.finally(onfinally);
    }

    public on(event: 'abort' | 'complete', listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

}
