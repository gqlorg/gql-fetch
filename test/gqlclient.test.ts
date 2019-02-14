import assert from "assert";
import getFetch, {GQLClient} from "../src";
import {GqlApplication} from "./support/app";

describe('GQLClient', () => {

    let app: GqlApplication;
    const port = 4000;

    before(() => {
        app = new GqlApplication();
        app.start(port);
    });

    after(() => {
        app.stop();
    });

    it("Should created GQLClient", () => {
        const url = 'http://localhost:' + port + '/graphql';
        const headers = {'Content-Type': 'application/xml'};
        const client = new GQLClient(url, {headers});
        assert(client);
        assert.strictEqual(client.url, url);
        assert.deepStrictEqual(client.headers, headers);
    });

    it("Should update GQLClient property", () => {
        const newUrl = 'http://localhost:' + port + '/graphql_new';
        const newHeaders = {'Content-Type': 'application/xml'};
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        client.url = newUrl;
        client.headers = newHeaders;
        assert.strictEqual(client.url, newUrl);
        assert.deepStrictEqual(client.headers, newHeaders);
    });

    it("Should check if query argument given for fetch()", () => {
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        assert.throws(() => {
            // @ts-ignore
            client.fetch(null, null);
        });
    });

    it('Should fetch simple query without variables', () => {
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        const request = client.fetch(`{                                   
                        user(id:1) {
                            id 
                            name
                            email                                                                          
                        }                      
                    }`);
        assert(request.response instanceof Promise);
        assert.strictEqual(request.aborted, false);
        return request.then((res) => {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(typeof res.json, 'object');
        });
    });

    it('Should fetch simple query with variables', () => {
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        return client.fetch(`query ($id: Int!) {                                   
                        user(id: $id) {
                            id 
                            name
                            email                                                                          
                        }                      
                    }`, {id: 1}).then((res) => {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(typeof res.json, 'object');
        });
    });

    it('Should abort on timeout', () => {
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        return assert.rejects(() =>
                client.fetch(`query ($interval: Int!){                                   
                        timeoutServer(interval: $interval)                    
                    }`, {interval: 250}, {timeout: 50}),
            /timeout/);
    });

    it('Should abort query', () => {
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        const request = client.fetch(`query ($interval: Int!){                                   
                        timeoutServer(interval: $interval)                    
                    }`, {interval: 100});
        let aborted: boolean;
        request.on('abort', () => {
            aborted = true;
        });

        return assert.rejects(() => {
            setTimeout(() => request.abort(), 10);
            return request;
        }, /aborted/).then(() => {
            assert.strictEqual(aborted, true);
            assert.strictEqual(request.aborted, true);
        });
    });

    it('Should emit "complete" event', (done) => {
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        const request = client.fetch(`{                                   
                        user(id:1) {
                            id                                                                                                       
                        }                      
                    }`);
        request.on('complete', () => {
            done();
        });
    });

    it('Should create fetcher method', () => {
        const gqlFetch = getFetch('http://localhost:' + port + '/graphql');
        const request = gqlFetch(`{                                   
                        user(id:1) {
                            id 
                            name
                            email                                                                          
                        }                      
                    }`);
        assert(request.response instanceof Promise);
        assert.strictEqual(request.aborted, false);
        return request.then((res) => {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(typeof res.json, 'object');
        });
    });

});
