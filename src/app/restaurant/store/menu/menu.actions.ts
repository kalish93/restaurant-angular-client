export class GetMenus {
  static readonly type = `${GetMenus.name}`;
  constructor() {}
}

export class CreateMenu {
  static readonly type = `${CreateMenu.name}`;
  constructor(public data: FormData) {}
}

export class DeleteMenu {
  static readonly type = `${DeleteMenu.name}`;
  constructor(public id: string) {}
}
export class UpdateMenu {
  static readonly type = `${UpdateMenu.name}`;
  constructor(public menuId:string, public data: FormData) {}
}
export class GetMenuByRestaurant {
  static readonly type = `${GetMenuByRestaurant.name}`;
  constructor(public restaurantId:any) {}
}

export class UpdateMenuAvailability {
  static readonly type = `${UpdateMenuAvailability.name}`;
  constructor(public menuId: string, public status: string) {}
}
