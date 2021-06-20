import { ViewState } from "./core";

export class ForestResponse {
    public static empty = () => new ForestResponse({});

    public readonly path: string;
    public readonly views: ViewState[];

    constructor({path = '', views = []}) {
        this.path = path;
        this.views = views.map((v: any) => new ViewState(v));
    }
}

export interface IForestClient {
    navigate: (template: string) => Promise<ForestResponse>,
    invokeCommand: (instanceId: string, command: string, arg?: any) => Promise<ForestResponse>
}

class NoopForestClient implements IForestClient {
    navigate: (template: string) => Promise<ForestResponse> = () => Promise.reject();
    invokeCommand: (instanceId: string, command: string, arg?: any) => Promise<ForestResponse> = () => Promise.reject();
}

export const NoopClient = new NoopForestClient();