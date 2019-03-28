import { Option } from 'ts-option';
import { MaybeDocument } from 'nano';

type Guid = string;

type UserID = Guid;
type PlayerID = Guid;
type GameID = Guid;

export interface UserCredentials {
    username: string;
    passwordHash: string;
}

export interface TriviaSolution {
    solutionText: string;
    playerId: PlayerID;
    isCorrect: Option<boolean>;
}

export interface TriviaQuestion {
    questionId: number;
    points: number;
    questionBody: string;
    proposedSolutions: Array<TriviaSolution>;
}

export interface TriviaCategory {
    categoryId: number;
    title: string;
    questions: Array<TriviaQuestion>;
}

export type Board = Array<TriviaCategory>;

interface _User {
    userId: UserID;
    email: string;
    passwordHash: string;
    handle: string;
}
export type User = MaybeDocument & _User;

export interface GamePlayer {
    playerId: PlayerID;
    userId: UserID;
    score: number;
}

export type RoundRulesType =
    | "Basic"
    | "Double"
    | "Final";

export interface GameRound {
    roundNumber: number;
    rulesType: RoundRulesType;
    board: Board;
}

interface _Game {
    gameId: GameID;
    created: Date;
    joinCode: string;
    players: Array<GamePlayer>;
    rounds: Array<GameRound>;
}

export type Game = _Game & MaybeDocument;