import * as React from 'react';
import {Store as ReduxStore} from 'redux';
import { ApplicationState } from '../store';
import { Provider } from 'react-redux';
import AppFrame from './AppFrame';

class ApplicationComponent extends React.PureComponent<{ store: ReduxStore<ApplicationState> }> {
    render() { 
        return (
            <Provider store={this.props.store}>
                <AppFrame />
            </Provider>
        );
    }
}

export default ApplicationComponent;
