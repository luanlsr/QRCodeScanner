export interface Person {
  id: string;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  photo_url?: string;
  sent?: boolean;
  read?: boolean;
  valor: number;
  deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
}
