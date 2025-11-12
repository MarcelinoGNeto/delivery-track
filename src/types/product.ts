export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number | string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}
