# gql-fetch

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![DevDependencies][devdependencies-image]][devdependencies-url]

[![NPM](https://nodei.co/npm/gql-fetch.png?downloads=true&downloadRank=true)](https://nodei.co/npm/gql-fetch/)

## gql-fetch

The purpose of creating this library is to gather special usage standards in a 
client library and to facilitate development process about client-server communication.

Thanks to its simple and easy use, this library provides fast and clean code development.
In the background, a new generation request method as known as fetch is used.
This library solves this problem by polyfilling for browsers that don't have fetch support.

## Outstanding

* Thanks to it is designed for Graphql server,  it provides fast and clean code development.
* File upload support.
* Requests can be aborted.
* It is light and it has polyfill support.

## Installation

```sh
$ npm install gql-fetch
```

## Usage

gql-fetch has two usage forms:

- [`GQLClient`](#GQLClient): class
- [`getFetch`](#getFetch): function

---
#### GQLClient
The GQLClient class takes two arguments when it is being created.
- **url**: RequestInfo (required)
- **options**: [`IClientOptions`](#IClientOptions) (optional)

```ts
const client = new GQLClient('http://localhost:5000/graphql');
```

Class Properties:
- **url**: RequestInfo
- **headers**: object
- **fetch(query: string, variables?: IQueryVariables, options?: [`IFetchOptions`](#IFetchOptions))**: [`GQLRequest`](#GQLRequest)

Sample Usage
```ts
const client = new GQLClient('http://localhost:5000/graphql');
const request = client.fetch(`query ($id: Int!) {                                   
                    user(id: $id) {
                      id 
                      name                                                                                                      
                    }                      
                  }`,{ id: 1 });
request.then(...);                  
```

In order to cancel a request created with GQLClient;
```ts
const client = new GQLClient('http://localhost:5000/graphql');
const request = client.fetch(`query ($id: Int!) {                                   
                    user(id: $id) {
                      id 
                      name                                                                                                      
                    }                      
                  }`,{ id: 1 });
request.abort();                  
```

To upload file via GQLClient;
```ts
const client = new GQLClient('http://localhost:5000/graphql');
const request = client.fetch(`mutation ($file: File!) {
                uploadFile(file: $file)           
              }`, { file: fs.createReadStream(__dirname + '/file.txt')});
request.then(...);
```

---
#### getFetch

The getFetch function has two arguments.
- **url**: RequestInfo (required)
- **options**: [`IClientOptions`](#IClientOptions) (optional)

This function returns the function.

Returned function arguments;
- **query**: string (required)
- **variables**:  object (optional)
- **fetchOptions**:  [`IFetchOptions`](#IFetchOptions) (optional)

This function returns [`GQLRequest`](#GQLRequest) class. 
 
Sample Usage:
```ts

const gqlFetch = getFetch('http://localhost:5000/graphql');
const request = gqlFetch(`{                                   
                    users {
                      id 
                      name
                    }                      
                  }`);              
request.then(...);
```

---
#### GQLRequest

This class is created to manage the requests.

Class Properties:

| Property          | Type          | Argument                                                |
| ----------------- |---------------| ----------------------------------------------------- |
| response          | Promise       |  -                                                      |
| aborted           | boolean       |  -                                                      |
| abort             | void          |  -                                                      |
| on                | this          |  event: string, listener: (...args: any[]) => void  |
| then              | Promise       |  onfulfilled: IPromiseResolved< [`GQLResponse`](#GQLResponse) >, onrejected: IPromiseRejected |
| catch             | Promise       |  onrejected                                             |
| finally           | Promise       |  onfinally                                              |

---
#### GQLResponse

Class Properties:

| Property          | Type          | Argument                 |
| ----------------- |---------------| ------------------------ |
| json              | any           |  -                       |
| status            | number        |  -                       |
| statusText        | string        |  -                       |
| ok                | boolean       |  -                       |
| url               | string        |  -                       |
| headers           | Headers       |  -                       |

---
#### IClientOptions

Interface Properties:

| Property          | Type          | Argument                 |
| ----------------- |---------------| ------------------------ |
| headers           | object        |  -                       |

---
#### IFetchOptions

Interface Properties:

| Property          | Type          | Argument                 |
| ----------------- |---------------| ------------------------ |
| headers           | object        |  -                       |
| operationName     | string        |  -                       |
| redirect          | RedirectType  |  -                       |
| follow            | number        |  -                       |
| timeout           | number        |  -                       |
| compress          | boolean       |  -                       |
| size              | number        |  -                       |
| agent             | Http(s)Agent  |  -                       |

## Node Compatibility

  - node `>= 6.x`;
  
### License
[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/gql-fetch.svg
[npm-url]: https://npmjs.org/package/gql-fetch
[travis-image]: https://img.shields.io/travis/gqlorg/gql-fetch/master.svg
[travis-url]: https://travis-ci.org/gqlorg/gql-fetch
[coveralls-image]: https://img.shields.io/coveralls/gqlorg/gql-fetch/master.svg
[coveralls-url]: https://coveralls.io/r/gqlorg/gql-fetch
[downloads-image]: https://img.shields.io/npm/dm/gql-fetch.svg
[downloads-url]: https://npmjs.org/package/gql-fetch
[gitter-image]: https://badges.gitter.im/gqlorg/gql-fetch.svg
[gitter-url]: https://gitter.im/gqlorg/gql-fetch?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge
[dependencies-image]: https://david-dm.org/gqlorg/gql-fetch/status.svg
[dependencies-url]:https://david-dm.org/gqlorg/gql-fetch
[devdependencies-image]: https://david-dm.org/gqlorg/gql-fetch/dev-status.svg
[devdependencies-url]:https://david-dm.org/gqlorg/gql-fetch?type=dev
[quality-image]: http://npm.packagequality.com/shield/gql-fetch.png
[quality-url]: http://packagequality.com/#?package=gql-fetch
