// v2.0.1
//
// CoinCap is a useful tool for real-time pricing and market activity for over 1,000
// cryptocurrencies. By collecting exchange data from thousands of markets, we are able to
// offer transparent and accurate data on asset price and availability. 
//
// Our API will offer insight into exactly which exchanges and markets contribute to our
// pricing. 
//
// For all endpoints, a single page offers 100 responses by default and supports up to 2,000
// responses per page upon requests. 
//
// ## Status Codes and Error Response
//
// The following are error codes you may encounter as you use CoinCap.
// Note: all CoinCap requests are GET requests
//
// 200: Successful - this is the data you were looking for
//
// 400-417: Client error - these will often be accompanied by some response in the body that
// will give the user direction on how to change the request. Here are some examples of 400:
// Bad Request responses:
// - 'use valid interval': m1, m5, m15, m30, h1, h2, h6, h12, d1': Interval must be m1 for
// one minute, m5 for 5 minute, m15 for 15 minute, m30 for 30 minute, h1 for one hour, h2
// for 2 hour, h6 for 6 hour, h12 for 12 hour, and d1 for one day
// - 'query requires end': If user includes a start query, there must be an end query
// - 'query requires start': If user includes an end query, there must be a start query
// - 'limit exceeds 2000': bad request, exceeds max limit
// - 'missing exchange': This endpoint requires user to specify exchange in parameters
// - 'missing interval': This endpoint requires user to specify interval (ex: m1, m15, d1,
// etc) in parameters
// - 'missing base': This endpoint requires user to specify base asset (ex: BTC)
// - 'missing quote': This endpoint requires user to specify quote asset (ex: USD)
//
// 500-505: Server Error - Looks like something went down on our end. Try back again soon!
//
// For a full list of HTTP Status Code definitions, please visit
// [here](https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html).
//
// ## Headers
//
// We encourage clients to use compression via the `Accept-Encoding` header.
//
// `Accept-Encoding: gzip` or `Accept-Encoding: deflate`
//
// If you have an API Key use it as a `Bearer Token`. 
//
// Programmatically, set the header field `Authorization=Bearer XXXX`
//
// ## Limits
//
// #### Free Tier (No API Key)
//
// - 200 requests per minute
// - 11 years historical data
//
// #### Free Tier (API Key)
//
// - 500 requests per minute
// - 11 years historical data
//
// ## Request API Key
//
// Click [here](https://coincap.io/api-key) to request your API key

/**
 * /assets
 *
 * GET {{host}}/v2/assets
 *
 * ### Request
 *
 * | Key       | Required | Value   | Description |
 * |-----------|----------|---------|-------------|
 * | search    | optional | bitcoin | search by asset id (bitcoin) or symbol (BTC)    |
 * | ids         | optional | bitcoin | query with multiple ids=bitcoin,ethereum,monero|
 * | limit     | optional | 5          | max limit of 2000                        |
 * | offset    | optional | 1          | offset                                    |
 *
 *
 *
 * ### Response
 *
 * | Key               | Description |
 * |-------------------|-------------|
 * | id                | unique identifier for asset |
 * | rank                | rank is in ascending order - this number is directly associated
 * with the marketcap whereas the highest marketcap receives rank 1 |
 * | symbol            | most common symbol used to identify this asset on an exchange |
 * | name                | proper name for asset |
 * | supply            | available supply for trading |
 * | maxSupply         | total quantity of asset issued |
 * | marketCapUsd      | supply x price |
 * | volumeUsd24Hr     | quantity of trading volume represented in USD over the last 24
 * hours |
 * | priceUsd          | volume-weighted price based on real-time market data, translated to
 * USD |
 * | changePercent24Hr | the direction and value change in the last 24 hours |
 * | vwap24Hr          | Volume Weighted Average Price in the last 24 hours  |
 */
export interface Assets {
    data:      { [key: string]: null | string }[];
    timestamp: number;
}

