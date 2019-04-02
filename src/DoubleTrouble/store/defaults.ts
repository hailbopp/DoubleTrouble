import { ApplicationState } from "DoubleTrouble/store";
import { none } from "ts-option";

const defaultState: ApplicationState = {
    User: {
        AuthedUser: none,
    },
    AuthForm: {
        FormType: "login",
        EmailAddress: "",
        Password: "",
    }
}

export default defaultState;