import { Middleware } from "redux";

export const ActionLogMiddleware: Middleware =
    (store) => (next) => (action: any) => {
            console.debug('dispatching', action);
            const result = next(action);
            console.debug('new state', store.getState());
            return result;
        };
    