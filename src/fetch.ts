import GQLClient from './GQLClient';
import GQLRequest from './GQLRequest';
import {Maybe, IFetchOptions, IClientOptions} from './types';

export function getFetch(url: RequestInfo, options?: IClientOptions) {
    const client = new GQLClient(url, options);
    return (query: string, variables?: Maybe<object>, fetchOptions: IFetchOptions = {}): GQLRequest => {
        return client.fetch(query, variables, fetchOptions);
    };
}

export {GQLClient};
