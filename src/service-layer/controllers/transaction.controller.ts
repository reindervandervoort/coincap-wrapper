/* eslint-disable class-methods-use-this */
import { Controller, Route, SuccessResponse, Tags, Response, Post, Body, Get } from "tsoa";
import TransactionService from "../../data-layer/services/transaction.service";
import RespponseCodeDescription from "./models/response-code-descriptions";
import Transaction from "./models/transaction";
import ITransaction from "./models/transaction.interface";
import { UUID } from "./models/uuid";

@Route("Transaction")
@Tags("Transaction")
export class TransactionController extends Controller {
  @Response(500, RespponseCodeDescription.serverError)
  @Response(422, RespponseCodeDescription.unprocessableEntity)
  @SuccessResponse(200, RespponseCodeDescription.success)
  @Get("{id}")
  public get(id: UUID): Promise<Transaction> {
    return TransactionService.get(id);
  }

  @Response(500, RespponseCodeDescription.serverError)
  @SuccessResponse(201, RespponseCodeDescription.created)
  @Post("")
  public post(@Body() body: ITransaction): Promise<Transaction> {
    return TransactionService.create(body);
  }
}
