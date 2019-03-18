import { Option } from 'ts-option';

export interface UnansweredQuestion {
    questionId: number;
    points: number;
    answerBody: string;
}

export type AnsweredQuestion = UnansweredQuestion & {
    correctResponse: Option<string>; // Will be Some<string> if the question has been answered.
}

export type Question =
    | UnansweredQuestion
    | AnsweredQuestion;

export interface BoardCategory {
    categoryId: number;
    title: string;
    questions: Array<Question>;
}

export type Board = Array<BoardCategory>;

export interface Player {
    name: string;
    score: number;
}

export interface Game {
    gameId: number;
    joinCode: string;
    boardState: Board;
}