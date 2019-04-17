import * as React from "react";
import {Store as ReduxStore} from "redux";
import { IApplicationState } from "../store";
import { Provider } from "react-redux";
import AppFrame from "./AppFrame";

class ApplicationComponent extends React.PureComponent<{ store: ReduxStore<IApplicationState> }> {
    public render() {
        return (
            <Provider store={this.props.store}>
                <AppFrame />
            </Provider>
        );
    }
}

export default ApplicationComponent;
