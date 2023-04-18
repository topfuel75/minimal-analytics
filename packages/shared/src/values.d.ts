type ParamValue = string | number | undefined | null;
type EventParams = Record<string, ParamValue> | [string, ParamValue][];
declare const clientKey = "clientId";
declare const sessionKey = "sessionId";
declare const counterKey = "sessionCount";
declare function getDocument(): {
    location: string;
    hostname: string;
    pathname: string;
    referrer: string;
    title: string;
};
declare function getClientId(key?: string): string;
declare function getSessionId(key?: string): string;
declare function getSessionState(firstEvent: boolean): {
    firstVisit: string;
    sessionStart: string;
    sessionCount: string;
};
declare function getEventParams(event: EventParams): string[][];
export { EventParams, clientKey, sessionKey, counterKey, getDocument, getClientId, getSessionId, getSessionState, getEventParams, };
