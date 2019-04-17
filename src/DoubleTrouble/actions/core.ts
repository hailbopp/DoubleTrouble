export namespace Action {
    type ActionCreatorFunction = (...args: any[]) => any;
    type ActionCreatorDirectory = {[actionType: string]: ActionCreatorFunction};

    export type ActionUnion<T extends ActionCreatorDirectory> = ReturnType<T[keyof T]>;

    export interface IAction<TActionType extends string> {
        type: TActionType;
    }

    export interface IPayloadAction<TActionType extends string, TPayload> extends IAction<TActionType> {
        payload: TPayload;
    }

    export function create<TActionType extends string>(type: TActionType): IAction<TActionType>;
    export function create<TActionType extends string, TPayload>(type: TActionType, payload: TPayload): IPayloadAction<TActionType, TPayload>;
    export function create<TActionType extends string, TPayload>(type: TActionType, payload?: TPayload) {
        return { type, payload };
    }
}