/**
 * /assets/{{id}}
 *
 * GET {{host}}/v2/assets/bitcoin
 *
 * ### Request
 *
 * | Key       | Required | Value   | Description |
 * |-----------|----------|---------|-------------|
 * | id        | required | bitcoin |  asset id   |
 *
 * ### Response
 *
 * | Key               | Description |
 * |-------------------|-------------|
 * | id                | unique identifier for asset |
 * | rank                | rank is in ascending order - this number is directly associated
 * with the marketcap whereas the highest marketcap receives rank 1 |
 * | symbol            |     most common symbol used to identify this asset on an exchange |
 * | name                | proper name for asset |
 * | supply            | available supply for trading |
 * | maxSupply         | total quantity of asset issued |
 * | marketCapUsd        | supply x price |
 * | volumeUsd24Hr     |     quantity of trading volume represented in USD over the last 24
 * hours |
 * | priceUsd            | volume-weighted price based on real-time market data, translated
 * to USD |
 * | changePercent24Hr | the direction and value change in the last 24 hours |
 * | vwap24Hr            |     Volume Weighted Average Price in the last 24 hours |
 */
export interface AssetsID {
    data:      { [key: string]: null | string };
    timestamp: number;
}

/**
 * /assets/{{id}}/history
 *
 * GET {{host}}/v2/assets/bitcoin/history?interval=d1
 *
 * ### Request
 *
 * | Key       | Required | Value          |
 * Description                                                                 |
 *
 * |-----------|----------|----------------|----------------------------------------------------------------------------|
 * | id        | required | bitcoin        | asset
 * id                                                         |
 * | interval  | required | m1, m5, m15, m30, h1, h2, h6, h12, d1| point-in-time interval.
 * minute and hour intervals represent price at that time, the day interval represents
 * average of 24 hour periods (timezone: UTC) |
 * | start  & end  | optional  | 1528470720000  | UNIX time in milliseconds. omitting will
 * return the most recent asset history. If start is supplied, end is required and vice
 * versa    |
 *
 * ### Response
 *
 * | Key       | Description |
 * |-----------|-------------|
 * | priceUsd  |     volume-weighted price based on real-time market data, translated to USD
 * |
 * | time      | timestamp in UNIX in milliseconds |
 */
export interface AssetsIDHistory {
    data:      AssetsIDHistoryDatum[];
    timestamp: number;
}

export interface AssetsIDHistoryDatum {
    priceUsd: string;
    time:     number;
}

/**
 * /assets/{{id}}/markets
 *
 * GET {{host}}/v2/assets/bitcoin/markets
 *
 * ### Request
 *
 * | Key       | Required | Value          | Description            |
 * |-----------|----------|----------------|-----------------------|
 * | id        | required | bitcoin        | asset id    |
 * | limit     | optional | 5          | max limit of 2000            |
 * | offset    | optional | 1          | offset                        |
 *
 * ### Response
 *
 * | Key        | Description |
 * |------------|-------------|
 * | exchangeId | unique identifier for exchange |
 * | baseId     | unique identifier for this asset, base is asset purchased |
 * | quoteId    | unique identifier for this asset, quote is asset used to purchase based|
 * | baseSymbol | most common symbol used to identify asset, base is asset purchased |
 * | quoteSymbol| most common symbol used to identify asset, quote is asset used to purchase
 * base |
 * | volumeUsd24Hr | volume transacted on this market in last 24 hours |
 * | priceUsd         | the amount of quote asset traded for one unit of base asset |
 * | volumePercent | percent of quote asset volume |
 */
export interface AssetsIDMarkets {
    data:      AssetsIDMarketsDatum[];
    timestamp: number;
}

export interface AssetsIDMarketsDatum {
    exchangeId:    string;
    baseId:        string;
    quoteId:       QuoteID;
    baseSymbol:    string;
    quoteSymbol:   QuoteSymbol;
    volumeUsd24Hr: string;
    priceUsd:      string;
    volumePercent: string;
}

export enum QuoteID {
    Bitcoin = "bitcoin",
    Euro = "euro",
    JapaneseYen = "japanese-yen",
    PolishZloty = "polish-zloty",
    RussianRuble = "russian-ruble",
    SouthKoreanWon = "south-korean-won",
    Tether = "tether",
    UnitedStatesDollar = "united-states-dollar",
}

