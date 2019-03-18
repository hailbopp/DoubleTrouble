import { ApplicationState } from "DoubleTrouble/store";
import { ActionCase, AppAction, ActionType } from "DoubleTrouble/actions";

const getStateMember = (k: keyof ApplicationState, s: ApplicationState) => s[k];
type StateComponent = ReturnType<typeof getStateMember>;

type ActionHandler<TState extends StateComponent> = (state: TState, mutate: (newState: Partial<TState>) => TState) => Partial<{ 
    [K in ActionType]: (action: ActionCase<K>) => TState;
}>;

const mutate = <TState extends StateComponent>(oldState: TState) => (newState: Partial<TState>): TState => Object.assign({}, oldState, newState);

type RawActionHandler<TState extends StateComponent> = (action: any) => TState;

export const reduce = <TState extends StateComponent>(initState: TState, actionHandler: ActionHandler<TState> ) => {
    return (state?: TState, action?: AppAction) => {
        if(!action || !state) return initState;

        const handler = actionHandler(state, mutate(state))[action.type] as RawActionHandler<TState>;

        if(handler) {
            return handler(action);
        }

        return state;
    }
};