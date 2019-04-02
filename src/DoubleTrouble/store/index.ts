import { Option } from "ts-option";
import { User, Game } from 'DTCore/models';



export interface LoginRegisterFormData {
    FormType: "login" | "register";
    EmailAddress: string;
    Password: string;
}

export interface UserData {
    AuthedUser: Option<User>;
}

export interface LobbyData {
    AvailableGames: Option<Array<Partial<Game>>>;
}

export interface ApplicationState {
    User: UserData;

    AuthForm: LoginRegisterFormData;
}

