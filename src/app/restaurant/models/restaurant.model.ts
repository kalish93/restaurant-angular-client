export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Restaurant {
  id: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  category: string[];
  qrCodes: string[];
  menuItems: string[];
  orders: string[];
  users: User[];
  isActive: boolean;
  isOpen: boolean;
  taxRate: number;
  subscription?: 'BASIC' | 'STANDARD' | 'PREMIUM' | string;
  createdAt: string;
}
