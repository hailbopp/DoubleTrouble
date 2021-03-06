import * as Websocket from "isomorphic-ws";
import { DiscriminateUnion } from "DTCore/utils";
import { AppAction } from "DoubleTrouble/actions";
import { ClientAction } from '../DoubleTrouble/actions/index';

interface IBaseMessage<TKind extends string, TPayload> {
    kind: TKind;
    payload: TPayload;
}

type AuthenticatedMessage<TKind extends string, TPayload> = IBaseMessage<TKind, TPayload> & {
    token: string;
}

// Websocket Events
export type Heartbeat = IBaseMessage<"ping" | "pong", undefined>;

export type UnauthenticatedReduxActionRequest = IBaseMessage<"action-request", ClientAction>;
export type ReduxActionResponse = IBaseMessage<"action-response", AppAction>;
export type AuthenticatedReduxActionRequest = AuthenticatedMessage<"token-action-request", ClientAction>;

// export type RequestConfiguration = Message<"cfg-request", undefined>;
// export type LdapConfig = Message<'ldap-cfg', LdapConfiguration>;

// export type Auth = Message<'auth', Credentials>;
// export type InvalidCredentials = Message<'invalid-creds', Credentials>;
// export type SuccessfulAuth = Message<'auth-success', undefined>;
// export type LdapErrorResponse = Message<"ldap-err", LdapError>;

// export type PersonData = Message<"person-batch", Array<LdapPerson>>;

export type WebsocketEvent =
    | Heartbeat
    | UnauthenticatedReduxActionRequest
    | ReduxActionResponse
    | AuthenticatedReduxActionRequest
    ;

export type WebsocketEventKind = ReturnType<(t: WebsocketEvent) => typeof t.kind>;

export const PING: Heartbeat = {kind: "ping", payload: undefined};
export const PONG: Heartbeat = {kind: "pong", payload: undefined};

export type EventCase<U extends WebsocketEventKind> = DiscriminateUnion<WebsocketEvent,"kind", U>;
type HandlerFunction<K extends WebsocketEventKind> = (data: EventCase<K>) => void;

interface Handler<K extends WebsocketEventKind> {
    eventKind: K;
    fn: HandlerFunction<K>;
}

export const deserializeMessage = (s: string) => {
    const parsed = JSON.parse(s);
    const msg = parsed as {kind: WebsocketEventKind};
    const result: EventCase<typeof msg.kind> = parsed as EventCase<typeof msg.kind>;
    return result;
};

type WS = Websocket | WebSocket;
export interface DTWebsocket {
    ws: WS;
    on: <TKind extends WebsocketEventKind>(eventKind: TKind, handler: HandlerFunction<TKind>) => void;
    emit: <TKind extends WebsocketEventKind>(event: EventCase<TKind>) => void;
}

// Websocket emitters and handlers
export const DoubleTroubleWebsocket = (initializer: Websocket | string, initialize = false) => {
    const ws: WS = (typeof initializer === "string")
        ? new Websocket(initializer)
        : initializer;

    if(!ws) { throw new Error(); }

    ws.onerror = (e) => {
        console.log(e);
    };

    const handlers: Array<Handler<any>> = [];
    ws.onmessage = (d) => {
        const deserialized = deserializeMessage(d.data.toString());
        handlers
            .filter(h => h.eventKind === deserialized.kind)
            .map(h => h as Handler<typeof deserialized.kind>)
            .forEach(h => h.fn(deserialized));
    };

    const pSocket: DTWebsocket = {
        ws,
        on: <TKind extends WebsocketEventKind>(eventKind: TKind, handler: HandlerFunction<TKind>) => {
            const newHandler: Handler<TKind> = {
                fn: handler,
                eventKind,
            };
            handlers.push(newHandler);
            // ws.on("message", (w: Websocket, data: string) => {
            //     const deserialized = deserializeMessage(data.toString());
            //     if(deserialized.kind === eventKind) {
            //         handler(deserialized as EventCase<TKind>);
            //     }
            // });
        },
        emit: <TKind extends WebsocketEventKind>(event: EventCase<TKind>) => {
            if(ws.readyState === ws.OPEN) {
                ws.send(JSON.stringify(event));
            } else {
                setTimeout(() => pSocket.emit(event), 100);
            }
        },
    };

    return pSocket;
};
