import { Action } from "DoubleTrouble/actions/core";
import { DiscriminateUnion } from "DTCore/utils";
import { clientActionCreators } from "./actionCreators";

export type ClientAction = Action.ActionUnion<typeof clientActionCreators>;

export const ActionCreators = Object.assign({}, clientActionCreators, {
    actionResponse:
        <TRequest extends ClientAction, TResponse extends ClientAction, TError extends string>(request: TRequest, response: TResponse, err?: TError) =>
            Action.create("WS/response", { request, response, status: err ? "ok" : "error", err }),

    errorResponse: <TRequest extends ClientAction>(request: TRequest, message: string) =>
        Action.create("WS/response/error", {request, message}),
});

export type AppAction = Action.ActionUnion<typeof ActionCreators>;

const getActionType = (a: AppAction) => a.type;
export type ActionType = ReturnType<typeof getActionType>;
export type ActionCase<T extends ActionType> = DiscriminateUnion<AppAction, "type", T>;
