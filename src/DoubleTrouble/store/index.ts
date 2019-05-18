import { Option } from "ts-option";
import { User, Game, IGameListing } from "DTCore/models";

export interface ILoginRegisterFormData {
    FormType: "login" | "register";
    EmailAddress: string;
    Password: string;
}

export interface IUserData {
    Token: Option<string>;
    AuthedUser: Option<User>;
}

export interface ILobbyData {
    AvailableGames: Option<IGameListing[]>;
}

export interface IGameData {
    CurrentGame: Option<Game>;
}

export interface IApplicationState {
    User: IUserData;
    AuthForm: ILoginRegisterFormData;
    LobbyData: ILobbyData;
    GameData: IGameData;
}
