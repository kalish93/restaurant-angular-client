export class GetStocks {
  static readonly type = `${GetStocks.name}`;
  constructor(
    public readonly pageNumber?: number,
    public readonly pageSize?: number
  ) {}
}

export class CreateStock {
  static readonly type = `${CreateStock.name}`;
  constructor(
    public readonly data: any
  ) {}
}

export class UpdateStock {
  static readonly type = `${UpdateStock.name}`;
  constructor(
    public readonly id: any,
    public readonly data: any
  ) {}
}

export class DeleteStock {
  static readonly type = `${DeleteStock.name}`;
  constructor(
    public readonly id: any
  ) {}
}
