import { Map as ImmutableMap } from "immutable";
import { ViewState, ForestAppState, RegionMap, EMPTY_HIERARCHY } from "./core";
import { ForestResponse } from "./client";

type Mapping<P, Q> = { (state: P) : Q }
type AppStateSelector = Mapping<ForestResponse, ForestAppState>;
type ViewStateSelector = <T> (key: string) => Mapping<ForestAppState, ViewState<T>>;
type RootHierarchySelector = Mapping<ForestAppState, RegionMap>;

const appStateSelectorImpl = (response: ForestResponse) => {
    let instances: ImmutableMap<string, ViewState> = ImmutableMap<string, ViewState>();
    let knownIds = ImmutableMap<string, string>();
    for (let i = 0; i < response.views.length; ++i) {
        let item = response.views[i];
        instances = instances.set(item.instanceId, item);
        knownIds = knownIds.set(item.instanceId, item.instanceId);
    }
    const deleteKnownId = (id: string) => knownIds = knownIds.delete(id);
    for (let j = 0; j < response.views.length; ++j) {
        Object.keys(response.views[j].regions).flatMap(v => response.views[j].regions[v]).forEach(deleteKnownId);
    }
    let hierarchy: RegionMap = { "": knownIds.valueSeq().toArray() };
    return {
        path: response.path,
        instances: instances,
        hierarchy: hierarchy
    };
};

export const appStateSelector: AppStateSelector = appStateSelectorImpl;

export const viewStateSelector : ViewStateSelector = <T> (key: string) => (appState: ForestAppState) => appState.instances.get(key) as ViewState<T>;

export const rootHierarchySelector: RootHierarchySelector = (state: ForestAppState) => state.hierarchy || EMPTY_HIERARCHY;

export default { }