/* eslint-disable class-methods-use-this */
/* eslint-disable import/prefer-default-export */

/* import/prefer-default-export conflicts with tsoa format */
/* class-methods-use-this conflicts with tsoa format */

import { Controller, Get, Route, SuccessResponse, Tags, Response } from 'tsoa';

@Route('health')
@Tags('Health Checks')
export class HealthController extends Controller {
  @Response(500, 'Server error')
  @SuccessResponse(200, 'Success') 
  @Get('')
  public async get(): Promise<boolean> {
    return true;
  }
}
