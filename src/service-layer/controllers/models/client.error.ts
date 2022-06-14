export default class ClientError extends Error {
  status: number | undefined;

  reason: string | undefined;

  constructor(_status?: number | undefined, message?: string | undefined) {
    super(message);
    this.status = _status;
  }
}
