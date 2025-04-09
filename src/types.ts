export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo_url?: string;
  sent?: boolean;
  read?: boolean;
  combo?: boolean;
  valor: number;
  deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
