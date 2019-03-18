import * as React from 'react';
import { ApplicationState } from "DoubleTrouble/store";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "DoubleTrouble/actions";

const mapState = (state: ApplicationState) => ({
});

const mapDispatch = (dispatch: Dispatch<AppAction>) => ({
})

class Header extends React.Component<ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>> {
    render() {
        return (
            <div>
                <h3>DoubleTrouble</h3>
                <hr/>
            </div>
        );
    }
}

export default connect(mapState, mapDispatch)(Header);
