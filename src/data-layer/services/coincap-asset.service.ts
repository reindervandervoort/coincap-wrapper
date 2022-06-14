import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Assets, AssetsID } from "../models/coincap-types";
import { Asset } from "../models/asset";
import logger from "../../middleware/logger";
import ClientError from "../../service-layer/controllers/models/client.error";

export default class CoincapAssetService {
  public static baseUrl = "https://api.coincap.io/v2/assets";

  public static getAll(
    search?: string,
    ids?: string,
    limit?: number,
    skip?: number,
    sortKey?:
      | "id"
      | "rank"
      | "symbol"
      | "name"
      | "supply"
      | "maxSupply"
      | "marketCapUsd"
      | "volumeUsd24Hr"
      | "priceUsd"
      | "changePercent24Hr"
      | "vwap24Hr",
  ): Promise<Asset[]> {
    if (limit && (limit > 2000 || limit < 1)) {
      throw new ClientError(422, "You can't request that limit");
    }

    return axios(CoincapAssetService.getConfig(search, ids, limit, skip))
      .then((response: AxiosResponse<Assets, unknown>) => {
        return sortKey
          ? CoincapAssetService.sortAssets(response.data.data, sortKey)
          : response.data.data;
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }

  private static getConfig(
    search?: string,
    ids?: string,
    limit?: number,
    skip?: number,
  ): AxiosRequestConfig<void> {
    const searchQuery = search ? `search=${search}` : undefined;
    const idsQuery = ids ? `ids=${ids}` : undefined;
    const responseLimit = limit ? `limit=${ids}` : undefined;
    const responseSkip = skip ? `skip=${ids}` : undefined;

    const combinedQuery =
      searchQuery || idsQuery || responseLimit
        ? `?${[searchQuery, idsQuery, responseLimit, responseSkip].join("&")}`
        : "";

    return {
      method: "get",
      url: `${CoincapAssetService.baseUrl}${combinedQuery}`,
      headers: {},
    };
  }

  private static sortAssets(items: Asset[], key: string) {
    return items.sort((a: Asset, b: Asset) => {
      // object injection not a risk as we are not assigning
      // @ts-ignore
      // eslint-disable-next-line security/detect-object-injection
      if (a[key] < b[key]) return -1;
      // object injection not a risk as we are not assigning
      // @ts-ignore
      // eslint-disable-next-line security/detect-object-injection
      if (a[key] > b[key]) return 1;
      return 0;
    });
  }

  public static get(id: string): Promise<Asset> {
    const config = {
      method: "get",
      url: `${CoincapAssetService.baseUrl}/${id}`,
      headers: {},
    };
    return axios(config)
      .then((response: AxiosResponse<AssetsID, unknown>) => {
        return response.data.data;
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }
}
