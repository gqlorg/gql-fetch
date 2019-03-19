import './support/env';
import assert from "assert";
import fs from "fs";
import getFetch, {GQLClient} from "../src";
import {GqlApplication} from "./support/app";

const {rejects} = require('rejected-or-not');
assert.rejects = assert.rejects || rejects;

describe('GQLClient', () => {

    let app: GqlApplication;
    const port = 4000;

    before(() => {
        app = new GqlApplication();
        return app.start(port);
    });

    after(() => {
        return app.stop();
    });

    it("Should create GQLClient", () => {
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
            assert.strictEqual(res.status, 200, res.statusText);
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
            assert.strictEqual(res.status, 200, res.statusText);
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
        }, /aborted/i).then(() => {
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
            assert.strictEqual(res.status, 200, res.statusText);
            assert.strictEqual(typeof res.json, 'object');
        });
    });

    it('Should upload file', () => {
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        return client.fetch(`mutation ($userId: Int!, $file: File!) {
              uploadFile(userId: $userId, file: $file)           
            }`, {
            userId: 12345,
            file: fs.createReadStream(__dirname + '/support/file1.txt')
        }).then(res => {
            const json = res.json;
            assert(json);
            assert(!json.errors, json.errors && json.errors[0].message);
            assert.strictEqual(res.status, 200, res.statusText);
            assert(json.data);
            assert.strictEqual(json.data.uploadFile, 'This is the 1.st test file\n');
        });
    });

    it('Should upload multiple files as array', () => {
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        return client.fetch(`mutation ($userId: Int!, $files: [File!]!) {
              uploadFiles(userId: $userId, files: $files)           
            }`, {
            userId: 12345,
            files: [
                fs.createReadStream(__dirname + '/support/file1.txt'),
                fs.createReadStream(__dirname + '/support/file2.txt')
            ]
        }).then(res => {
            const json = res.json;
            assert(json);
            assert(!json.errors, json.errors && json.errors[0].message);
            assert.strictEqual(res.status, 200, res.statusText);
            assert(json.data);
            assert.deepStrictEqual(json.data.uploadFiles,
                ['This is the 1.st test file\n', 'This is the 2.th test file\n']
            );
        });
    });

    it('Should use fetchObservable method', (done) => {
        const client = new GQLClient('http://localhost:' + port + '/graphql');
        client.fetchObservable(`{                                   
                        user(id:1) {
                            id 
                            name
                            email                                                                          
                        }                      
                    }`).subscribe(res => {
            assert.strictEqual(res.status, 200);
            done();
        });
    }).timeout(5000);

});
