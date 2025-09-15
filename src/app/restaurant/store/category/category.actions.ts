export class GetCategories {
  static readonly type = `${GetCategories.name}`;
  constructor() {}
}

export class GetCategoriesByRestaurant {
  static readonly type = `${GetCategoriesByRestaurant.name}`;
  constructor(public restaurantId: string) {}
}

export class CreateCategory {
  static readonly type = `${CreateCategory.name}`;
  constructor(public payload: { name: string; restaurantId: string }) {}
}

export class UpdateCategory {
  static readonly type = `${UpdateCategory.name}`;
  constructor(public id: string, public payload: { name: string; restaurantId: string }) {}
}

export class DeleteCategory {
  static readonly type = `${DeleteCategory.name}`;
  constructor(public id: string) {}
}

