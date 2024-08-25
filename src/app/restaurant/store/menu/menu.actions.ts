export class GetMenus {
  static readonly type = `${GetMenus.name}`;
  constructor(public pageNumber: any, public pageSize: any) {}
}

export class CreateMenu {
  static readonly type = `${CreateMenu.name}`;
  constructor(public data: FormData) {}
}

