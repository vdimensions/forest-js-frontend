import { IForestClient, ForestResponse } from "./client";

const HeaderNames = {
    ACCEPT: "Accept",
    CONTENT_TYPE: "Content-Type"
};
const JsonHeaders = function() {
    let headersObj: any = { };
    headersObj[HeaderNames.ACCEPT] = 'application/json';
    headersObj[HeaderNames.CONTENT_TYPE] = 'application/json';
    return headersObj;
}();

const stripBlanks = (obj: any) => {
    let result: any = { };
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        if (!obj.hasOwnProperty(key) || obj[key] === null || obj[key] === undefined || obj[key] === '') {
            continue;
        }
        result[key] = obj[key];
    }
    return result;
};

const prepareBody = (options: any) => {
    let { body } = options;

    if (options && options.headers && options.headers[HeaderNames.CONTENT_TYPE] === JsonHeaders[HeaderNames.CONTENT_TYPE]) {
        body = options.body && JSON.stringify(stripBlanks(options.body));
    }

    return body;
};

// TODO: extract to separate lib
const HTTP = {

    get: (uri: string, options?: RequestInit): Promise<Response> => {
        const opts = {
            ...options,
            method: 'GET'
        };
        return fetch(uri, opts);
    },

    post: (uri: string, options?: RequestInit): Promise<Response> => {
        const opts = {
            ...options,
            method: 'POST'
        };

        return fetch(uri, {
            ...opts,
            body: prepareBody(opts)
        });
    },

    put: (uri: string, options?: RequestInit): Promise<Response> => {
        const opts = {
            ...options,
            method: 'PUT'
        };

        return fetch(uri, {
            ...opts,
            body: prepareBody(opts)
        });
    },

    patch: (uri: string, options?: RequestInit): Promise<Response> => {
        const opts = {
            ...options,
            method: 'PATCH'
        };

        return fetch(uri, {
            ...opts,
            body: prepareBody(opts)
        });
    },

    delete: (uri: string, options: RequestInit): Promise<Response> => {
        const opts = {
            ...options,
            method: 'DELETE'
        };

        return fetch(uri, opts);
    }
};

const toJson = (resp: Response) => (resp.ok) ? resp.json() : null;

const DefaultOptions : any = {
    // required for session state to work on the server-side
    credentials: "include",
    headers: JsonHeaders
};

const SLASH = '/';

const trimStartingSlash = (path: string) => {
    return path.startsWith(SLASH) ? path.substr(1, path.length) : path;
};

const trimEndingSlash = (path: string) => {
    return path.endsWith(SLASH) ? path.substr(0, path.length - 1) : path;
};

const trimSlash = (path: string) => {
    return trimEndingSlash(trimStartingSlash(path));
};

class ForestHttpClientImpl implements IForestClient {
    private readonly baseUrl: string;

    public constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async navigate(path: string) {
        const resp = await HTTP.get(`${trimEndingSlash(this.baseUrl)}/${trimSlash(path)}`, DefaultOptions);
        if (resp.ok) {
            const rawResponse = await toJson(resp);
            return (new ForestResponse(rawResponse));
        } else {
            //return ForestResult.error<ForestResponse>(resp.statusText);
            throw resp.statusText;
        }
    }

    async invokeCommand(instanceId: string, command: string, arg?: any) {
        const resp = await HTTP.post(`${trimEndingSlash(this.baseUrl)}/${trimSlash(instanceId)}/${trimSlash(command)}`, { ...DefaultOptions, body: arg });
        if (resp.ok) {
            const rawResponse = await toJson(resp);
            return (new ForestResponse(rawResponse));
        } else {
            //return ForestResult.error<ForestResponse>(resp.statusText);
            throw resp.statusText;
        }
    }
}

export type ForestHttpConfig = {
    protocol: string, 
    hostname: string, 
    port: string|number|undefined
}

export const ForestHttpClient = {
    create: (config: ForestHttpConfig) => new ForestHttpClientImpl(`${config.protocol}//${config.hostname}${config.port ? `:${config.port}` : ''}/api/forest`)
}