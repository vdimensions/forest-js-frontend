import * as Immutable from "immutable";

export const EMPTY_HIERARCHY: RegionMap = { "": [] };

export interface Command {
    name: string,
    displayName: string,
    tooltip: string,
    description: string
}

export type RegionMap = { [region:string]: string[] };
export type CommandMap = { [command:string]: Command };

export interface ViewState<T = any> {
    instanceId: string,
    name: string,
    model: T,
    regions: RegionMap,
    commands: CommandMap,
    links: string[]
}

export class ForestAppState {
    static empty = () => new ForestAppState();
    path: string = '';
    instances: Immutable.Map<string, ViewState> = Immutable.Map<string, ViewState>();
    hierarchy: RegionMap =  EMPTY_HIERARCHY;
}