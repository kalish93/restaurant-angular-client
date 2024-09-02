

export class GetRestaurants {
  static readonly type = `${GetRestaurants.name}`;
  constructor(
    public readonly pageNumber: number,
    public readonly pageSize: number
  ) {}
}

export class GetRestaurant {
  static readonly type = `${GetRestaurant.name}`;
  constructor(
    public readonly id: string,
  ) {}
}

export class CreateRestaurant {
  static readonly type = `${CreateRestaurant.name}`;
  constructor(
    public readonly data: any
  ) {}
}
export class AddRestaurantStaff {
  static readonly type = `${AddRestaurantStaff.name}`;
  constructor(
    public readonly data: any
  ) {}
}

export class GetTables {
  static readonly type = `${GetTables.name}`;
  constructor() {}
}

export class CreateTable {
  static readonly type = `${CreateTable.name}`;
  constructor(
    public readonly data: any
  ) {}
}
export class DowloadQrCode {
  static readonly type = `${DowloadQrCode.name}`;
  constructor(
    public readonly tableId: any,
    public readonly tableNumber: any
  ) {}
}

export class UpdateRestaurant {
  static readonly type = `${UpdateRestaurant.name}`;
  constructor(
    public readonly data: any
  ) {}
}

export class DeleteRestaurant {
  static readonly type = `${DeleteRestaurant.name}`;
  constructor(
    public readonly id: any
  ) {}
}
export class UpdateTable {
  static readonly type = `${UpdateTable.name}`;
  constructor(
    public readonly data: any
  ) {}
}

export class DeleteTable {
  static readonly type = `${DeleteTable.name}`;
  constructor(
    public readonly id: any
  ) {}
}
export class GetTable {
  static readonly type = `${GetTable.name}`;
  constructor(
    public readonly id: any
  ) {}
}

export class UpdateRestaurantStaff {
  static readonly type = `${UpdateRestaurantStaff.name}`;
  constructor(
    public readonly data: any,
    public readonly id: any,
  ) {}
}
export class DeleteRestaurantStaff {
  static readonly type = `${DeleteRestaurantStaff.name}`;
  constructor(
    public readonly id: any,
  ) {}
}
