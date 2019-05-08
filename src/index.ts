import './node-fetch-polyfill';
import './formdata-polyfill';
import './promise-finally-polyfill';
import './process-polyfill';
import {getFetch, GQLClient} from './fetch';

export default getFetch;
export {GQLClient};
