import { Reducer, combineReducers } from "redux";
import { IApplicationState } from "DoubleTrouble/store";
import { reduce } from "DoubleTrouble/reducers/core";
import defaults from "DoubleTrouble/store/defaults";

import "DoubleTrouble/reducers/extensions";
import { some } from "ts-option";

export const reducers: Reducer<IApplicationState> = combineReducers<IApplicationState>({
    User: reduce(defaults.User, (state, utils) => ({
        "WS/auth/result": action => {
            localStorage.setItem("dtrbl.user", JSON.stringify(action.payload.result));
            return utils.mutate({
                AuthedUser: some(action.payload.result),
            });
        },

        // example usage
        // NOOP: action => mutate({}),
    })),

    AuthForm: reduce(defaults.AuthForm, (state, utils) => ({
        "UI/AuthForm/form-type/set": action => utils.mutate({
            FormType: action.payload,
        }),
        "UI/AuthForm/email/set": action => utils.mutate({
            EmailAddress: action.payload,
        }),
        "UI/AuthForm/password/set": action => utils.mutate({
            Password: action.payload,
        }),
        "WS/register": action => utils.mutate({
            Password: "",
        }),
        "WS/auth": action => utils.mutate({
            Password: "",
        }),
    })),
});
