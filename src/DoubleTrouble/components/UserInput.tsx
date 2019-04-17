import * as React from "react";
import { IApplicationState } from "DoubleTrouble/store";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "DoubleTrouble/actions";

const mapState = (state: IApplicationState) => ({
});

const mapDispatch = (dispatch: Dispatch<AppAction>) => ({
});

class UserInput extends React.Component<ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>> {
    private containerStyle: React.CSSProperties = {
    };

    public render() {
        return (
            <div style={this.containerStyle}>
            </div>
        );
    }
}

export default connect(mapState, mapDispatch)(UserInput);