export enum QuoteSymbol {
    Btc = "BTC",
    Eur = "EUR",
    Jpy = "JPY",
    Krw = "KRW",
    Pln = "PLN",
    Rub = "RUB",
    Usd = "USD",
    Usdt = "USDT",
}

/**
 * /rates
 *
 * GET {{host}}/v2/rates
 *
 * ### Response
 *
 * | Key               | Description |
 * |-------------------|-------------|
 * | id                | unique identifier for asset or fiat |
 * | symbol            | most common symbol used to identify asset or fiat |
 * | currencySymbol    | currency symbol used to identify asset or fiat |
 * | rateUsd            | rate conversion to USD |
 * | type                | type of currency - fiat or crypto |
 */
export interface Rates {
    data:      RatesData[];
    timestamp: number;
}

export interface RatesData {
    id:             string;
    symbol:         string;
    currencySymbol: null | string;
    type:           Type;
    rateUsd:        string;
}

export enum Type {
    Crypto = "crypto",
    Fiat = "fiat",
}

/**
 * /rates/{{id}}
 *
 * GET {{host}}/v2/rates/bitcoin
 *
 * ### Request
 *
 * | Key       | Required | Value   | Description |
 * |-----------|----------|---------|-------------|
 * | id        | required | bitcoin | asset id    |
 *
 * ### Response
 *
 * | Key               | Description |
 * |-------------------|-------------|
 * | id                | unique identifier for asset or fiat |
 * | symbol            | most common symbol used to identify asset or fiat |
 * | currencySymbol    | currency symbol used to identify asset or fiat |
 * | rateUsd            | rate conversion to USD |
 * | type                | type of currency - fiat or crypto |
 */
export interface RatesID {
    data:      RatesData;
    timestamp: number;
}

/**
 * /exchanges
 *
 * GET {{host}}/v2/exchanges
 *
 * ### Response
 *
 * | Key                | Description |
 * |--------------------|-------------|
 * | id                 | unique identifier for exchange |
 * | name                 | proper name of exchange |
 * | rank                 | rank is in ascending order - this number is directly associated
 * with the total exchange volume whereas the highest volume exchange receives rank 1 |
 * | percentTotalVolume | the amount of daily volume a single exchange transacts in relation
 * to total daily volume of all exchanges |
 * | volumeUsd          | daily volume represented in USD |
 * | tradingPairs         | number of trading pairs (or markets) offered by exchange |
 * | socket             | true/false, true = trade socket available, false = trade socket
 * unavailable |
 * | exchangeUrl         | website to exchange |
 * | updated             | UNIX timestamp (milliseconds) since information was received from
 * this exchange |
 */
export interface Exchanges {
    data:      ExchangesData[];
    timestamp: number;
}

export interface ExchangesData {
    id:                 string;
    name:               string;
    rank:               string;
    percentTotalVolume: string;
    volumeUsd:          string;
    tradingPairs:       string;
    socket:             boolean;
    exchangeUrl:        string;
    updated:            number;
}

/**
 * /exchanges/{{id}}
 *
 * GET {{host}}/v2/exchanges/kraken
 *
 * ### Request
 *
 * | Key       | Required | Value   | Description |
 * |-----------|----------|---------|-------------|
 * | id        | required | kraken  | exchange id |
 *
 * ### Response
 *
 * | Key                | Description |
 * |--------------------|-------------|
 * | id                 | unique identifier for exchange |
 * | name                 | proper name of exchange |
 * | rank                 | rank is in ascending order - this number is directly associated
 * with the total exchange volume whereas the highest volume exchange receives rank 1 |
 * | percentTotalVolume |     the amount of daily volume a single exchange transacts in
 * relation to total daily volume of all exchanges |
 * | volumeUsd          | daily volume represented in USD |
 * | tradingPairs         | number of trading pairs (or markets) offered by exchange |
 * | socket             | true/false, true = trade socket available, false = trade socket
 * unavailable |
 * | exchangeUrl         | website to exchange |
 * | updated             | UNIX timestamp (milliseconds) since information was received from
 * this exchange |
 */
