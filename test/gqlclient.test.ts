import assert from "assert";
import {GQLClient} from "../src";
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

    it('Should fetch simple query without variables', () => {
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        return client.fetch(`{                                   
                        user(id:1) {
                            id 
                            name
                            email                                                                          
                        }                      
                    }`).then((res) => {
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

    it('Should fetch set option timeout property', () => {
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        return client.fetch(`query ($interval: Int!){                                   
                        timeoutServer(interval: $interval)                    
                    }`, {interval: 250}, {timeout: 50}).then((res) => {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(typeof res.json, 'object');
        }).catch((err) => {
            assert.strictEqual(err.type, 'request-timeout');
        });
    });

    it('Should fetch request abort function', () => {
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        const request = client.fetch(`query ($interval: Int!){                                   
                        timeoutServer(interval: $interval)                    
                    }`, {interval: 10000});

        const p = request.then((res) => {
            assert.strictEqual(res.status, 200);
            assert.strictEqual(typeof res.json, 'object');
        }).catch((err) => {
            assert.strictEqual(err.type, 'request-timeout');
        });

        setTimeout(() => {
            request.abort();
        }, 10);

        return p;

    });

});
