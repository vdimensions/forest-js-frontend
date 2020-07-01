import { ViewState } from "./core";

export class ForestResponse {
    public static empty = () => new ForestResponse();

    public readonly path: string;
    public readonly views: ViewState[];

    constructor(data : any = undefined) {
        this.path = data?.path || '';
        this.views = data?.views || [];
    }
}
export type ForestPayload<T> = 
    | NonNullable<T>
    | NonNullable<string>
    | undefined

export interface IForestClient {
    navigate: (template: string) => Promise<ForestResponse>,
    invokeCommand: (instanceId: string, command: string, arg?: any) => Promise<ForestResponse>
}