export interface ExchangesID {
    data:      ExchangesData;
    timestamp: number;
}

/**
 * /markets
 *
 * GET {{host}}/v2/markets
 *
 * ### Request
 *
 * | Key        | Required | Value      | Description |
 * |------------|----------|------------|-------------|
 * | exchangeId | optional | poloniex   | search by exchange id
 * | baseSymbol | optional | BTC          | returns all containing the base symbol
 * | quoteSymbol| optional | ETH          | returns all containing the quote symbol
 * | baseId     | optional | bitcoin     | returns all containing the base id
 * | quoteId    | optional | ethereum     | returns all containing the quote id
 * | assetSymbol| optional | BTC          | returns all assets containing symbol (base and
 * quote)
 * | assetId    | optional | bitcoin     | returns all assets containing id (base and quote)
 * | limit      | optional | 5          | max limit of 2000
 * | offset     | optional | 1          | offset
 *
 * ### Response
 *
 * | Key                   | Description |
 * |-----------------------|-------------|
 * | exchangeId            | unique identifier for exchange |
 * | rank                    | rank is in ascending order - this number represents the
 * amount of volume transacted by this market in relation to other markets on that exchange
 * |
 * | baseSymbol            | most common symbol used to identify asset, base is asset
 * purchased |
 * | baseId                | unique identifier for this asset, base is asset purchased |
 * | quoteSymbol            | most common symbol used to identify asset, quote is asset used
 * to purchase base |
 * | quoteId                | unique identifier for this asset, quote is asset used to
 * purchase base |
 * | priceQuote            | the amount of quote asset traded for one unit of base asset |
 * | priceUsd                | quote price translated to USD |
 * | volumeUsd24Hr         | volume transacted on this market in last 24 hours |
 * | percentExchangeVolume | the amount of daily volume a single market transacts in
 * relation to total daily volume of all markets on the exchange |
 * | tradesCount24Hr        | number of trades on this market in the last 24 hours |
 * | updated                | UNIX timestamp (milliseconds) since information was received
 * from this particular market |
 */
export interface Markets {
    data:      MarketsDatum[];
    timestamp: number;
}

export interface MarketsDatum {
    exchangeId:            string;
    rank:                  string;
    baseSymbol:            string;
    baseId:                string;
    quoteSymbol:           string;
    quoteId:               string;
    priceQuote:            string;
    priceUsd:              string;
    volumeUsd24Hr:         null | string;
    percentExchangeVolume: null | string;
    tradesCount24Hr:       null | string;
    updated:               number;
}

/**
 * /candles
 *
 * GET {{host}}/v2/candles?exchange=poloniex&interval=h8&baseId=ethereum&quoteId=bitcoin
 *
 *
 * ### Request
 *
 * | Key        | Required | Value                                          | Description |
 * |------------|----------|------------------------------------------------|-------------|
 * | exchange   | required | poloniex                                       | exchange id
 * | interval   | required | m1, m5, m15, m30, h1, h2, h4, h8, h12, d1, w1  | candle
 * interval
 * | baseId     | required | ethereum                                         | base id
 * | quoteId    | required | bitcoin                                         | quote id
 * | start      | optional | 1528410925604                                     | UNIX time
 * in milliseconds. omiting will return the most recent candles
 * | end        | optional | 1528411045604                                  | UNIX time in
 * milliseconds. omiting will return the most recent candles
 *
 * ### Response
 *
 * | Key        | Description |
 * |------------|-------------|
 * | open         | the price (quote) at which the first transaction was completed in a
 * given time period |
 * | high         | the top price (quote) at which the base was traded during the time
 * period |
 * | low         | the bottom price (quote) at which the base was traded during the time
 * period |
 * | close      | the price (quote) at which the last transaction was completed in a given
 * time period |
 * | volume     | the amount of base asset traded in the given time period |
 * | period     | timestamp for starting of that time period, represented in UNIX
 * milliseconds |
 */
