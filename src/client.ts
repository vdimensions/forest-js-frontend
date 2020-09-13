import { ViewState } from "./core";

export class ForestResponse {
    public static empty = () => new ForestResponse({});

    public readonly path: string;
    public readonly views: ViewState[];

    constructor({path = '', views = []}) {
        this.path = path;
        this.views = views;
    }
}

export interface IForestClient {
    navigate: (template: string) => Promise<ForestResponse>,
    invokeCommand: (instanceId: string, command: string, arg?: any) => Promise<ForestResponse>
}