import { Reducer, combineReducers, AnyAction } from "redux";
//import { some, none } from "ts-option";
import { ApplicationState } from "DoubleTrouble/store";
//import { reduce } from "DoubleTrouble/reducers/core";
//import defaults from "DoubleTrouble/store/defaults";

import "DoubleTrouble/reducers/extensions";

export const reducers: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    a: (s, a:AnyAction) => ({})
});