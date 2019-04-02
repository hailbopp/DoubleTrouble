import * as React from "react";
import { ApplicationState } from "DoubleTrouble/store";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppAction, ActionCreators } from "DoubleTrouble/actions";
import { v4 as uuid } from "uuid";
import {
  WithStyles,
  createStyles,
  Theme,
  TextField,
  withStyles,
  Dialog,
  Button
} from "@material-ui/core";

export interface AuthFormProps {
  open: boolean;
}

const mapState = (state: ApplicationState) => ({
  emailFieldValue: state.AuthForm.EmailAddress,
  passFieldValue: state.AuthForm.Password
});

const mapDispatch = (dispatch: Dispatch<AppAction>) => ({
  handleEmailChange: (v: string) =>
    dispatch(ActionCreators.setAuthFormEmail(v)),
  handlePassChange: (v: string) => dispatch(ActionCreators.setAuthFormPass(v))
});

const containerStyle = (theme: Theme) =>
  createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit,
      width: 200
    }
  });

class AuthForm extends React.Component<
  AuthFormProps &
    ReturnType<typeof mapState> &
    ReturnType<typeof mapDispatch> &
    WithStyles<typeof containerStyle>
> {
  private formId = "auth_" + uuid();

  private handleFieldChange: React.ChangeEventHandler<
    HTMLInputElement
  > = e => {};

  render() {
    return (
      <Dialog open={this.props.open}>
        <div>
          <form className={this.props.classes.container}>
            <TextField
              label="Email"
              name={this.formId + "_email"}
              className={this.props.classes.textField}
              value={this.props.emailFieldValue}
              type="email"
              onChange={this.handleFieldChange}
              margin="normal"
            />
            <br/>
            <TextField
              label="Password"
              name={this.formId + "_pass"}
              className={this.props.classes.textField}
              value={this.props.passFieldValue}
              type="password"
              onChange={this.handleFieldChange}
              margin="normal"
            />
            <br/>
            <Button color="primary" variant="contained">Log in</Button>
          </form>
        </div>
      </Dialog>
    );
  }
}

export default withStyles(containerStyle)(
  connect(
    mapState,
    mapDispatch
  )(AuthForm)
);
