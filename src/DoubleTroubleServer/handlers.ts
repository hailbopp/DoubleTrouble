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

const hashPassword = (p: string) => HashLib.sha256(p);

const config = getConfig();
const getDb = createDatastoreObject(config.db);

interface IActionSuccessResult<T extends AppAction> {
  result: "success";
  response: T;
}

interface IActionErrorResult {
  result: "error";
  code: number;
  message: string;
}

const makeSuccess = <T extends AppAction>(a: T): IActionSuccessResult<T> => {
  return {
    result: "success" as "success",
    response: a,
  };
};

const makeError = (code: number, message: string) => ({
  result: "error" as "error",
  code,
  message,
});

export type ActionResult<T extends AppAction> =
  | IActionErrorResult
  | IActionSuccessResult<T>;

export type ActionHandler<
  TReqAction extends AppAction,
  TResAction extends AppAction
> = (action: TReqAction) => Promise<ActionResult<TResAction>>;

const handleRegister: ActionHandler<
  ActionCase<"WS/register">,
  ActionCase<"WS/register/result">
> = async (a: ActionCase<"WS/register">) => {
  const db = await getDb;
  try {
    await db.users.get(a.payload.email);
    return makeError(400, "User could not be created");
  } catch(e) {
    const newUser = await db.createUser({ email: a.payload.email, passwordHash: hashPassword(a.payload.password), handle: a.payload.email, userId: uuid() });
    return makeSuccess(ActionCreators.registerResult(newUser));
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
> = a =>
  getDb
    .then(db =>
      db.users.find({
        selector: {
          email: { $eq: a.payload.email },
          passwordHash: { $eq: hashPassword(a.payload.password) },
        },
      }),
    )
    .then(doc => {
      if (doc.docs.length > 0) {
        return makeSuccess(ActionCreators.authResult(doc.docs[0]));
      }
      return makeError(404, "Not found.");
    })
    .catch((r) => {
      return makeError(404, r);
    });

export const handleEvent = (e: WebsocketEvent) => {
  return new Promise<ActionResult<AppAction>>((resolve, reject) => {
    const ev: EventCase<typeof e.kind> = e as EventCase<typeof e.kind>;
    if (ev.kind === "action-request") {
      const ac: ActionCase<typeof ev.payload.type> = ev.payload as ActionCase<
        typeof ev.payload.type
      >;
      switch(ac.type) {
          case "WS/auth": return handleAuth(ac).then(resolve);
          case "WS/register": return handleRegister(ac).then(resolve);
      }
    } else {
      return resolve(makeSuccess(ActionCreators.noop()));
    }
  });
};
