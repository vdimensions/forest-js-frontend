import { Map as ImmutableMap } from "immutable";
import { ViewState, ForestAppState, RegionMap, EMPTY_HIERARCHY } from "./core";
import { ForestResponse } from "./client";

type Mapping<P, Q> = { (state: P) : Q }
type AppStateSelector = Mapping<ForestResponse, ForestAppState>;
type ViewStateSelector = (key: string) => Mapping<ForestAppState, ViewState>;
type RootHierarchySelector = Mapping<ForestAppState, RegionMap>;

const appStateSelectorImpl = (response: ForestResponse) => {
    let instances: ImmutableMap<string, ViewState> = ImmutableMap<string, ViewState>();
    let knownIds = ImmutableMap<string, string>();
    for (let i = 0; i < response.views.length; ++i) {
        const item = response.views[i];
        instances = instances.set(item.id, item);
        knownIds = knownIds.set(item.id, item.id);
    }
    const deleteKnownId = (id: string) => knownIds = knownIds.delete(id);
    response.views.flatMap(v => Object.values(v.regions||{}).flatMap(r => r)).forEach(deleteKnownId);
    const hierarchy: RegionMap = { "": knownIds.valueSeq().toArray() };
    return {
        path: response.path,
        instances: instances,
        hierarchy: hierarchy
    };
};

export const appStateSelector: AppStateSelector = appStateSelectorImpl;

export const viewStateSelector : ViewStateSelector = (key: string) => (appState: ForestAppState) => appState.instances.get(key) as ViewState;

export const rootHierarchySelector: RootHierarchySelector = (state: ForestAppState) => state.hierarchy || EMPTY_HIERARCHY;