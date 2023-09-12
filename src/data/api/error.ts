export class APIError extends Error {
  status: number;
  requestIdentifier: string;

  constructor(status: number, requestIdentifier: string, error: any) {
    super(error.message || status);

    this.name = this.constructor.name;
    this.status = status;
    this.requestIdentifier = requestIdentifier;
  }
}
