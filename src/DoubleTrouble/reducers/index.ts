import { Reducer, combineReducers } from "redux";
import { ApplicationState } from "DoubleTrouble/store";
import { reduce } from "DoubleTrouble/reducers/core";
import defaults from "DoubleTrouble/store/defaults";

import "DoubleTrouble/reducers/extensions";

export const reducers: Reducer<ApplicationState> = combineReducers<ApplicationState>({
    User: reduce(defaults.User, (state, mutate) => ({

        // example usage
        NOOP: action => mutate({})
    })),

    AuthForm: reduce(defaults.AuthForm, (state, mutate) => ({
        "UI/AuthForm/form-type/set": action => mutate({
            FormType: action.payload,
        }),
        "UI/AuthForm/email/set": action => mutate({
            EmailAddress: action.payload,
        }),
        "UI/AuthForm/password/set": action => mutate({
            Password: action.payload,
        }),
    })),
});