import { Action } from "DoubleTrouble/actions/core"
import { DiscriminateUnion } from "DTCore/utils";
import { LoginRegisterFormData } from "DoubleTrouble/store";

export const ActionCreators = {
    noop: () => Action.create("NOOP"),

    // UI actions
    setAuthFormType: (t: LoginRegisterFormData["FormType"]) => Action.create("UI/AuthForm/form-type/set", t),
    setAuthFormEmail: (email: string) => Action.create("UI/AuthForm/email/set", email),
    setAuthFormPass: (pass: string) => Action.create("UI/AuthForm/password/set", pass),

    // Websocket actions
    attemptAuth: (username: string, password: string) => Action.create("WS/auth", {username, password}),
    register: (email: string, handle: string, password: string) => Action.create("WS/register", { email, handle, password }),
}

export type AppAction = Action.ActionUnion<typeof ActionCreators>;

const getActionType = (a: AppAction) => a.type;
export type ActionType = ReturnType<typeof getActionType>;
export type ActionCase<T extends ActionType> = DiscriminateUnion<AppAction, "type", T>;
