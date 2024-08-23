export interface User {
  id?: string | null;
  firstName: string;
  middleName: string | null;
  lastName: string | null;
  phoneNumber: string;
  email: string;
  userName: string;
  password: string;
  isActive: boolean;
  roleId: string;
  dateOfBirth: Date | null;
}
