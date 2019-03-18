import { Action } from "DoubleTrouble/actions/core"
import { DiscriminateUnion } from "DTCore/utils";

export const ActionCreators = {
    // setLoginFieldValue: (field: AuthFieldName, value: string) => Action.create("UI/SET-AUTH-FIELD-VALUE", {field: field, value: value}),

    // submitLoginForm: (username: string, password: string) => Action.create("CONTROL/SUBMIT-AUTH-FORM", { username, password }),
    // setAuthenticated: (hasAuthed: boolean) => Action.create("CONTROL/SET-AUTHENTICATED", hasAuthed),

    // requestLdapConfiguration: () => Action.create("WS/REQ-LDAP-CFG"),
    // receiveLdapConfiguration: (cfg: LdapConfiguration) => Action.create("WS/RX-LDAP-CFG", cfg),
    // receivePersonBatch: (batch: Array<LdapPerson>) => Action.create("WS/RX-PERSON-BATCH", batch),    

    noop: () => Action.create("NOOP")
}

export type AppAction = Action.ActionUnion<typeof ActionCreators>;

const getActionType = (a: AppAction) => a.type;
export type ActionType = ReturnType<typeof getActionType>;
export type ActionCase<T extends ActionType> = DiscriminateUnion<AppAction, "type", T>;
