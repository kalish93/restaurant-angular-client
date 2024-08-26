export class GetMenus {
  static readonly type = `${GetMenus.name}`;
  constructor() {}
}

export class CreateMenu {
  static readonly type = `${CreateMenu.name}`;
  constructor(public data: FormData) {}
}

