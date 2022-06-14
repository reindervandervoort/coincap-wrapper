import axios, { AxiosResponse } from "axios";
import { RatesData, RatesID } from "../models/coincap-types";
import logger from "../../middleware/logger";
import IBalance from "../../service-layer/controllers/models/balance.interface";

export default class CoincapRateService {
  public static baseUrl = "https://api.coincap.io/v2/rates";

  public static get(id: string): Promise<RatesData> {
    const config = {
      method: "get",
      url: `${CoincapRateService.baseUrl}/${id}`,
      headers: {},
    };
    return axios(config)
      .then((response: AxiosResponse<RatesID, unknown>) => {
        return response.data.data;
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }

  public static getCurrentUSDValue(balance: IBalance): Promise<number> {
    return CoincapRateService.get(balance.assetId).then((rate: RatesData) => {
      return parseFloat(rate.rateUsd) * balance.quantity;
    });
  }
}