export interface Candles {
    data:      CandlesDatum[];
    timestamp: number;
}

export interface CandlesDatum {
    open:   string;
    high:   string;
    low:    string;
    close:  string;
    volume: string;
    period: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAssets(json: string): Assets {
        return cast(JSON.parse(json), r("Assets"));
    }

    public static assetsToJson(value: Assets): string {
        return JSON.stringify(uncast(value, r("Assets")), null, 2);
    }

    public static toAssetsID(json: string): AssetsID {
        return cast(JSON.parse(json), r("AssetsID"));
    }

    public static assetsIDToJson(value: AssetsID): string {
        return JSON.stringify(uncast(value, r("AssetsID")), null, 2);
    }

    public static toAssetsIDHistory(json: string): AssetsIDHistory {
        return cast(JSON.parse(json), r("AssetsIDHistory"));
    }

    public static assetsIDHistoryToJson(value: AssetsIDHistory): string {
        return JSON.stringify(uncast(value, r("AssetsIDHistory")), null, 2);
    }

    public static toAssetsIDMarkets(json: string): AssetsIDMarkets {
        return cast(JSON.parse(json), r("AssetsIDMarkets"));
    }

    public static assetsIDMarketsToJson(value: AssetsIDMarkets): string {
        return JSON.stringify(uncast(value, r("AssetsIDMarkets")), null, 2);
    }

    public static toRates(json: string): Rates {
        return cast(JSON.parse(json), r("Rates"));
    }

    public static ratesToJson(value: Rates): string {
        return JSON.stringify(uncast(value, r("Rates")), null, 2);
    }

    public static toRatesID(json: string): RatesID {
        return cast(JSON.parse(json), r("RatesID"));
    }

    public static ratesIDToJson(value: RatesID): string {
        return JSON.stringify(uncast(value, r("RatesID")), null, 2);
    }

    public static toExchanges(json: string): Exchanges {
        return cast(JSON.parse(json), r("Exchanges"));
    }

    public static exchangesToJson(value: Exchanges): string {
        return JSON.stringify(uncast(value, r("Exchanges")), null, 2);
    }

    public static toExchangesID(json: string): ExchangesID {
        return cast(JSON.parse(json), r("ExchangesID"));
    }

    public static exchangesIDToJson(value: ExchangesID): string {
        return JSON.stringify(uncast(value, r("ExchangesID")), null, 2);
    }

    public static toMarkets(json: string): Markets {
        return cast(JSON.parse(json), r("Markets"));
    }

    public static marketsToJson(value: Markets): string {
        return JSON.stringify(uncast(value, r("Markets")), null, 2);
    }

    public static toCandles(json: string): Candles {
        return cast(JSON.parse(json), r("Candles"));
    }

