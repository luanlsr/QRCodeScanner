export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUrl?: string;
  sent?: boolean;
  read?: boolean;
  deleted?: boolean;
}
