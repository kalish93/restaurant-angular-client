export class GetStocks {
  static readonly type = `${GetStocks.name}`;
  constructor(
    public readonly pageNumber: number,
    public readonly pageSize: number
  ) {}
}

export class CreateStock {
  static readonly type = `${CreateStock.name}`;
  constructor(
    public readonly data: any
  ) {}
}
