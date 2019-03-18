export namespace Action {
    type ActionCreatorFunction = (...args: any[]) => any;
    type ActionCreatorDirectory = {[actionType: string]: ActionCreatorFunction};
    
    export type ActionUnion<T extends ActionCreatorDirectory> = ReturnType<T[keyof T]>

    export interface Action<TActionType extends string> {
        type: TActionType;
    }

    export interface PayloadAction<TActionType extends string, TPayload> extends Action<TActionType> {
        payload: TPayload;
    }
    
    export function create<TActionType extends string>(type: TActionType): Action<TActionType>
    export function create<TActionType extends string, TPayload>(type: TActionType, payload: TPayload): PayloadAction<TActionType, TPayload>
    export function create<TActionType extends string, TPayload>(type: TActionType, payload?: TPayload) {
        return { type, payload };
    }
}