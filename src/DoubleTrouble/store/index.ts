import { Option } from "ts-option";
import { User, Game } from 'DTCore/models';

export interface UserData {
    AuthedUser: Option<User>;
}

export interface LobbyData {
    AvailableGames: Option<Array<Partial<Game>>>;
}

interface BaseApplicationState {
    User: UserData;
}

export type ApplicationState = BaseApplicationState;
