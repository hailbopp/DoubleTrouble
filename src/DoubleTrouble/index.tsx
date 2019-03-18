import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Store as ReduxStore, createStore, applyMiddleware, Reducer, StoreEnhancer, AnyAction } from 'redux';

import { ActionLogMiddleware } from "DoubleTrouble/middleware/ActionLogMiddleware";
import { ApplicationState } from 'DoubleTrouble/store';
import { WebsocketReduxAdapterMiddleware } from 'DoubleTrouble/middleware/async';
import Application from 'DoubleTrouble/components/Application';
import { reducers } from 'DoubleTrouble/reducers';

const createDoubleTroubleStore = (reducers: Reducer<ApplicationState, AnyAction>, middlewares: StoreEnhancer) => {    
    return createStore(reducers, middlewares);
}

export const init = (attachElement: HTMLElement) => {
    const middleware = [
        WebsocketReduxAdapterMiddleware,
        ActionLogMiddleware
    ];

    const appStore: ReduxStore<ApplicationState> = createDoubleTroubleStore(reducers, applyMiddleware(...middleware))    
    
    ReactDOM.render(<Application store={appStore}/>, attachElement);
}
