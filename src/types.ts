export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  sent?: boolean;
  read?: boolean;
  deleted?: boolean;
}