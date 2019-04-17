import { Action } from "DoubleTrouble/actions/core";
import { DiscriminateUnion } from "DTCore/utils";
import { ILoginRegisterFormData } from "DoubleTrouble/store";
import { User } from "DTCore/models";

const actionCreators = {
    noop: () => Action.create("NOOP"),

    // UI actions
    setAuthFormType: (t: ILoginRegisterFormData["FormType"]) => Action.create("UI/AuthForm/form-type/set", t),
    setAuthFormEmail: (email: string) => Action.create("UI/AuthForm/email/set", email),
    setAuthFormPass: (pass: string) => Action.create("UI/AuthForm/password/set", pass),

    // Websocket request actions
    attemptAuth: (username: string, password: string) => Action.create("WS/auth", {email: username, password}),
    register: (email: string, password: string) => Action.create("WS/register", { email, password }),

    // Websocket responses
    authResult: (result: User) => Action.create("WS/auth/result", { result }),
    registerResult: (result: User) => Action.create("WS/register/result", { result }),
};

export type ClientAction = Action.ActionUnion<typeof actionCreators>;

export const ActionCreators = Object.assign({}, actionCreators, {
    actionResponse:
        <TRequest extends ClientAction, TResponse extends ClientAction>(request: TRequest, response: TResponse, status?: { code: number; message: string; }) =>
            Action.create("WS/response", { request, response, status }),

    errorResponse: <TRequest extends ClientAction>(request: TRequest, message: string) =>
        Action.create("WS/response/error", {request, message}),
});

export type AppAction = Action.ActionUnion<typeof ActionCreators>;

const getActionType = (a: AppAction) => a.type;
export type ActionType = ReturnType<typeof getActionType>;
export type ActionCase<T extends ActionType> = DiscriminateUnion<AppAction, "type", T>;
