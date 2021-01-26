import * as Immutable from "immutable";

export const EMPTY_HIERARCHY: RegionMap = { "": [] };

export interface Command {
    name: string,
    path: string,
    description: string,
    displayName: string,
    tooltip: string
}

export type RegionMap = { [region: string]: string[] };
export type CommandMap = { [command: string]: Command };
export type ViewStateMap = { [view: string]: ViewState };

export class ViewState {
    readonly id: string;
    readonly name: string;
    readonly model: any;
    readonly regions: RegionMap;
    readonly commands: CommandMap;
    
    constructor({id = "", name = "", model = undefined, regions = {}, commands = {}}) {
        this.id = id;
        this.name = name;
        this.model = model;
        this.regions = regions;
        this.commands = commands;
    }
}

export class ForestAppState {
    static empty = () => new ForestAppState();
    path: string = "";
    // TODO: replace with `ViewStateMap` and avoid using Immutable for public members
    instances: Immutable.Map<string, ViewState> = Immutable.Map<string, ViewState>();
    hierarchy: RegionMap =  EMPTY_HIERARCHY;
}