export default class GQLResponse {

    public readonly data: object;
    public readonly status: number;
    public readonly statusText: string;
    public readonly ok: boolean;
    public readonly url: string;
    public readonly headers: Headers;

    constructor(response: Response, data: object) {
        this.data = data;
        this.headers = response.headers;
        this.ok = response.ok;
        this.status = response.status;
        this.statusText = response.statusText;
        this.url = response.url;
    }

}
