import * as React from 'react';
import { ApplicationState } from "DoubleTrouble/store";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "DoubleTrouble/actions";
import Header from './Header';
import { FONT_FAMILY } from 'DoubleTrouble/style';

const mapState = (state: ApplicationState) => ({
});

const mapDispatch = (dispatch: Dispatch<AppAction>) => ({
})

class AppFrame extends React.Component<ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>> {
    private containerStyle: React.CSSProperties = {
        fontFamily: FONT_FAMILY,
    }

    render() {
        return (
            <div style={this.containerStyle}>
                <Header />
            </div>
        );
    }
}

export default connect(mapState, mapDispatch)(AppFrame);
