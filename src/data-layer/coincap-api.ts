// To parse this data:
//
//   import { Convert, CoincapAPI } from "./file";
//
//   const coincapAPI = Convert.toCoincapAPI(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface CoincapAPI {
    info:  Info;
    item:  CoincapAPIItem[];
    event: Event[];
}

export interface Event {
    listen: Listen;
    script: Script;
}

export enum Listen {
    Prerequest = "prerequest",
    Test = "test",
}

export interface Script {
    type: Type;
    exec: string[];
}

export enum Type {
    TextJavascript = "text/javascript",
}

export interface Info {
    _postman_id:  string;
    name:         string;
    description:  string;
    schema:       string;
    _exporter_id: string;
}

export interface CoincapAPIItem {
    name:         string;
    item:         PurpleItem[];
    description?: string;
    event:        Event[];
}

export interface PurpleItem {
    name:        string;
    item:        FluffyItem[];
    description: string;
    event:       Event[];
}

export interface FluffyItem {
    name:     string;
    request:  Request;
    response: Response[];
}

export interface Request {
    method:       Method;
    header:       any[];
    url:          URL;
    description?: string;
}

export enum Method {
    Get = "GET",
}

export interface URL {
    raw:    string;
    host:   Host[];
    path:   string[];
    query?: Query[];
}

export enum Host {
    Host = "{{host}}",
}

export interface Query {
    key:   string;
    value: string;
}

export interface Response {
    name:                     string;
    originalRequest:          Request;
    status:                   Status;
    code:                     number;
    _postman_previewlanguage: PostmanPreviewlanguage;
    header:                   Header[];
    cookie:                   any[];
    body:                     string;
}

export enum PostmanPreviewlanguage {
    JSON = "json",
}

export interface Header {
    key:         string;
    value:       string;
    name:        string;
    description: string;
}

export enum Status {
    Ok = "OK",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toCoincapAPI(json: string): CoincapAPI {
        return cast(JSON.parse(json), r("CoincapAPI"));
    }

    public static coincapAPIToJson(value: CoincapAPI): string {
        return JSON.stringify(uncast(value, r("CoincapAPI")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "CoincapAPI": o([
        { json: "info", js: "info", typ: r("Info") },
        { json: "item", js: "item", typ: a(r("CoincapAPIItem")) },
        { json: "event", js: "event", typ: a(r("Event")) },
    ], false),
    "Event": o([
        { json: "listen", js: "listen", typ: r("Listen") },
        { json: "script", js: "script", typ: r("Script") },
    ], false),
    "Script": o([
        { json: "type", js: "type", typ: r("Type") },
        { json: "exec", js: "exec", typ: a("") },
    ], false),
    "Info": o([
        { json: "_postman_id", js: "_postman_id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "description", js: "description", typ: "" },
        { json: "schema", js: "schema", typ: "" },
        { json: "_exporter_id", js: "_exporter_id", typ: "" },
    ], false),
    "CoincapAPIItem": o([
        { json: "name", js: "name", typ: "" },
        { json: "item", js: "item", typ: a(r("PurpleItem")) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "event", js: "event", typ: a(r("Event")) },
    ], false),
    "PurpleItem": o([
        { json: "name", js: "name", typ: "" },
        { json: "item", js: "item", typ: a(r("FluffyItem")) },
        { json: "description", js: "description", typ: "" },
        { json: "event", js: "event", typ: a(r("Event")) },
    ], false),
    "FluffyItem": o([
        { json: "name", js: "name", typ: "" },
        { json: "request", js: "request", typ: r("Request") },
        { json: "response", js: "response", typ: a(r("Response")) },
    ], false),
    "Request": o([
        { json: "method", js: "method", typ: r("Method") },
        { json: "header", js: "header", typ: a("any") },
        { json: "url", js: "url", typ: r("URL") },
        { json: "description", js: "description", typ: u(undefined, "") },
    ], false),
    "URL": o([
        { json: "raw", js: "raw", typ: "" },
        { json: "host", js: "host", typ: a(r("Host")) },
        { json: "path", js: "path", typ: a("") },
        { json: "query", js: "query", typ: u(undefined, a(r("Query"))) },
    ], false),
    "Query": o([
        { json: "key", js: "key", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
    "Response": o([
        { json: "name", js: "name", typ: "" },
        { json: "originalRequest", js: "originalRequest", typ: r("Request") },
        { json: "status", js: "status", typ: r("Status") },
        { json: "code", js: "code", typ: 0 },
        { json: "_postman_previewlanguage", js: "_postman_previewlanguage", typ: r("PostmanPreviewlanguage") },
        { json: "header", js: "header", typ: a(r("Header")) },
        { json: "cookie", js: "cookie", typ: a("any") },
        { json: "body", js: "body", typ: "" },
    ], false),
    "Header": o([
        { json: "key", js: "key", typ: "" },
        { json: "value", js: "value", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "description", js: "description", typ: "" },
    ], false),
    "Listen": [
        "prerequest",
        "test",
    ],
    "Type": [
        "text/javascript",
    ],
    "Method": [
        "GET",
    ],
    "Host": [
        "{{host}}",
    ],
    "PostmanPreviewlanguage": [
        "json",
    ],
    "Status": [
        "OK",
    ],
};
