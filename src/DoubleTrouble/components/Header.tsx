import * as React from "react";
import { IApplicationState } from "DoubleTrouble/store";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction } from "DoubleTrouble/actions";
import { APP_NAME } from "DTCore/constants";

const mapState = (state: IApplicationState) => ({
});

const mapDispatch = (dispatch: Dispatch<AppAction>) => ({
});

class Header extends React.Component<ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>> {
    public render() {
        return (
            <div>
                <h3>{APP_NAME}</h3>
                <hr/>
            </div>
        );
    }
}

export default connect(mapState, mapDispatch)(Header);
