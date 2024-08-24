

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
