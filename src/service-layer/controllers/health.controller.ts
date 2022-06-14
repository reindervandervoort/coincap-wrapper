/* eslint-disable class-methods-use-this */
import { Controller, Get, Route, SuccessResponse, Tags, Response } from "tsoa";

@Route("health")
@Tags("Health Checks")
export class HealthController extends Controller {
  @Response(500, "Server error")
  @SuccessResponse(200, "Success")
  @Get("")
  public async get(): Promise<boolean> {
    return true;
  }
}
