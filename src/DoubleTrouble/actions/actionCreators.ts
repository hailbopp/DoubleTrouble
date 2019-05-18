import { Action } from "DoubleTrouble/actions/core";
import { ILoginRegisterFormData } from "DoubleTrouble/store";
import { IPartialUser, IGameListing } from "../../DTCore/models";

export const clientActionCreators = {
    noop: () => Action.create("NOOP"),
    // UI actions
    setAuthFormType: (t: ILoginRegisterFormData["FormType"]) => Action.create("UI/AuthForm/form-type/set", t),
    setAuthFormEmail: (email: string) => Action.create("UI/AuthForm/email/set", email),
    setAuthFormPass: (pass: string) => Action.create("UI/AuthForm/password/set", pass),

    // Async request and response actions
    attemptAuth: (username: string, password: string) => Action.create("WS/auth", { email: username, password }),
    register: (email: string, password: string) => Action.create("WS/register", { email, password }),
    authResult: (token: string) => Action.create("WS/auth/result", { token }),

    getCurrentUser: () => Action.create("WS/user/me"),
    receiveCurrentUser: (user: IPartialUser) => Action.create("WS/user/me/result", user),

    requestAvailableGames: () => Action.create("WS/games"),
    respondAvailableGames: (games: IGameListing[]) => Action.create("WS/games/result", games),
};
