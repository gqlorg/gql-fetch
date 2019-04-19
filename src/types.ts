import {Agent as HttpAgent} from "http";
import {Agent as HttpsAgent} from "https";

export type Maybe<T> = T | undefined | null;
export type RedirectType = 'follow' | 'manual' | 'error';

export interface IFetchOptions {
    headers?: object;
    operationName?: string;
    redirect?: RedirectType;
    follow?: number;
    timeout?: number;
    compress?: boolean;
    size?: number;
    agent?: HttpAgent | HttpsAgent;
}

export interface IClientOptions {
    headers?: object;
}

export interface IQueryVariables {
    [key: string]: any;
}

export type IPromiseResolved<T> = ((value: T) =>  void | undefined | any | PromiseLike<any>) | undefined | null;
export type IPromiseRejected = ((reason: any) => never | PromiseLike<never>) | undefined | null;
export type IPromiseFinally = (() => void) | undefined | null;