    public static candlesToJson(value: Candles): string {
        return JSON.stringify(uncast(value, r("Candles")), null, 2);
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
    "Assets": o([
        { json: "data", js: "data", typ: a(m(u(null, ""))) },
        { json: "timestamp", js: "timestamp", typ: 0 },
    ], false),
    "AssetsID": o([
        { json: "data", js: "data", typ: m(u(null, "")) },
        { json: "timestamp", js: "timestamp", typ: 0 },
    ], false),
    "AssetsIDHistory": o([
        { json: "data", js: "data", typ: a(r("AssetsIDHistoryDatum")) },
        { json: "timestamp", js: "timestamp", typ: 0 },
    ], false),
    "AssetsIDHistoryDatum": o([
        { json: "priceUsd", js: "priceUsd", typ: "" },
        { json: "time", js: "time", typ: 0 },
    ], false),
    "AssetsIDMarkets": o([
        { json: "data", js: "data", typ: a(r("AssetsIDMarketsDatum")) },
        { json: "timestamp", js: "timestamp", typ: 0 },
    ], false),
    "AssetsIDMarketsDatum": o([
        { json: "exchangeId", js: "exchangeId", typ: "" },
        { json: "baseId", js: "baseId", typ: "" },
        { json: "quoteId", js: "quoteId", typ: r("QuoteID") },
        { json: "baseSymbol", js: "baseSymbol", typ: "" },
        { json: "quoteSymbol", js: "quoteSymbol", typ: r("QuoteSymbol") },
        { json: "volumeUsd24Hr", js: "volumeUsd24Hr", typ: "" },
        { json: "priceUsd", js: "priceUsd", typ: "" },
        { json: "volumePercent", js: "volumePercent", typ: "" },
    ], false),
    "Rates": o([
        { json: "data", js: "data", typ: a(r("RatesData")) },
        { json: "timestamp", js: "timestamp", typ: 0 },
    ], false),
    "RatesData": o([
        { json: "id", js: "id", typ: "" },
        { json: "symbol", js: "symbol", typ: "" },
        { json: "currencySymbol", js: "currencySymbol", typ: u(null, "") },
        { json: "type", js: "type", typ: r("Type") },
        { json: "rateUsd", js: "rateUsd", typ: "" },
    ], false),
    "RatesID": o([
        { json: "data", js: "data", typ: r("RatesData") },
        { json: "timestamp", js: "timestamp", typ: 0 },
    ], false),
    "Exchanges": o([
        { json: "data", js: "data", typ: a(r("ExchangesData")) },
        { json: "timestamp", js: "timestamp", typ: 0 },
    ], false),
    "ExchangesData": o([
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "rank", js: "rank", typ: "" },
        { json: "percentTotalVolume", js: "percentTotalVolume", typ: "" },
        { json: "volumeUsd", js: "volumeUsd", typ: "" },
        { json: "tradingPairs", js: "tradingPairs", typ: "" },
        { json: "socket", js: "socket", typ: true },
        { json: "exchangeUrl", js: "exchangeUrl", typ: "" },
        { json: "updated", js: "updated", typ: 0 },
    ], false),
    "ExchangesID": o([
        { json: "data", js: "data", typ: r("ExchangesData") },
        { json: "timestamp", js: "timestamp", typ: 0 },
    ], false),
    "Markets": o([
        { json: "data", js: "data", typ: a(r("MarketsDatum")) },
        { json: "timestamp", js: "timestamp", typ: 0 },
    ], false),
    "MarketsDatum": o([
        { json: "exchangeId", js: "exchangeId", typ: "" },
        { json: "rank", js: "rank", typ: "" },
        { json: "baseSymbol", js: "baseSymbol", typ: "" },
        { json: "baseId", js: "baseId", typ: "" },
        { json: "quoteSymbol", js: "quoteSymbol", typ: "" },
        { json: "quoteId", js: "quoteId", typ: "" },
        { json: "priceQuote", js: "priceQuote", typ: "" },
        { json: "priceUsd", js: "priceUsd", typ: "" },
        { json: "volumeUsd24Hr", js: "volumeUsd24Hr", typ: u(null, "") },
        { json: "percentExchangeVolume", js: "percentExchangeVolume", typ: u(null, "") },
        { json: "tradesCount24Hr", js: "tradesCount24Hr", typ: u(null, "") },
        { json: "updated", js: "updated", typ: 0 },
    ], false),
    "Candles": o([
        { json: "data", js: "data", typ: a(r("CandlesDatum")) },
        { json: "timestamp", js: "timestamp", typ: 0 },
    ], false),
    "CandlesDatum": o([
        { json: "open", js: "open", typ: "" },
        { json: "high", js: "high", typ: "" },
        { json: "low", js: "low", typ: "" },
        { json: "close", js: "close", typ: "" },
        { json: "volume", js: "volume", typ: "" },
        { json: "period", js: "period", typ: 0 },
    ], false),
    "QuoteID": [
        "bitcoin",
        "euro",
        "japanese-yen",
        "polish-zloty",
        "russian-ruble",
        "south-korean-won",
        "tether",
        "united-states-dollar",
    ],
    "QuoteSymbol": [
        "BTC",
        "EUR",
        "JPY",
        "KRW",
        "PLN",
        "RUB",
        "USD",
        "USDT",
    ],
    "Type": [
        "crypto",
        "fiat",
    ],
};
