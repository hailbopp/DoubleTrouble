import { ApplicationState } from "DoubleTrouble/store";
import { ActionCase, AppAction, ActionType } from "DoubleTrouble/actions";

const getStateMember = (k: keyof ApplicationState, s: ApplicationState) => s[k];
type StateComponent = ReturnType<typeof getStateMember>;

interface IReducerUtils<TState extends StateComponent, TAction extends AppAction> {
    mutate: (newState: Partial<TState>) => TState;

    // Select can be used to mutate
    // select: <TField extends string>(selector: (a: TAction) => TField) => (p: Partial<{[K in TField]: TState}>) => TState
}

type ActionHandler<TState extends StateComponent, TAction extends AppAction> = (state: TState, utils: IReducerUtils<TState, TAction>) => Partial<{
    [K in ActionType]: (action: ActionCase<K>) => TState;
}>;

const makeUtils = <TState extends StateComponent>(oldState: TState) => <TAction extends AppAction>(action: TAction): IReducerUtils<TState, TAction> => ({
    mutate: (newState: Partial<TState>) => Object.assign({}, oldState, newState),
    // select: (selector) => (p) => {
    //     const f = selector(action);
    //     if(p[f]) {
    //         return p[f](action);
    //     }
    // }
});

type RawActionHandler<TState extends StateComponent> = (action: any) => TState;

export const reduce = <TState extends StateComponent, TAction extends AppAction>(initState: TState, actionHandler: ActionHandler<TState, TAction>) => {
    return (state?: TState, action?: TAction) => {
        if(!action || !state) { return initState; }

        const handler = actionHandler(state, makeUtils(state)(action))[action.type] as RawActionHandler<TState>;

        if(handler) {
            return handler(action);
        }

        return state;
    };
};
