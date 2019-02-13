import {EventEmitter} from 'events';

type IPromiseResolved<T> = ((value: T) => T | PromiseLike<T>) | undefined | null;
type IPromiseRejected = ((reason: any) => never | PromiseLike<never>) | undefined | null;
type IPromiseFinally = (() => void) | undefined | null;

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

    public then(onfulfilled?: IPromiseResolved<Response>, onrejected?: IPromiseRejected): Promise<Response | never> {
        if (onrejected)
            return this.response.then(onfulfilled, onrejected);
        return this.response.then(onfulfilled);
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
