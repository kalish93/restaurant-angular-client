export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Restaurant {
  id: string;
  name: string;
  qrCodes: string[];
  menuItems: string[];
  orders: string[];
  users: User[];
  isActive: boolean;
  isOpen: boolean;
  taxRate: number;
  createdAt: string;
}
