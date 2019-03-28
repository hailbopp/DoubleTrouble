import * as React from 'react';
import { ApplicationState } from "DoubleTrouble/store";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "DoubleTrouble/actions";
import Scoreboard from './Scoreboard';
import GameBoard from './GameBoard';

const mapState = (state: ApplicationState) => ({
});

const mapDispatch = (dispatch: Dispatch<AppAction>) => ({
});

class GameFrame extends React.Component<ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>> {
    private containerStyle: React.CSSProperties = {
    }

    render() {
        return (
            <div style={this.containerStyle}>
                <Scoreboard />
                <GameBoard />
            </div>
        );
    }
}

export default connect(mapState, mapDispatch)(GameFrame);
