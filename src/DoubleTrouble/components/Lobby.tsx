import * as React from "react";
import { IApplicationState } from "DoubleTrouble/store";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "DoubleTrouble/actions";
import { ActionCreators } from '../actions/index';

const mapState = (state: IApplicationState) => ({
    availableGames: state.LobbyData.AvailableGames,
});

const mapDispatch = (dispatch: Dispatch<AppAction>) => ({
    getGames: () => dispatch(ActionCreators.requestAvailableGames()),
});

class Lobby extends React.Component<ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>> {
    private containerStyle: React.CSSProperties = {
    };

    public render() {
        if(this.props.availableGames.isEmpty) {
            this.props.getGames();
        }

        return (
            <div style={this.containerStyle}>
            </div>
        );
    }
}

export default connect(mapState, mapDispatch)(Lobby);
