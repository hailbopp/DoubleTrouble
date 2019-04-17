import { ApplicationState } from "DoubleTrouble/store";
import { none, some } from "ts-option";
import { User } from "DTCore/models";

const getUserDefault = () => {
    const existingUser = localStorage.getItem("dtrbl.user");
    return {
        AuthedUser: existingUser ? some(JSON.parse(existingUser) as User) : none,
    };
}

const defaultState: ApplicationState = {
    User: getUserDefault(),
    AuthForm: {
        FormType: "login",
        EmailAddress: "",
        Password: "",
    }
}

export default defaultState;