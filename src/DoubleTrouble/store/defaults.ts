import { IApplicationState } from "DoubleTrouble/store";
import { none, some } from "ts-option";

const getUserDefault = () => {
    const existingUserToken = localStorage.getItem("dtrbl.user.token");
    return {
        Token: existingUserToken ? some(existingUserToken) : none,
        AuthedUser: none,
    };
};

const defaultState: IApplicationState = {
    User: getUserDefault(),
    AuthForm: {
        FormType: "login",
        EmailAddress: "",
        Password: "",
    },
    LobbyData: {
        AvailableGames: none,
    },
    GameData: {
        CurrentGame: none,
    },
};

export default defaultState;
