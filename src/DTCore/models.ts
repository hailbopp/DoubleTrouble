import { Option } from "ts-option";
import { MaybeDocument } from "nano";

type Guid = string;

type UserID = Guid;
type PlayerID = Guid;
type GameID = Guid;

export interface IUserCredentials {
    username: string;
    passwordHash: string;
}

export interface ITriviaSolution {
    solutionText: string;
    playerId: PlayerID;
    isCorrect: Option<boolean>;
}

export type TriviaQuestionScoringType =
    | "standard"
    | "daily-double";

interface IBaseTriviaQuestion {
    questionId: number;
    points: number;
}

type UnrevealedTriviaQuestion = IBaseTriviaQuestion & {
    status: "unrevealed";
};

type RevealedTriviaQuestion = IBaseTriviaQuestion & {
    status: "revealed";
    questionBody: string;
    proposedSolutions: ITriviaSolution[];
};

export type TriviaQuestion =
    | UnrevealedTriviaQuestion
    | RevealedTriviaQuestion;

export interface ITriviaCategory {
    categoryId: number;
    title: string;
    questions: TriviaQuestion[];
}

export type Board = ITriviaCategory[];

export interface IPartialUser {
    userId: UserID;
    email: string;
    handle: string;
}

type IUser = IPartialUser & {
    passwordHash: string;
};

export type User = MaybeDocument & IUser;

export interface IGamePlayer {
    playerId: PlayerID;
    userId: UserID;
    score: number;
}

export type RoundRulesType =
    | "FreePlay"
    | "Basic"
    | "Double"
    | "Final";

export interface IGameRound {
    roundNumber: number;
    rulesType: RoundRulesType;
    board: Board;
}

export interface IGameListing {
    gameId: GameID;
    created: Date;
    createdBy: UserID;
}

interface IGame {
    gameId: GameID;
    created: Date;
    createdBy: UserID;
    active: boolean;
    joinCode: string;
    players: IGamePlayer[];
    rounds: IGameRound[];
}

export type Game = IGame & MaybeDocument;
