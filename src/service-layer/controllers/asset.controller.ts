/* eslint-disable class-methods-use-this */
import { Controller, Get, Route, SuccessResponse, Tags, Response, Query } from "tsoa";
import { Asset } from "../../data-layer/models/asset";
import CoincapAssetService from "../../data-layer/services/coincap-asset.service";
import RespponseCodeDescription from "./models/response-code-descriptions";

@Route("Asset")
@Tags("Asset")
export class AssetController extends Controller {
  @Response(500, RespponseCodeDescription.serverError)
  @Response(422, RespponseCodeDescription.unprocessableEntity)
  @SuccessResponse(200, RespponseCodeDescription.success)
  @Get("")
  public getAll(
    @Query() filter?: string,
    @Query() ids?: string,
    @Query() limit?: number,
    @Query() skip?: number,
    @Query()
    sort?:
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
    return CoincapAssetService.getAll(filter, ids, limit, skip, sort);
  }

  @Response(500, RespponseCodeDescription.serverError)
  @Response(422, RespponseCodeDescription.unprocessableEntity)
  @SuccessResponse(200, RespponseCodeDescription.success)
  @Get("{id}")
  public get(id: string): Promise<Asset> {
    return CoincapAssetService.get(id);
  }

  @Response(500, RespponseCodeDescription.serverError)
  @Response(422, RespponseCodeDescription.unprocessableEntity)
  @SuccessResponse(200, RespponseCodeDescription.success)
  @Get("{id}/USD")
  public getUSD(id: string): Promise<number> {
    return CoincapAssetService.get(id).then((asset: Asset) => {
      return parseFloat(asset.priceUsd ?? "NaN");
    });
  }
}
