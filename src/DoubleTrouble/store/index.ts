import { Option } from "ts-option";
import { User, Game } from "DTCore/models";

export interface ILoginRegisterFormData {
    FormType: "login" | "register";
    EmailAddress: string;
    Password: string;
}

export interface IUserData {
    AuthedUser: Option<User>;
}

export interface ILobbyData {
    AvailableGames: Option<Array<Partial<Game>>>;
}

export interface IApplicationState {
    User: IUserData;

    AuthForm: ILoginRegisterFormData;
}
