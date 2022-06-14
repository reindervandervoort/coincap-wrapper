/* eslint-disable class-methods-use-this */
import axios, { AxiosResponse } from "axios";
import logger from "../../middleware/logger";
import IBase from "../../service-layer/controllers/models/base.interface";

export default abstract class BaseService {
  protected static _get<T extends IBase>(baseUrl: string, id: string): Promise<T> {
    const config = {
      method: "get",
      url: `${baseUrl}/${id}`,
      headers: {},
    };
    return axios(config)
      .then((response: AxiosResponse<T, unknown>) => {
        return response.data;
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }

  protected static _create<T extends IBase>(baseUrl: string, item: T): Promise<T> {
    const config = {
      method: "post",
      url: `${baseUrl}`,
      headers: { "Content-Type": "application/json" },
      data: item,
    };
    return axios(config)
      .then((response: AxiosResponse<T, unknown>) => {
        return response.data;
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }

  protected static _update<T extends IBase>(baseUrl: string, item: T): Promise<T> {
    const config = {
      method: "patch",
      url: `${baseUrl}/${item.id}`,
      headers: { "Content-Type": "application/json" },
      data: item,
    };
    return axios(config)
      .then((response: AxiosResponse<T, unknown>) => {
        return response.data;
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }

  protected static _delete(baseUrl: string, id: string): Promise<void> {
    const config = {
      method: "delete",
      url: `${baseUrl}/${id}`,
      headers: {},
    };
    return axios(config)
      .then(() => {
        logger.info(`deleted item with ID: ${id}`);
      })
      .catch((error) => {
        logger.error(error);
        throw error;
      });
  }
}
