/* eslint-disable class-methods-use-this */
import { Controller, Get, Route, SuccessResponse, Tags, Response, Post, Delete } from "tsoa";
import WalletService from "../../data-layer/services/wallet.service";
import RespponseCodeDescription from "./models/response-code-descriptions";
import { UUID } from "./models/uuid";
import Wallet from "./models/wallet";

@Route("Wallet")
@Tags("Wallet")
export class WalletController extends Controller {
  @Response(500, RespponseCodeDescription.serverError)
  @Response(422, RespponseCodeDescription.unprocessableEntity)
  @SuccessResponse(200, RespponseCodeDescription.success)
  @Get("{id}")
  public get(id: UUID): Promise<Wallet> {
    return WalletService.get(id);
  }

  @Response(500, RespponseCodeDescription.serverError)
  @Response(422, RespponseCodeDescription.unprocessableEntity)
  @SuccessResponse(200, RespponseCodeDescription.success)
  @Get("{id}/gain")
  public getGain(id: UUID): Promise<number> {
    return WalletService.getGain(id);
  }

  @Response(500, RespponseCodeDescription.serverError)
  @SuccessResponse(201, RespponseCodeDescription.created)
  @Post()
  public post(): Promise<Wallet> {
    return WalletService.create();
  }

  @Response(500, RespponseCodeDescription.serverError)
  @Response(422, RespponseCodeDescription.unprocessableEntity)
  @SuccessResponse(200, RespponseCodeDescription.success)
  @Delete("{id}")
  public delete(id: UUID): Promise<void> {
    return WalletService.delete(id);
  }
}
