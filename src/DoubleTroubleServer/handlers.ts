import { WebsocketEvent } from "DTCore/common";
import {
  ActionCase,
  ActionCreators,
  AppAction,
} from "DoubleTrouble/actions";
import { createDatastoreObject } from "./data";
import { getConfig } from "./config";
import * as HashLib from "js-sha256";
import { EventCase } from "../DTCore/common";
import { v4 as uuid } from "uuid";
import { User } from "DTCore/models";
import { ActionCase, ActionCreators } from '../DoubleTrouble/actions/index';

const hashPassword = (p: string) => HashLib.sha256(p);

const config = getConfig();
const getDb = createDatastoreObject(config.db);

interface IActionSuccessResult<T> {
  result: "success";
  response: T;
}

interface IActionErrorResult {
  result: "error";
  message: string;
}

const makeSuccess = <T>(a: T): IActionSuccessResult<T> => {
  return {
    result: "success" as "success",
    response: a,
  };
};

const makeError = (message: string) => ({
  result: "error" as "error",
  message,
});

export type ActionResult<T> =
  | IActionErrorResult
  | IActionSuccessResult<T>;

export type ActionHandler<
  TReqAction extends AppAction,
  TResAction extends AppAction
  > = (action: TReqAction) => Promise<ActionResult<TResAction> | ActionResult<ActionCase<"WS/response/error">>>;

export type AuthenticatedActionHandler<
  TReqAction extends AppAction,
  TResAction extends AppAction
  > = (token: string) => ActionHandler<TReqAction, TResAction>;

const sessions: { [token: string]: { email: string; initiated: Date } } = {};

function createSession(newUser: User) {
  const newToken = uuid();
  sessions[newToken] = { email: newUser.email, initiated: new Date() };
  return newToken;
}

const expireTime = 1000 * 60 * 60 * 24;
setInterval(() => {
  const now: number = new Date().getTime();
  Object.keys(sessions).forEach(tkn => {
    const time = (now - sessions[tkn].initiated.getTime());
    if (time > expireTime) {
      delete sessions[tkn];
    }
  });
}, 1000 * 60 * 60);

const getUserByUsername = async (email: string, password?: string) => {
  const db = await getDb;
  try {
    const doc = await db.users.find({
      selector: {
        email: { $eq: email },
      },
    });
    if (doc.docs.length > 0 && (doc.docs[0].passwordHash === hashPassword(password || ""))) {
      return makeSuccess(doc.docs[0]);
    }
    return makeError("User does not exist");
  } catch (e) {
    throw e;
  }
}

const handleRegister: ActionHandler<
  ActionCase<"WS/register">,
  ActionCase<"WS/auth/result">
> = async (a: ActionCase<"WS/register">) => {
  const db = await getDb;
  try {
    const exUser = await getUserByUsername(a.payload.email);
    if (exUser.result === "success") {
      // user already exists
      return makeSuccess(ActionCreators.errorResponse(a, "Could not create user!"));
    }
    const newUser = await db.createUser({ email: a.payload.email, passwordHash: hashPassword(a.payload.password), handle: a.payload.email, userId: uuid() });
    const newToken = createSession(newUser);
    return makeSuccess(ActionCreators.authResult(newToken));
  } catch (e) {
    return makeSuccess(ActionCreators.errorResponse(a, e));
  }
};

/**
 * handleAuth attempts to find a User with a given email and password hash match.
 * An Option<User> is returned. If a user could be found, it is Some. If not, or
 * there was an error, None is returned.
 * @param a An authentication action from the client.
 */
const handleAuth: ActionHandler<
  ActionCase<"WS/auth">,
  ActionCase<"WS/auth/result">
> = async a => {
  try {
    const u = await getUserByUsername(a.payload.email, a.payload.password);
    if (u.result === "success") {
      return makeSuccess(ActionCreators.authResult(createSession(u.response)));
    }
    return makeSuccess(ActionCreators.errorResponse(a, u.message));
  } catch (e) {
    return makeSuccess(ActionCreators.errorResponse(a, e));
  }
};

const handleGetAuthedUser: AuthenticatedActionHandler<
  ActionCase<"WS/user/me">, ActionCase<"WS/user/me/result">
> = t => async a => {
  try {
    const userResult = await getUserByUsername(sessions[t].email)
    if (userResult.result === "success") {
      return makeSuccess(ActionCreators.receiveCurrentUser({
        userId: userResult.response.userId,
        email: userResult.response.email,
        handle: userResult.response.handle,
      }));
    } else {
      throw new Error("User session not found!");
    }
  } catch (e) {
    return makeSuccess(ActionCreators.errorResponse(a, "User session not found. Please log in again."));
  }
};

export const handleEvent = (e: WebsocketEvent) => {
  return new Promise<ActionResult<AppAction>>((resolve, reject) => {
    const ev: EventCase<typeof e.kind> = e as EventCase<typeof e.kind>;
    if (ev.kind === "action-request") {
      const ac: ActionCase<typeof ev.payload.type> = ev.payload as ActionCase<
        typeof ev.payload.type
      >;
      switch (ac.type) {
        case "WS/auth": return handleAuth(ac).then(resolve);
        case "WS/register": return handleRegister(ac).then(resolve);
      }
    } else if (ev.kind === "token-action-request") {
      const ac: ActionCase<typeof ev.payload.type> = ev.payload as ActionCase<
        typeof ev.payload.type
      >;
      switch(ac.type) {
        case "WS/user/me": return handleGetAuthedUser(ev.token)(ac).then(resolve);
      }
    } else {
      return resolve(makeSuccess(ActionCreators.noop()));
    }
  });
};
